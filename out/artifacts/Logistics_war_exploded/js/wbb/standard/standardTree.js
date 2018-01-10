Ext.namespace('Ext.standardTree');

Ext.standardTree.form = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.items = [{
							xtype : 'hidden',
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
										name : 'fatherName',
										anchor : '100%',
										readOnly : true,
										submitValue : false,
										style : 'background:#E6E6E6'
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '名称',
										xtype : 'textfield',
										name : 'text',
										anchor : '100%',
										allowBlank : false
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '备注',
										xtype : 'textarea',
										name : 'remark',
										anchor : '100%'
									}]
						}];
				Ext.standardTree.form.superclass.constructor.call(this, {
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

Ext.standardTree.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.standardTree.form(this);
				Ext.standardTree.win.superclass.constructor.call(this, {
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
					Ext.eu.ajax(path + '/wbb/saveStandardFilterSort.do', {
								standardFilterSort : Ext.encode(form
										.getValues())
							}, function(resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getRootNode().reload();
									this.app.expandAll();
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

Ext.standardTree.tree = Ext.extend(Ext.tree.TreePanel, {
	constructor : function(app) {
		this.app = app;
		// 菜单根节点
		this.root = new Ext.tree.AsyncTreeNode({
					id : '0',
					text : '筛选类型',
					draggable : false
				});
		// 菜单条
		this.tbar = new Ext.Toolbar([{
					text : '刷新',
					iconCls : 'refresh',
					handler : this.onRefresh,
					scope : this
				}]);

		// 右键目录
		this.menu = new Ext.menu.Menu({
					items : [{
								text : '添加种类',
								iconCls : 'add',
								handler : this.onAdd,
								scope : this
							}, {
								text : '修改种类',
								iconCls : 'modify',
								handler : this.onModify,
								scope : this
							}, {
								text : '删除种类',
								iconCls : 'delete',
								handler : this.onDelete,
								scope : this
							}]
				});

		Ext.standardTree.tree.superclass.constructor.call(this, {
					region : 'west',
					width : '15%',
					animate : true,
					autoScroll : true,
					enableDD : false,// 是否支持拖拽效果
					containerScroll : true,// 是否支持滚动条
					rootVisible : true,// 是否显示根节点
					loader : new Ext.tree.TreeLoader({
								dataUrl : path
										+ '/wbb/buildTreeStandardFilterSort.do',
								baseParams : {}
							}),
					listeners : {
						contextmenu : {
							fn : function(node, event) {
								// 必须写，使用preventDefault方法可防止浏览器的默认事件操作发生。
								event.preventDefault();
								node.select();
								this.menu.showAt(event.getXY());
							},
							scope : this
						},
						click : function(node, event) {
							if (node.id == 0) {
								Ext.getCmp('addSt').disable();
							} else {
								Ext.getCmp('addSt').enable();
							}
							this.app.grid.sortNode = node;
							this.app.grid.getStore().load();
						},
						scope : this
					}
				});
		this.expandAll();
	},
	onRefresh : function() {
		this.getRootNode().reload();
		this.expandAll();
	},
	onAdd : function() {
		var node = this.getSelectionModel().getSelectedNode();
		var win = new Ext.standardTree.win(this);
		var form = win.form.getForm();
		win.show();
		win.setTitle('添加种类', 'add');
		form.findField('fatherName').setValue(node.text);
		form.findField('fatherId').setValue(node.id);
	},
	onModify : function() {
		var node = this.getSelectionModel().getSelectedNode();
		if (node.id != 0) {
			var win = new Ext.standardTree.win(this);
			var form = win.form.getForm();
			form.findField('id').setValue(node.id);
			form.findField('text').setValue(node.text);
			form.findField('remark').setValue(node.attributes.remark);
			form.findField('fatherName').setValue(node.parentNode.text);
			form.findField('fatherId').setValue(node.parentNode.id);
			win.setTitle('修改种类', 'modify');
			win.show();
		} else {
			Ext.ux.Toast.msg('信息', '根元素不允许修改');
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
						Ext.eu.ajax(path + '/wbb/deleteStandardFilterSort.do',
								{
									standardFilterSort : Ext.encode({
												id : node.id
											})
								}, function(resp) {
									Ext.ux.Toast.msg('信息', '删除成功');
									this.getRootNode().reload();// 刷新当前树
								}, this);
					}
				}, this);
	}
});