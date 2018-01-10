Ext.namespace('Ext.menu');

Ext.menu.menuForm = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.items = [{
							xtype : 'hidden',
							fieldLabel : 'Id',
							id : 'id'
						}, {
							xtype : 'hidden',
							fieldLabel : 'fatherId',
							id : 'fatherId'
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '父节点',
										xtype : 'textfield',
										id : 'fatherText',
										anchor : '100%',
										readOnly : true,
										submitValue : false,
										style : 'background:#E6E6E6',
										value : 'root'
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '<font color="red">名称</font>',
										xtype : 'textfield',
										id : 'text',
										maxLength : 18,
										maxLengthText : '名称不能大于18个字符',
										anchor : '100%',
										selectOnFocus : true,
										allowBlank : false
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '图标',
										xtype : 'iconcombo',
										anchor : '100%',
										editable : false,
										triggerAction : 'all',
										mode : 'local',
										value : 'application',
										store : new Ext.data.SimpleStore({
													fields : ['iconCls'],
													data : iconData
												}),
										valueField : 'iconCls',
										displayField : 'iconCls',
										iconClsField : 'iconCls',
										hiddenName : 'iconCls'
									}]
						}, {
							columnWidth : .5,
							items : [{
										fieldLabel : '排序',
										xtype : 'numberfield',
										id : 'seq',
										anchor : '100%',
										emptyText : 0,
										selectOnFocus : true,
										decimalPrecision : 0
									}]
						}, {
							columnWidth : .5,
							labelAlign : 'right',
							items : [{
										fieldLabel : '是否叶子',
										xtype : 'combo',
										anchor : '100%',
										editable : false,
										triggerAction : 'all',
										mode : 'local',
										value : 1,
										store : new Ext.data.ArrayStore({
													fields : ['id', 'value'],
													data : [[1, '是'], [0, '否']]
												}),
										valueField : 'id',
										displayField : 'value',
										hiddenName : 'leaf'
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '链接地址',
										xtype : 'textfield',
										id : 'link',
										anchor : '100%',
										selectOnFocus : true
									}]
						}];

				Ext.menu.menuForm.superclass.constructor.call(this, {
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

Ext.menu.btnForm = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.items = [{
							xtype : 'hidden',
							fieldLabel : 'Id',
							id : 'id'
						}, {
							xtype : 'hidden',
							fieldLabel : 'menuId',
							id : 'menuId'
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '隶属目录',
										xtype : 'textfield',
										id : 'menuText',
										anchor : '100%',
										submitValue : false,
										readOnly : true,
										style : 'background:#E6E6E6'
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '名称',
										xtype : 'textfield',
										id : 'text',
										anchor : '100%',
										selectOnFocus : true,
										allowBlank : false
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '图标',
										xtype : 'textfield',
										id : 'iconCls',
										anchor : '100%',
										selectOnFocus : true,
										readOnly : true,
										style : 'background:#E6E6E6',
										value : 'pill'
									}]
						}, {
							columnWidth : .5,
							items : [{
										fieldLabel : '排序',
										xtype : 'numberfield',
										id : 'seq',
										anchor : '100%',
										emptyText : 0,
										selectOnFocus : true,
										decimalPrecision : 0
									}]
						}, {
							columnWidth : .5,
							labelAlign : 'right',
							items : [{
										fieldLabel : '按钮标志',
										xtype : 'textfield',
										id : 'btnKey',
										anchor : '100%',
										selectOnFocus : true
									}]
						}];

				Ext.menu.btnForm.superclass.constructor.call(this, {
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

Ext.menu.menuWin = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.menu.menuForm(this);
				Ext.menu.menuWin.superclass.constructor.call(this, {
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
					var params = {
						menu : Ext.encode(form.getValues())
					};
					Ext.eu.ajax(path + '/system/saveMenu.do', params, function(
									resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getRootNode().reload();
									refreshSysMenu();
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

Ext.menu.btnWin = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.menu.btnForm();
				Ext.menu.btnWin.superclass.constructor.call(this, {
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
						})
			},
			onSave : function(btn) {
				var form = this.form.getForm();
				if (form.isValid()) {
					btn.setDisabled(true);
					var params = {
						btn : Ext.encode(form.getValues())
					};
					Ext.eu.ajax(path + '/system/saveBtnMenu.do', params,
							function(resp) {
								Ext.ux.Toast.msg('信息', '保存成功');
								this.app.getRootNode().reload();
								this.close();
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});

Ext.menu.tree = Ext.extend(Ext.ux.tree.TreeGrid, {
			constructor : function(app) {
				this.app = app;
				// 父级目录
				this.fatherMenu = new Ext.menu.Menu({
							items : [{
										text : '添加菜单',
										iconCls : 'add',
										handler : this.onAdd,
										scope : this
									}, {
										text : '添加子菜单',
										iconCls : 'plugin_add',
										handler : this.onAddChild,
										scope : this
									}, {
										text : '修改菜单',
										iconCls : 'modify',
										handler : this.onModify,
										scope : this
									}, {
										text : '删除菜单',
										iconCls : 'delete',
										handler : this.onDelete,
										scope : this
									}]
						});
				// 叶子目录
				this.leafMenu = new Ext.menu.Menu({
							items : [{
										text : '修改菜单',
										iconCls : 'modify',
										handler : this.onModify,
										scope : this
									}, {
										text : '删除菜单',
										iconCls : 'delete',
										handler : this.onDelete,
										scope : this
									}, {
										text : '添加按钮',
										iconCls : 'add',
										handler : this.onAddBtn,
										scope : this
									}]
						});
				// 按钮目录
				this.btnMenu = new Ext.menu.Menu({
							items : [{
										text : '修改按钮',
										iconCls : 'modify',
										handler : this.onModifyBtn,
										scope : this
									}, {
										text : '删除按钮',
										iconCls : 'delete',
										handler : this.onDeleteBtn,
										scope : this
									}]
						});
				// 工具条
				this.tbar = ['-', {
							text : '刷新',
							iconCls : 'refresh',
							id : 'menusRefreshBtn',
							handler : function() {
								this.getRootNode().reload()
							},
							scope : this
						}, {
							text : '查询',
							iconCls : 'query',
							id : 'query',
							handler : function() {
							},
							scope : this
						}];
				// 列
				this.columns = [{
							header : '菜单名称',
							width : 300,
							dataIndex : 'text'
						}, {
							header : '排序',
							width : 200,
							dataIndex : 'seq'
						}, {
							header : '链接地址',
							width : 400,
							dataIndex : 'link'
						}];
				this.root = new Ext.tree.AsyncTreeNode({
							text : 'Root',
							id : '0'
						});
				Ext.menu.tree.superclass.constructor.call(this, {
							enableDD : true,
							region : 'center',
							enableSort : false,// 禁用排序，不然的话咧，管你后台排序多正常，前台都要按照名称再排一遍，乱序了吧，吃瘪了吧
							loader : new Ext.tree.TreeLoader({
										url : path + '/system/buildMenu.do'
									}),
							listeners : {
								contextmenu : {
									fn : function(node, event) {
										// 必须写，使用preventDefault方法可防止浏览器的默认事件操作发生。
										event.preventDefault();
										node.select();
										if (node.attributes.isBtn) {
											this.btnMenu.showAt(event.getXY());
										} else {
											if (node.attributes.menuLeaf) {
												this.leafMenu.showAt(event
														.getXY());
											} else {
												this.fatherMenu.showAt(event
														.getXY());
											}
										}
									},
									scope : this
								}
							}
						});
			},
			onAdd : function() {
				var win = new Ext.menu.menuWin(this);
				var form = win.form.getForm();
				win.show();
				win.setTitle('添加菜单', 'add');
				form.findField('fatherText').setValue('Root');
				form.findField('fatherId').setValue(0);
			},
			onAddChild : function() {
				var node = this.getSelectionModel().getSelectedNode();
				if (node) {
					if (!node.attributes.menuLeaf) {
						var win = new Ext.menu.menuWin(this);
						var form = win.form.getForm();
						win.show();
						win.setTitle('添加子菜单', 'plugin_add');
						form.findField('fatherText').setValue(node.text);
						form.findField('fatherId').setValue(node.id);
					} else {
						Ext.ux.Toast.msg('信息', '叶子节点不允许添加子节点，请先修改当前节点为非叶子属性');
					}
				}
			},
			onModify : function() {
				var node = this.getSelectionModel().getSelectedNode();
				if (node) {
					var win = new Ext.menu.menuWin(this);
					var form = win.form.getForm();
					win.show();
					win.setTitle('修改菜单', 'modify');
					form.findField('id').setValue(node.id);
					form.findField('text').setValue(node.text);
					form.findField('iconCls').setValue(node.attributes.iconCls);
					form.findField('seq').setValue(node.attributes.seq);
					form.findField('link').setValue(node.attributes.link);
					if (node.attributes.fatherId == 0) {
						form.findField('fatherId').setValue(0);
						form.findField('fatherText').setValue('Root');
					} else {
						form.findField('fatherId').setValue(node.parentNode.id);
						form.findField('fatherText')
								.setValue(node.parentNode.text);
					}
					if (node.attributes.menuLeaf) {
						form.findField('leaf').setValue(1);
					} else {
						form.findField('leaf').setValue(0);
					}
				}
			},
			onDelete : function() {
				var node = this.getSelectionModel().getSelectedNode();
				if (node.childNodes != '') {
					Ext.ux.Toast.msg('信息', '请先删除子节点');
					return;
				}
				Ext.Msg.confirm('删除操作', '确定要删除选中节点吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/system/deleteMenu.do', {
											menu : Ext.encode({
														id : node.id
													})
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getRootNode().reload();// 刷新当前树
											refreshSysMenu();
										}, this);
							}
						}, this);
			},
			onAddBtn : function() {
				var node = this.getSelectionModel().getSelectedNode();
				var win = new Ext.menu.btnWin(this);
				var form = win.form.getForm();
				win.show();
				win.setTitle('添加按钮', 'add');
				form.findField('menuId').setValue(node.id);
				form.findField('menuText').setValue(node.text);
			},
			onModifyBtn : function() {
				var node = this.getSelectionModel().getSelectedNode();
				if (node) {
					var win = new Ext.menu.btnWin(this);
					var form = win.form.getForm();
					win.show();
					win.setTitle('修改按钮', 'modify');
					form.findField('id').setValue(node.id);
					form.findField('text').setValue(node.text);
					form.findField('iconCls').setValue(node.attributes.iconCls);
					form.findField('seq').setValue(node.attributes.seq);
					form.findField('menuId').setValue(node.parentNode.id);
					form.findField('menuText').setValue(node.parentNode.text);
					form.findField('btnKey').setValue(node.attributes.btnKey);
				}
			},
			onDeleteBtn : function() {
				var node = this.getSelectionModel().getSelectedNode();
				Ext.Msg.confirm('删除操作', '确定要删除选中节点吗?', function(btn) {
							if (btn == 'yes') {
								var params = {
									btnId : node.id
								};
								Ext.eu.ajax(path + '/system/deleteBtnMenu.do',
										params, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getRootNode().reload();// 刷新当前树
										}, this);
							}
						}, this);
			}
		});

/**
 * 刷新系统目录
 */
var refreshSysMenu = function() {
	var leftPanel = Ext.getCmp('west_panel');
	leftPanel.removeAll(true);
	menuRefresh(leftPanel);
}

/**
 * 初始化界面
 * 
 * @return {}
 */
var menuView = function() {
	return new Ext.Panel({
				id : 'menuView',// 灰蚕重要,一定要跟方法名称一样
				title : '菜单管理',
				layout : 'border',
				items : new Ext.menu.tree(this)
			});
}