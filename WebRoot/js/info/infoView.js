Ext.namespace('Ext.info');

Ext.info.standardSortform = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.items = [{
							xtype : 'hidden',
							id : 'id'
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '名称',
										xtype : 'textfield',
										name : 'name',
										anchor : '100%',
										maxLength : 18,
										maxLengthText : '名称不能大于18个字符',
										selectOnFocus : true,
										allowBlank : false
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '内容',
										xtype : 'textarea',
										name : 'remark',
										anchor : '100%',
										selectOnFocus : true
									}]
						}];

				Ext.info.standardSortform.superclass.constructor.call(this, {
							labelWidth : 60,
							baseCls : 'x-plain',
							layout : 'column',
							style : 'padding : 5',
							defaults : {
								baseCls : 'x-plain',
								layout : 'form'
							}
						});
			}

		});

Ext.info.standardSortWin = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.info.standardSortform(this);
				Ext.info.standardSortWin.superclass.constructor.call(this, {
							width : 500,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							items : this.form,
							buttons : [{
										text : '保存',
										iconCls : 'save',
										handler : this.onSave,
										scope : this
									}, {
										text : '取消',
										iconCls : 'cancel',
										handler : this.onClose,
										scope : this
									}]
						});
			},
			onSave : function(btn) {
				var form = this.form.getForm();
				if (form.isValid()) {
					btn.setDisabled(true);
					Ext.eu.ajax(path + '/info/saveStandardBelongSort.do', {
								standardBelongSort : Ext.encode(form
										.getValues())
							}, function(resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getStore().reload();
									this.close();
								} else {
									Ext.ux.Toast.msg('提示', '保存的记录存在重名');
									btn.setDisabled(false);
								}
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});

Ext.info.standardSortGrid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/info/queryStandardBelongSort.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'name', 'remark', 'crTime'],
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
										header : '名称',
										dataIndex : 'name'
									}, {
										header : '内容',
										dataIndex : 'remark'
									}, {
										header : '创建时间',
										dataIndex : 'crTime'
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
				Ext.info.standardSortGrid.superclass.constructor.call(this, {
							region : 'center',
							loadMask : 'loading...',
							columnLines : true,
							clicksToEdit : 1,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							}
						});
			},
			onAdd : function(btn) {
				var win = new Ext.info.standardSortWin(this);
				win.setTitle('添加标准类别', 'add');
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
				var select = selects[0].data;
				var win = new Ext.info.standardSortWin(this);
				var form = win.form.getForm();
				win.setTitle('修改标准类别', 'modify');
				form.findField('id').setValue(select.id);
				form.findField('name').setValue(select.name);
				form.findField('remark').setValue(select.remark);
				win.show();
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var standardBelongSorts = Array();
				for (var i = 0; i < selects.length; i++) {
					var standardBelongSort = {
						id : selects[i].data.id
					}
					standardBelongSorts.push(standardBelongSort);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu
										.ajax(
												path
														+ '/info/deleteStandardBelongSort.do',
												{
													standardBelongSorts : Ext
															.encode(standardBelongSorts)
												}, function(resp) {
													Ext.ux.Toast.msg('信息',
															'删除成功');
													this.getStore().reload();
												}, this);
							}
						}, this);
			}
		});

Ext.info.queryPanel = Ext.extend(Ext.FormPanel, {
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
									this.app.standardSortGird.getStore().load();
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
		Ext.info.queryPanel.superclass.constructor.call(this, {
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
var infoView = function() {
	this.queryPanel = new Ext.info.queryPanel(this);
	this.standardSortGird = new Ext.info.standardSortGrid(this);
	this.tabPanel = new Ext.TabPanel({
				activeTab : 0,
				region : 'center',
				items : [{
							title : '标准类别',
							layout : 'border',
							items : [this.standardSortGird]
						}]
			})
	return new Ext.Panel({
				id : 'infoView',
				title : '信息维护',
				layout : 'border',
				items : [this.tabPanel, this.queryPanel]
			})
}