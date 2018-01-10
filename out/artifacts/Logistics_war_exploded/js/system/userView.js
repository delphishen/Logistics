Ext.namespace("Ext.user");

Ext.user.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;

		this.empSelector = new Ext.form.TriggerField({
			fieldLabel : '员工',
			name : 'empName',
			anchor : '98%',
			triggerClass : 'x-form-search-trigger',
			selectOnFocus : true,
			submitValue : false,
			allowBlank : true,
			editable : false,
			onTriggerClick : function(e) {
				new empSelector(function(id, name) {
					this.setValue(name);
					Ext.getCmp('empId').setValue(id);
				//	if(Ext.getCmp('loginName').getValue != ''){
				//		Ext.getCmp('loginName').setValue(name);	
				//	}
					
					
							
						}, true, this);
			},
			scope : this
		});		
		
//		this.empSelector = new Ext.form.TriggerField({
//			fieldLabel : '员工',
//			name : 'empName',
//			anchor : '98%',
//			triggerClass : 'x-form-search-trigger',
//			selectOnFocus : true,
//			submitValue : false,
//			editable : false,
//			onTriggerClick : function(e) {
//				new empSelector(function(id, name) {
//							Ext.eu.ajax(path + '/system/findUserByEmpId.do', {
//										empId : id
//									}, function(resp) {
//										var res = Ext.decode(resp.responseText);
//										if (res == null) {
//											this.setValue(name);
//											Ext.getCmp('empId').setValue(id);
//										} else {
//											var form = this.ownerCt.ownerCt
//													.getForm();
//											var userId = Ext.getCmp('id')
//													.getValue();
//											if (userId && userId != '') {
//												if (userId != res.id) {
//													Ext.ux.Toast.msg('提示',
//															'所选员工已创建用户！！！');
//												}
//											} else {
//												this.setValue(name);
//												Ext.getCmp('empId')
//														.setValue(id);
//												Ext.getCmp('id')
//														.setValue(res.id);
//												
//												Ext.getCmp('currPwd')
//														.setValue(res.currPwd);
//												Ext.getCmp('isAdmin')
//														.setValue(res.isAdmin);
//												form
//														.findField('loginName')
//														.setValue(res.loginName);
//												form.findField('email')
//														.setValue(res.email);
//												form.findField('remark')
//														.setValue(res.remark);
//											}
//										}
//									}, this);
//						}, true, this);
//			},
//			scope : this
//		});

		this.items = [{
					xtype : 'hidden',
					id : 'id'
				}, {
					xtype : 'hidden',
					id : 'empId'
				}, {
					xtype : 'hidden',
					id : 'password'
				}, {
					columnWidth : 1,
					items : [this.empSelector]
				}, {
					columnWidth : 1,
					labelWidth : 60,
					items : [{
								fieldLabel : '用户名',
								xtype : 'textfield',
								id : 'loginName',
								anchor : '98%',
								allowBlank : false,
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					labelWidth : 60,
					items : [{
						xtype : 'combo',
						fieldLabel : '管理员',
						hiddenName : 'isAdmin',
						anchor : '98%',
						typeAhead : true,
						editable : false,
						triggerAction : 'all',
						lazyRender : true,
						mode : 'local',
						value:'1',
						store : new Ext.data.ArrayStore({
										fields : ['key', 'val'],
										data : [['是', '1'],
												['否', '0']]
									}),
						valueField : 'val',
						displayField : 'key'
					  }					         
					         ]
				},{
					columnWidth : 1,
					items : [{
								fieldLabel : '邮箱',
								xtype : 'textfield',
								name : 'email',
								anchor : '98%',
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '备注',
								xtype : 'textarea',
								name : 'remark',
								anchor : '98%',
								selectOnFocus : true
							}]
				}];

		Ext.user.form.superclass.constructor.call(this, {
					labelWidth : 60,
					baseCls : 'x-plain',
					layout : 'column',
					style : 'padding : 5',
					defaults : {
						baseCls : 'x-plain',
						layout : 'form'
					},
					listeners : {
						'render' : function(form) {
							// form.roleCombo.getStore().reload();
						}
					}
				});
	}

});

Ext.user.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.user.form(this);
				Ext.user.win.superclass.constructor.call(this, {
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
					var user = form.getValues();
					user.isAdmin = user.isAdmin == 1 ? 1 : 0;
				//	alert(Ext.encode(user));
					Ext.eu.ajax(path + '/system/saveUser.do', {
								user : Ext.encode(user)
							}, function(resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getStore().reload();
									this.close();
								} else {
									Ext.ux.Toast.msg('提示', '用户名已经存在,请重新设置！');
									btn.setDisabled(false);
								}
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});

Ext.user.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/system/queryUser.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'empId', 'empName', 'loginName',
									'password', 'isAdmin', 'email',
									'remark'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								isPaging : true,
								start : 0,
								limit : 20
							},
							listeners : {
								'beforeload' : function() {
									Ext.apply(this.getStore().baseParams,
											this.app.queryPanel.getQueryParams());
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
										header : 'empId',
										dataIndex : 'empId',
										hidden : true
									}, {
										header : '员工',
										dataIndex : 'empName'
									}, {
										header : '登录用户名',
										dataIndex : 'loginName'
									}, {
										header : '密码',
										dataIndex : 'password'
									}, {
										header : '邮箱',
										dataIndex : 'email'
									}, {
										header : '管理员',
										dataIndex : 'isAdmin',
										renderer : function(val) {
											if (val == 0) {
												return '否';
											} else if (val == 1){
												return '是';	
											}
										}										
									}, {
										header : '备注',
										dataIndex : 'remark'
									}]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							id : 'buttonAddUserView',
							xtype : 'button',
							iconCls : 'add',
							text : '新增',
							handler : this.onAdd,
							scope : this
						}, {
							id : 'buttonModifyUserView',
							xtype : 'button',
							iconCls : 'modify',
							text : '修改',
							handler : this.onModify,
							scope : this
						}, {
							id : 'buttonDelUserView',
							xtype : 'button',
							iconCls : 'delete',
							text : '删除',
							handler : this.onDelete,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'arrow_refresh',
							text : '重置密码',
							handler : this.onReset,
							scope : this
						}, '->', {
							xtype : 'button',
							iconCls : 'arrow_refresh',
							text : '页面授权',
							handler : this.onPageRight,
							scope : this
						}]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.user.grid.superclass.constructor.call(this, {
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
				var win = new Ext.user.win(this);
				win.setTitle('添加用户', 'add');
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
				var win = new Ext.user.win(this);
				var form = win.form.getForm();
				win.setTitle('修改用户', 'modify');
				form.findField('id').setValue(select.id);
				form.findField('empId').setValue(select.empId);
				form.findField('password').setValue(select.password);
				form.findField('empName').setValue(select.empName);
				form.findField('isAdmin').setValue(select.isAdmin);
				form.findField('loginName').setValue(select.loginName);
				form.findField('email').setValue(select.email);
				form.findField('remark').setValue(select.remark);
				win.show();
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ary = Array();
				for (var i = 0; i < selects.length; i++) {
					var user = {
						id : selects[i].data.id
					}
					ary.push(user);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/system/deleteUser.do', {
											users : Ext.encode(ary)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			},
			onReset : function(btn) {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要重置的记录！");
					return;
				}
				if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条记录！");
					return;
				}
				var user = {
					id : selects[0].data.id,
					password : '123456'
				}
				Ext.Msg.confirm('重置密码', '确定为所选记录重置密码吗?', function(btn) {
							if (btn == 'yes') {
								//alert(Ext.encode(user));
								Ext.eu.ajax(path + '/system/resetPassword.do', {
											user : Ext.encode(user)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '重置成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			},
			onPageRight : function(btn) {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要授权的记录！");
					return;
				}
				if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条记录！");
					return;
				}
				this.user = {
					id : selects[0].data.empId,
					empName : selects[0].data.empName
				}
				var win = new Ext.userPageRight.win(this);
				win.setTitle('页面授权', 'modify');
				win.show();
			}
		});

Ext.user.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 250,
							items : [{
										xtype : 'textfield',
										fieldLabel : '登录用户名',
										id : 'userName',
										anchor : '90%'
									}]
						}, {
							width : 65,
							items : [{
										xtype : 'button',
										id : 'userQuery',
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
										id : 'userReset',
										text : '清空',
										iconCls : 'reset',
										handler : function() {
											this.getForm().reset();
										},
										scope : this
									}]
						}
						];
				// panel定义
				Ext.user.queryPanel.superclass.constructor.call(this, {
							id : 'userQueryPanel',
							region : 'north',
							height : 40,
							frame : true,
							split : true,
							collapseMode : 'mini',
							layout : 'column',
							labelAlign : 'right',
							defaults : {
								layout : 'form',
								labelWidth : 70
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
var userView = function(params) {
	this.queryPanel = new Ext.user.queryPanel(this);
	this.grid = new Ext.user.grid(this);
	
	Ext.getCmp('buttonAddUserView').hidden=!params[0].isAdd;
	Ext.getCmp('buttonModifyUserView').hidden=!params[0].isModify;
	Ext.getCmp('buttonDelUserView').hidden=!params[0].isDel;	
	
	return new Ext.Panel({
				id : 'userView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '用户管理',
				layout : 'border',
				items : [this.queryPanel, this.grid]
			})
}
