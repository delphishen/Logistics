Ext.namespace('Ext.qp');

Ext.qp.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.sortNode = null;
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryQp.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'sortId', 'sortName', 'name',
									'showFormula', 'realFormula', 'remark'],
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
											sortIds = this.getChildrenIds(
													sortIds, this.sortNode,
													this);
										}
									}
									var str = "";
									for (var i = 0; i < sortIds.length; i++) {
										str += "'" + sortIds[i] + "',"
									}
									str = str
											.substring(0, str.lastIndexOf(','));
									Ext.apply(this.getStore().baseParams, {
												'qpSortId' : str
											});
									Ext.apply(this.getStore().baseParams,
											this.app.queryPanel
													.getQueryParams());
								},
								scope : this
							}
						});
				// 选择框
				this.sm = new Ext.grid.CheckboxSelectionModel({
							singleSelect : true
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
										header : 'sortId',
										dataIndex : 'sortId',
										hidden : true
									}, {
										header : 'realFormula',
										dataIndex : 'realFormula',
										hidden : true
									}, {
										header : '参数名称',
										dataIndex : 'name'
									}, {
										header : '参数类别',
										dataIndex : 'sortName'
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
							id : 'addQp',
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
				Ext.qp.grid.superclass.constructor.call(this, {
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
				var win = new Ext.qp.win(this);
				win.setTitle('添加指标参数', 'add');
				var node = this.sortNode;
				if (node != null) {
					win.form.getForm().findField('sortName')
							.setValue(node.text);
					win.form.getForm().findField('sortId').setValue(node.id);
				}
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
				this.qp = selects[0].data;
				var win = new Ext.qp.win(this);
				win.form.getForm().findField('id').setValue(this.qp.id);
				win.form.getForm().findField('sortId').setValue(this.qp.sortId);
				win.form.getForm().findField('sortName')
						.setValue(this.qp.sortName);
				win.form.getForm().findField('name').setValue(this.qp.name);
				win.form.getForm().findField('realFormula')
						.setValue(this.qp.realFormula);
				win.form.getForm().findField('showFormula')
						.setValue(this.qp.showFormula);
				win.form.getForm().findField('remark').setValue(this.qp.remark);
				win.setTitle('修改指标参数', 'modify');
				win.show();
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var qp = {
					id : selects[0].data.id
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/wbb/deleteQp.do', {
											qp : Ext.encode(qp)
										}, function(resp) {
											var res = Ext
													.decode(resp.responseText);
											if (res.label) {
												Ext.ux.Toast.msg('信息', '删除成功');
												this.getStore().reload();
											} else {
												Ext.ux.Toast.msg('信息',
														'删除的记录存在被引用关系，不允许删除');
											}
										}, this);
							}
						}, this);
			},
			getChildrenIds : function(arr, node, scope) {
				if (node.hasChildNodes()) {
					node.eachChild(function(child) {
								arr.push(child.id);
								arr.concat(scope.getChildrenIds(arr, child,
										scope));
							});
				}
				return arr;
			}
		});

Ext.qp.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							labelWidth : 60,
							items : [{
										xtype : 'textfield',
										fieldLabel : '参数名称',
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
				Ext.qp.queryPanel.superclass.constructor.call(this, {
							id : 'qpQueryPanel',
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
var qpView = function() {
	this.queryPanel = new Ext.qp.queryPanel(this);
	this.sortTree = new Ext.qpTree.tree(this);
	this.grid = new Ext.qp.grid(this);
	return new Ext.Panel({
				id : 'qpView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '指标参数管理',
				layout : 'border',
				items : [this.sortTree, {
							region : 'center',
							layout : 'border',
							items : [this.queryPanel, this.grid]
						}]
			})
}
