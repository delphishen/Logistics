Ext.namespace('Ext.standard');

Ext.standard.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.sortNode = null;
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryStandard.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'filterSortId', 'belongSortId',
									'name', 'number', 'filterSortName',
									'belongSortName', 'remark'],
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
												'filterSortId' : str
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
										header : 'filterSortId',
										dataIndex : 'filterSortId',
										hidden : true
									}, {
										header : 'belongSortId',
										dataIndex : 'belongSortId',
										hidden : true
									}, {
										header : '标准名称',
										dataIndex : 'name'
									}, {
										header : '标准号',
										dataIndex : 'number'
									}, {
										header : '筛选类型',
										dataIndex : 'filterSortName'
									}, {
										header : '标准类别',
										dataIndex : 'belongSortName'
									}, {
										header : '备注',
										dataIndex : 'remark'
									}]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							xtype : 'button',
							iconCls : 'add',
							id : 'addSt',
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
						}, '->', {
							xtype : 'button',
							iconCls : 'delete',
							text : '指标配置',
							handler : this.onSetting,
							scope : this
						}]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.standard.grid.superclass.constructor.call(this, {
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
				var win = new Ext.standard.win(this);
				win.setTitle('添加标准规范', 'add');
				var node = this.sortNode;
				if (node != null) {
					win.form.getForm().findField('filterSortName')
							.setValue(node.text);
					win.form.getForm().findField('filterSortId')
							.setValue(node.id);
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
				this.standard = selects[0].data;
				var win = new Ext.standard.win(this);
				win.form.getForm().findField('id').setValue(this.standard.id);
				win.form.getForm().findField('filterSortId')
						.setValue(this.standard.filterSortId);
				win.form.getForm().findField('filterSortName')
						.setValue(this.standard.filterSortName);
				win.form.getForm().findField('belongSortId')
						.setValue(this.standard.belongSortId);
				win.form.getForm().findField('belongSortName')
						.setValue(this.standard.belongSortName);
				win.form.getForm().findField('name')
						.setValue(this.standard.name);
				win.form.getForm().findField('number')
						.setValue(this.standard.number);
				win.form.getForm().findField('remark')
						.setValue(this.standard.remark);
				win.setTitle('修改标准规范', 'modify');
				win.show();
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var standards = Array();
				for (var i = 0; i < selects.length; i++) {
					var standard = {
						id : selects[i].data.id
					}
					standards.push(standard);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/wbb/deleteStandard.do', {
											standards : Ext.encode(standards)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			},
			onSetting : function(btn) {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要修改的记录！");
					return;
				}
				if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条记录！");
					return;
				}
				this.standard = selects[0].data;
				var win = new Ext.standard.settingWin(this);
				win.setTitle('指标配置', 'modify');
				win.show();
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

Ext.standard.queryPanel = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		// 在column布局的制约下，从左至右每个元素依次进行form布局
		this.items = [{
					xtype : 'hidden',
					name : 'belongSortId'
				}, {
					width : 200,
					labelWidth : 60,
					items : [{
								xtype : 'textfield',
								fieldLabel : '标准名称',
								name : 'name',
								anchor : '90%'
							}]
				}, {
					width : 260,
					labelWidth : 60,
					items : [{
						fieldLabel : '标准类别',
						xtype : 'combo',
						name : 'belongName',
						submitValue : false,
						anchor : '90%',
						editable : false,
						triggerAction : 'all',
						mode : 'local',
						store : new Ext.data.Store({
							proxy : new Ext.data.HttpProxy({
										url : path
												+ '/info/getAllStandardBelongSort.do',
										method : 'POST'
									}),
							reader : new Ext.data.JsonReader({}, [{
												name : 'id',
												mapping : 'id'
											}, {
												name : 'name',
												mapping : 'name'
											}])
						}),
						valueField : 'id',
						displayField : 'name',
						listeners : {
							'select' : function(combo, record) {
								this.getForm().findField('belongSortId')
										.setValue(record.data.id);
							},
							scope : this
						}
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
		Ext.standard.queryPanel.superclass.constructor.call(this, {
					id : 'standardQueryPanel',
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
					},
					listeners : {
						'render' : function(form) {
							form.getForm().findField('belongName').getStore()
									.reload();
						}
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
var standardView = function() {
	this.queryPanel = new Ext.standard.queryPanel(this);
	this.sortTree = new Ext.standardTree.tree(this);
	this.grid = new Ext.standard.grid(this);
	return new Ext.Panel({
				id : 'standardView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '标准规范管理',
				layout : 'border',
				items : [this.sortTree, {
							region : 'center',
							layout : 'border',
							items : [this.queryPanel, this.grid]
						}]
			})
}
