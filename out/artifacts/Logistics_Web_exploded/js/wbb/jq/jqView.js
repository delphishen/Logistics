Ext.namespace('Ext.jq');

Ext.jq.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryJq.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'name', 'result', 'showFormula',
									'realFormula', 'remark'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								start : 0,
								limit : 20
							},
							listeners : {
								'beforeload' : function() {
									Ext.apply(this.getStore().baseParams,
											this.app.queryPanel
													.getQueryParams());
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
							columns : [new Ext.grid.RowNumberer(), this.sm, {
										header : 'id',
										dataIndex : 'id',
										hidden : true
									}, {
										header : 'realFormula',
										dataIndex : 'realFormula',
										hidden : true
									}, {
										header : '名称',
										dataIndex : 'name'
									}, {
										header : '最优结果',
										hidden : true,
										dataIndex : 'result',
										renderer : function(val) {
											if (val == 1) {
												return '越大值';
											} else {
												return '越小值';
											}
										}
									}, {
										header : '计算关系',
										dataIndex : 'showFormula'
									}, {
										header : '备注',
										dataIndex : 'remark'
									}]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							xtype : 'button',
							iconCls : 'add',
							text : '新增',
							handler : this.onAdd,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'modify',
							text : '修改',
							handler : this.onModify,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'delete',
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
				Ext.jq.grid.superclass.constructor.call(this, {
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
				var win = new Ext.jq.win(this);
				win.setTitle('添加评价指标', 'add');
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
				this.jq = selects[0].data;
				var win = new Ext.jq.win(this);
				win.form.getForm().findField('id').setValue(this.jq.id);
				win.form.getForm().findField('name').setValue(this.jq.name);
				win.form.radio.setValue(this.jq.result);
				win.form.getForm().findField('realFormula')
						.setValue(this.jq.realFormula);
				win.form.getForm().findField('showFormula')
						.setValue(this.jq.showFormula);
				win.form.getForm().findField('remark').setValue(this.jq.remark);
				win.setTitle('修改评价指标', 'modify');
				win.show();
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var jqs = Array();
				for (var i = 0; i < selects.length; i++) {
					var jq = {
						id : selects[i].data.id
					}
					jqs.push(jq);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/wbb/deleteJq.do', {
											jqs : Ext.encode(jqs)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			}
		});

Ext.jq.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							items : [{
										xtype : 'textfield',
										fieldLabel : '名称',
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
				Ext.jq.queryPanel.superclass.constructor.call(this, {
							id : 'jqQueryPanel',
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
var jqView = function() {
	this.queryPanel = new Ext.jq.queryPanel(this);
	this.grid = new Ext.jq.grid(this);
	return new Ext.Panel({
				id : 'jqView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '评价指标管理',
				layout : 'border',
				items : [this.queryPanel, this.grid]
			})
}
