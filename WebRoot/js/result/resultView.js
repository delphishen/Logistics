Ext.namespace('Ext.result');

Ext.result.grid = Ext.extend(Ext.grid.GridPanel, {
    constructor: function (app) {
        this.app = app;
        // 数据源
        this.ds = new Ext.data.JsonStore({
            url: path + '/result/getAllResult.do',
            idProperty: 'id',
            //root: 'rows',
            totalProperty: 'results',
            fields: ['id', 'schemeName', 'empName', 'filePath'],
            autoDestroy: true,
            autoLoad: true,
            baseParams: {},
            listeners: {
                'beforeload': function () {
                },
                scope: this
            }
        });
        // 选择框
        this.sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: true
        });
        // 列
        this.cm = new Ext.grid.ColumnModel({
            defaults: {
                width: 150,
                sortable: true
            },
            columns: [new Ext.grid.RowNumberer(), this.sm, {
                header: 'id',
                dataIndex: 'id',
                hidden: true
            }, {
                header: 'filePath',
                dataIndex: 'filePath',
                hidden: true
            }, {
                header: '方案名称',
                dataIndex: 'schemeName'
            }, {
                header: '所属人员',
                dataIndex: 'empName'
            }]
        });
        // 菜单条
        this.tbar = new Ext.Toolbar([{
            xtype: 'button',
            iconCls: 'tag',
            text: '下载报告',
            handler: this.onDown,
            scope: this
        }]);
        // 构造
        Ext.result.grid.superclass.constructor.call(this, {
            region: 'center',
            loadMask: 'loading...',
            columnLines: true,
            clicksToEdit: 1,
            stripeRows: true,
            viewConfig: {
                forceFit: true
            }
        });
    },
    onDown: function (btn) {
        var selects = Ext.eu.getSelects(this);
        if (selects.length == 0) {
            Ext.ux.Toast.msg("信息", "请选择要下载的报告记录！");
            return;
        }
        var select = selects[0].data;

        var url = encodeURI(path
            + '/system/downloadAttach.do?filePath=' + (select.filePath + select.id + '.pdf')
            + '&realName=' + select.schemeName + "-拓扑结果.pdf") ;
        window.location.href = url;
        // alert("ok");
    }
});


/**
 * 入口方法，用于定位动态加载文件
 *
 * @return {}
 */
var resultView = function () {
    this.grid = new Ext.result.grid(this);
    return new Ext.Panel({
        id: 'resultView',
        title: '拓扑结果',
        layout: 'border',
        items: [this.grid]
    })
}