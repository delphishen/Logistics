Ext.namespace('Ext.icon');

Ext.icon.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		this.items = [{
					xtype : 'hidden',
					id : 'id'
				}, {
					xtype : 'hidden',
					id : 'attachId'
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '图标名称',
								xtype : 'textfield',
								name : 'name',
								anchor : '100%',
								selectOnFocus : true,
								allowBlank : false
							}, {
								xtype : 'combo',
								fieldLabel : '图标种类',
								hiddenName : 'type',
								anchor : '100%',
								typeAhead : true,
								editable : false,
								triggerAction : 'all',
								lazyRender : true,
								mode : 'local',
								value : 1,
								store : new Ext.data.ArrayStore({
											fields : ['key', 'val'],
											data : [['用水单元', 1], ['处理单元', 2],
													['补充水', 3]]
										}),
								valueField : 'val',
								displayField : 'key'
							}, {
								fieldLabel : '备注',
								xtype : 'textarea',
								id : 'remark',
								anchor : '100%',
								selectOnFocus : true
							}, {
								xtype : 'textfield',
								fieldLabel : '图标',
								name : 'filePath',
								submitValue : false,
								height : 200,
								inputType : 'image',
								anchor : '100%',
								listeners : {
									'render' : function(field) {
										field.getEl().dom.src = path
												+ '/images/asset/blank.jpg';
									},
									'focus' : function(field) {
										this.setPhoto(field);
									},
									scope : this
								}
							}]
				}];

		Ext.icon.form.superclass.constructor.call(this, {
					labelWidth : 60,
					baseCls : 'x-plain',
					layout : 'column',
					style : 'padding : 5',
					defaults : {
						baseCls : 'x-plain',
						layout : 'form'
					},
					setPhoto : function(field) {
						var dialog = AppMgr.createUploadDialog({
									category : currUser.loginName,
									permitted_extensions : ['JPG', 'jpg',
											'jpeg', 'JPEG', 'png', 'PNG'],
									callback : function(data, grid) {
										var length = data.length;
										if (length > 0) {
											Ext
													.getCmp('attachId')
													.setValue(data[length - 1].fileId);
											var url = path + '/attach';
											var str = data[length - 1].filepath
													.split('attach\\')[1]
													.split('\\');
											for (var i = 0; i < str.length; i++) {
												url += '/' + str[i];
											}
											field.getEl().dom.src = url;
										}
									},
									scope : this
								});
						dialog.show();
					}
				});
	}

});

Ext.icon.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.icon.form(this);
				Ext.icon.win.superclass.constructor.call(this, {
							width : 400,
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
					var params = {
						icon : Ext.encode(form.getValues())
					};
					Ext.eu.ajax(path + '/basic/saveIcon.do', params, function(
									resp) {
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

Ext.icon.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/basic/queryIcon.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'name', 'type', 'attachId',
									'filePath', 'remark'],
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
										header : '图标名称',
										dataIndex : 'name'
									}, {
										header : '图标类别',
										dataIndex : 'type',
										renderer : function(val) {
											if (val == 1) {
												return '用水单元';
											} else if (val == 2) {
												return '处理单元';
											} else if (val == 3) {
												return '补充水';
											} else {
												return '连线';
											}
										}
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
						}, {
							xtype : 'button',
							iconCls : 'delete',
							text : '默认图标',
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
				Ext.icon.grid.superclass.constructor.call(this, {
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
				var win = new Ext.icon.win(this);
				win.setTitle('添加图标', 'add');
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
				var win = new Ext.icon.win(this);
				var form = win.form.getForm();
				win.setTitle('修改图标', 'modify');
				form.findField('id').setValue(select.id);
				form.findField('name').setValue(select.name);
				form.findField('type').setValue(select.type);
				form.findField('attachId').setValue(select.attachId);
				form.findField('remark').setValue(select.remark);
				win.show();
				if (select.filePath && select.filePath != '') {
					var url = path + '/attach';
					var str = select.filePath.split('attach\\')[1].split('\\');
					for (var i = 0; i < str.length; i++) {
						url += '/' + str[i];
					}
					form.findField('filePath').getEl().dom.src = url;
				}
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var icons = Array();
				for (var i = 0; i < selects.length; i++) {
					var icon = {
						id : selects[i].data.id,
						attachId : selects[i].data.attachId
					}
					icons.push(icon);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/basic/deleteIcon.do', {
											icons : Ext.encode(icons)
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
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条记录！");
					return;
				}
				var icon = {
					id : selects[0].data.id,
					type : selects[0].data.type,
					isDefault : 1
				}
				Ext.Msg.confirm('默认设置', '确定要所选记录为该类型的默认图标?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/basic/defaultIcon.do', {
											icon : Ext.encode(icon)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '设置成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			}
		});

Ext.icon.queryPanel = Ext.extend(Ext.FormPanel, {
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
				Ext.icon.queryPanel.superclass.constructor.call(this, {
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
var iconView = function() {
	this.queryPanel = new Ext.icon.queryPanel(this);
	this.grid = new Ext.icon.grid(this);
	return new Ext.Panel({
				id : 'iconView',
				title : '图标管理',
				layout : 'border',
				items : [this.grid, this.queryPanel]
			})
}