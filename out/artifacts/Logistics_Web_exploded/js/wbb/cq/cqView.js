Ext.namespace('Ext.cq');

Ext.cq.grid = Ext.extend(Ext.grid.GridPanel, {
	constructor : function(app) {
		this.sortNode = null;
		this.app = app;
		// 数据源
		this.ds = new Ext.data.JsonStore({
					url : path + '/wbb/queryCq.do',
					idProperty : 'id',
					root : 'rows',
					totalProperty : 'results',
					fields : ['id', 'kqId', 'kqSortId', 'kqEvolveId',
							'kqSortName', 'name', 'type', 'showFormula',
							'realFormula'],
					autoDestroy : true,
					autoLoad : true,
					baseParams : {
						start : 0,
						limit : 20
					},
					listeners : {
						'beforeload' : function() {
							var sortIds = new Array();
							if (this.sortNode != null) {
								if (this.sortNode.id != 0) {
									sortIds.push(this.sortNode.id);
									sortIds = this.getChildrenIds(sortIds,
											this.sortNode, this);
								}
							}
							var str = "";
							for (var i = 0; i < sortIds.length; i++) {
								str += "'" + sortIds[i] + "',"
							}
							str = str.substring(0, str.lastIndexOf(','));
							Ext.apply(this.getStore().baseParams, {
										'kqSortId' : str
									});
							Ext.apply(this.getStore().baseParams,
									this.app.queryPanel.getQueryParams());
						},
						scope : this
					}
				});
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : false
				});
		// 列
		this.cm = new Ext.grid.ColumnModel({
					defaults : {
						width : 150,
						sortable : true
					},
					/**
					 * 'id', 'kqId', 'kqSortId', 'kqSortName', 'name', 'type',
					 * 'showFormula', 'realFormula'
					 */
					columns : [new Ext.grid.RowNumberer(), this.sm, {
								header : 'id',
								dataIndex : 'id',
								hidden : true
							}, {
								header : 'kqId',
								dataIndex : 'kqId',
								hidden : true
							}, {
								header : 'kqEvolveId',
								dataIndex : 'kqEvolveId',
								hidden : true
							}, {
								header : 'kqSortId',
								dataIndex : 'kqSortId',
								hidden : true
							}, {
								header : 'realFormula',
								dataIndex : 'realFormula',
								hidden : true
							}, {
								header : '结果指标',
								dataIndex : 'name'
							}, {
								header : '指标种类',
								dataIndex : 'kqSortName'
							}, {
								header : '进出口',
								dataIndex : 'type',
								renderer : function(val) {
									if (val == 1) {
										return '进口';
									} else {
										return '出口';
									}
								}
							}, {
								header : '计算关系',
								dataIndex : 'showFormula'
							}]
				});
		// 菜单条
		this.tbar = new Ext.Toolbar([{
					xtype : 'button',
					iconCls : 'add',
					id : 'addCq',
					text : '新增',
					handler : this.onAdd,
					scope : this
				}, {
					xtype : 'button',
					iconCls : 'modify',
					id : 'modifyCq',
					text : '修改',
					handler : this.onModify,
					scope : this
				}, {
					xtype : 'button',
					iconCls : 'delete',
					id : 'deleteCq',
					text : '删除',
					handler : this.onDelete,
					scope : this
				}]);
		// 页码条
		this.bbar = new Ext.PagingToolbar({
					pageSize : 20,
					displayInfo : true,
					store : this.ds
				});
		// 构造
		Ext.cq.grid.superclass.constructor.call(this, {
					region : 'center',
					loadMask : 'loading...',
					columnLines : true,
					stripeRows : true,
					viewConfig : {
						forceFit : true
					},
					listeners : {
						'rowdblclick' : function(grid, index) {
							this.onModify();
						}
					}
				});
	},
	onAdd : function(btn) {
		var win = new Ext.cq.win(this);
		win.setTitle('添加计算指标', 'add');
		win.show();
	},
	onModify : function(btn) {
		var selects = Ext.eu.getSelects(this);
		if (selects.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要修改的记录！");
			return;
		}
		if (selects.length > 1) {
			Ext.ux.Toast.msg("信息", "只能选择一条记录！");
			return;
		}
		this.cq = selects[0].data;
		var win = new Ext.cq.win(this);
		win.form.getForm().findField('id').setValue(this.cq.id);
		win.form.getForm().findField('kqId').setValue(this.cq.kqId);
		win.form.getForm().findField('kqEvolveId').setValue(this.cq.kqEvolveId);
		win.form.getForm().findField('kqSortId').setValue(this.cq.kqSortId);
		win.form.radio.setValue(this.cq.type);
		win.form.getForm().findField('name').setValue(this.cq.name);
		win.form.getForm().findField('realFormula')
				.setValue(this.cq.realFormula);
		win.form.getForm().findField('showFormula')
				.setValue(this.cq.showFormula);
		win.setTitle('修改计算指标', 'modify');
		win.show();
	},
	onDelete : function() {
		var selects = Ext.eu.getSelects(this);
		if (selects.length == 0) {
			Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
			return;
		}
		var cqs = Array();
		for (var i = 0; i < selects.length; i++) {
			var cq = {
				id : selects[i].data.id
			}
			cqs.push(cq);
		}
		Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
					if (btn == 'yes') {
						Ext.eu.ajax(path + '/wbb/deleteCq.do', {
									cqs : Ext.encode(cqs)
								}, function(resp) {
									Ext.ux.Toast.msg('信息', '删除成功');
									this.getStore().reload();
								}, this);
					}
				}, this);
	},
	getChildrenIds : function(arr, node, scope) {
		if (node.hasChildNodes()) {
			node.eachChild(function(child) {
						arr.push(child.id);
						arr.concat(scope.getChildrenIds(arr, child, scope));
					});
		}
		return arr;
	}
});

Ext.cq.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							labelWidth : 60,
							items : [{
										xtype : 'textfield',
										fieldLabel : '指标名称',
										name : 'name',
										anchor : '90%'
									}]
						}, {
							width : 65,
							items : [{
										xtype : 'button',
										text : '查询',
										iconCls : 'query',
										handler : function() {
											this.app.grid.getStore().load();
										},
										scope : this
									}]
						}, {
							width : 65,
							items : [{
										xtype : 'button',
										text : '清空',
										iconCls : 'reset',
										handler : function() {
											this.getForm().reset();
										},
										scope : this
									}]
						}];
				// panel定义
				Ext.cq.queryPanel.superclass.constructor.call(this, {
							id : 'cqQueryPanel',
							region : 'north',
							height : 40,
							frame : true,
							split : true,
							collapseMode : 'mini',
							layout : 'column',
							labelAlign : 'right',
							defaults : {
								layout : 'form',
								labelWidth : 35
							}
						});
			},
			getQueryParams : function() {
				return this.getForm().getValues();
			}
		});

/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var cqView = function() {
	this.queryPanel = new Ext.cq.queryPanel(this);
	this.sortTree = new Ext.cqTree.tree(this);
	this.grid = new Ext.cq.grid(this);
	this.cqEvaRateGrid = new Ext.cqEvaRate.grid(this);
	this.tabs = new Ext.TabPanel({
				region : 'center',
				deferredRender : true,
				enableTabScroll : true,
				tabPosition : 'bottom',
				activeTab : 0, // first tab initially active,
				defaults : {
					autoScroll : true,
					closable : false
				},
				items : [{
							title : '一般指标',
							layout : 'border',
							items : [this.sortTree, {
										region : 'center',
										layout : 'border',
										items : [this.queryPanel, this.grid]
									}]
						}, {
							title : '内置指标',
							layout : 'border',
							items : [this.cqEvaRateGrid]
						}]
			})
	return new Ext.Panel({
				id : 'cqView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '计算指标管理',
				layout : 'border',
				items : [this.tabs]
			})
}
