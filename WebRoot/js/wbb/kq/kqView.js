Ext.namespace('Ext.kq');

Ext.kq.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.sortNode = null;
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryKq.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'sortId', 'sortName', 'chName',
									'enName', 'unit', 'errorRate', 'type',
									'remark'],
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
									str = str.substring(0, str.lastIndexOf(','));
									Ext.apply(this.getStore().baseParams, {
												'kqSortId' : str
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
							singleSelect : false,
							listeners : {
								rowdeselect : function(model, index, record) {
									var selects = Ext.eu.getSelects(this);
									if (selects.length == 0) {
										Ext.getCmp('modifyKq').disable();
										Ext.getCmp('deleteKq').disable();
									} else if (selects.length == 1) {
										Ext.getCmp('modifyKq').enable();
										Ext.getCmp('deleteKq').enable();
									} else {
										Ext.getCmp('deleteKq').enable();
									}
									for (var i = 0; i < selects.length; i++) {
										if (selects[i].data.id == water.id) {
											Ext.getCmp('deleteKq').disable();
											Ext.getCmp('modifyKq').disable();
											break;
										}
									}
								},
								rowselect : function(model, index, record) {
									var selects = Ext.eu.getSelects(this);
									if (selects.length == 1) {
										Ext.getCmp('modifyKq').enable();
										Ext.getCmp('deleteKq').enable();
									} else if (selects.length > 1) {
										Ext.getCmp('modifyKq').disable();
										Ext.getCmp('deleteKq').enable();
									}
									for (var i = 0; i < selects.length; i++) {
										if (selects[i].data.sortId == water.sortId) {
											Ext.getCmp('deleteKq').disable();
											Ext.getCmp('modifyKq').disable();
											break;
										}
									}
								},
								scope : this
							}
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
										header : '指标中文名称',
										dataIndex : 'chName'
									}, {
										header : '指标英文名称',
										dataIndex : 'enName'
									}, {
										header : '指标种类',
										dataIndex : 'sortName'
									}, {
										header : '归属类别',
										dataIndex : 'type',
										renderer : function(val) {
											if (val == 1) {
												return '进出口关系';
											} else if (val == 2) {
												return '进出口固定值';
											}
										}
									}, {
										header : '单位',
										dataIndex : 'unit'
									}, {
										header : '误差率',
										dataIndex : 'errorRate'
									}, {
										header : '备注',
										dataIndex : 'remark'
									}]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							xtype : 'button',
							iconCls : 'add',
							id : 'addKq',
							text : '新增',
							handler : this.onAdd,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'modify',
							text : '修改',
							id : 'modifyKq',
							handler : this.onModify,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'delete',
							id : 'deleteKq',
							text : '删除',
							handler : this.onDelete,
							scope : this
						}, '->', {
							xtype : 'button',
							iconCls : 'add',
							text : '合并到一期',
							handler : this.onMerge,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'add',
							text : '引用指标',
							handler : this.onImport,
							scope : this
						}]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.kq.grid.superclass.constructor.call(this, {
							region : 'center',
							loadMask : 'loading...',
							columnLines : true,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							}
						});
			},
			onAdd : function(btn) {
				this.kq = new Object();
				this.kq.enName = '';
				var win = new Ext.kq.win(this);
				win.setTitle('添加关键指标', 'add');
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
				this.kq = selects[0].data;
				var win = new Ext.kq.win(this);
				win.form.getForm().findField('id').setValue(this.kq.id);
				win.form.getForm().findField('chName').setValue(this.kq.chName);
				win.form.getForm().findField('unit').setValue(this.kq.unit);
				win.form.radio.setValue(this.kq.type);
				win.form.getForm().findField('remark').setValue(this.kq.remark);
				win.form.getForm().findField('errorRate')
						.setValue(this.kq.errorRate);
				win.form.getForm().findField('sortName')
						.setValue(this.kq.sortName);
				win.form.getForm().findField('sortId').setValue(this.kq.sortId);
				win.setTitle('修改关键指标', 'modify');
				win.show();
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var kqs = Array();
				for (var i = 0; i < selects.length; i++) {
					if (selects[i].data.id != water.id) {
						var kq = {
							id : selects[i].data.id
						}
						kqs.push(kq);
					} else {
						Ext.ux.Toast.msg("信息", "所选记录存在水量，不允许删除！");
						return;
					}
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/wbb/deleteKq.do', {
											kqs : Ext.encode(kqs)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			},
			onMerge : function(btn) {
				Ext.Msg.show({
							buttons : Ext.Msg.CANCEL,
							icon : Ext.Msg.INFO,
							title : '信息',
							msg : '功能暂未开放ssm！'
						});
			},
			onImport : function(btn) {
				Ext.Msg.show({
							buttons : Ext.Msg.CANCEL,
							icon : Ext.Msg.INFO,
							title : '信息',
							msg : '功能暂未开放ssm！'
						});
				// var win = new Ext.quota.importWin(this);
				// win.setTitle('引用指标', 'modify');
				// win.show();
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

Ext.kq.queryPanel = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		// 在column布局的制约下，从左至右每个元素依次进行form布局
		this.items = [{
					width : 200,
					labelWidth : 60,
					items : [{
								xtype : 'textfield',
								fieldLabel : '中文名称',
								id : 'kqChName',
								anchor : '90%'
							}]
				}, {
					width : 200,
					labelWidth : 60,
					items : [{
								xtype : 'textfield',
								fieldLabel : '英文名称',
								id : 'kqEnName',
								anchor : '90%'
							}]
				}, {
					width : 200,
					labelWidth : 60,
					items : [{
								xtype : 'combo',
								fieldLabel : '归属类别',
								id : 'kqType',
								anchor : '98%',
								typeAhead : true,
								editable : false,
								triggerAction : 'all',
								lazyRender : true,
								mode : 'local',
								store : new Ext.data.ArrayStore({
											fields : ['key', 'val'],
											data : [['进出口关系', 1], ['进出口固定值', 2]]
										}),
								valueField : 'val',
								displayField : 'key'
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
									this.app.grid.getStore().reload();
								},
								scope : this
							}]
				}];
		// panel定义
		Ext.kq.queryPanel.superclass.constructor.call(this, {
					id : 'kqQueryPanel',
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
		var queryParams = this.getForm().getValues();
		queryParams.kqType = this.getForm().findField('kqType').getValue();
		return queryParams;
	}
});

/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var kqView = function() {
	this.queryPanel = new Ext.kq.queryPanel(this);
	this.sortTree = new Ext.kqTree.tree(this);
	this.grid = new Ext.kq.grid(this);
	return new Ext.Panel({
				id : 'kqView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '关键指标管理',
				layout : 'border',
				items : [this.sortTree, {
							region : 'center',
							layout : 'border',
							items : [this.queryPanel, this.grid]
						}]
			})
}
