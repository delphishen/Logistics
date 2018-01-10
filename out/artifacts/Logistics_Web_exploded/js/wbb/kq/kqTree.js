Ext.namespace('Ext.kqTree');

Ext.kqTree.form = Ext.extend(Ext.FormPanel, {
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
										fieldLabel : '父节点444',
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
										fieldLabel : '名称4444',
										xtype : 'textfield',
										name : 'text',
										anchor : '100%',
										allowBlank : false
									}]
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '备注4444',
										xtype : 'textarea',
										name : 'remark',
										anchor : '100%'
									}]
						}];
				Ext.kqTree.form.superclass.constructor.call(this, {
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

Ext.kqTree.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.kqTree.form(this);
				Ext.kqTree.win.superclass.constructor.call(this, {
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
					Ext.eu.ajax(path + '/wbb/saveKqSort.do', {
								kqSort : Ext.encode(form.getValues())
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

Ext.kqTree.tree = Ext.extend(Ext.tree.TreePanel, {
	constructor : function(app) {
		this.app = app;
		// 菜单根节点
		this.root = new Ext.tree.AsyncTreeNode({
					id : '0',
					text : '指标种类',
					draggable : false,
					listeners : {
						beforechildrenrendered : function(node) {
							node.select();
							Ext.getCmp('addKq').disable();
							Ext.getCmp('modifySort').disable();
							Ext.getCmp('deleteSort').disable();
							Ext.getCmp('modifyKq').disable();
							Ext.getCmp('deleteKq').disable();
						}
					}
				});
		// 菜单条
		this.tbar = new Ext.Toolbar([{
					text : '添加',
					iconCls : 'add',
					id : 'addSort',
					handler : this.onAdd,
					scope : this
				}, {
					text : '修改',
					iconCls : 'modify',
					id : 'modifySort',
					handler : this.onModify,
					scope : this
				}, {
					text : '删除',
					iconCls : 'delete',
					id : 'deleteSort',
					handler : this.onDelete,
					scope : this
				}]);

		Ext.kqTree.tree.superclass.constructor.call(this, {
					region : 'west',
					width : '16%',
					animate : true,
					autoScroll : true,
					enableDD : false,// 是否支持拖拽效果
					containerScroll : true,// 是否支持滚动条
					rootVisible : true,// 是否显示根节点
					loader : new Ext.tree.TreeLoader({
								dataUrl : path + '/wbb/buildTreeKqSort.do',
								baseParams : {}
							}),
					listeners : {
						click : function(node, event) {
							if (node.id == 0) {
								Ext.getCmp('addKq').disable();
								Ext.getCmp('addSort').enable();
								Ext.getCmp('modifySort').disable();
								Ext.getCmp('deleteSort').disable();
							} else if (node.id == 'systemnode') {
								Ext.getCmp('addKq').disable();
								Ext.getCmp('modifyKq').disable();
								Ext.getCmp('deleteKq').disable();
								Ext.getCmp('addSort').disable();
								Ext.getCmp('modifySort').disable();
								Ext.getCmp('deleteSort').disable();
							} else {
								Ext.getCmp('addKq').enable();
								Ext.getCmp('addSort').disable();
								Ext.getCmp('modifySort').enable();
								Ext.getCmp('deleteSort').enable();
							}
							Ext.getCmp('modifyKq').disable();
							Ext.getCmp('deleteKq').disable();
							this.app.grid.sortNode = node;
							this.app.grid.getStore().load();
						},
						scope : this
					}
				});
		this.expandAll();
	},
	onAdd : function() {
		var node = this.getSelectionModel().getSelectedNode();
		if (node.leaf) {
			Ext.ux.Toast.msg('信息', '子节点不允许新增');
			return;
		}
		var win = new Ext.kqTree.win(this);
		var form = win.form.getForm();
		win.show();
		win.setTitle('添加种类', 'add');
		form.findField('fatherName').setValue(node.text);
		form.findField('fatherId').setValue(node.id);
	},
	onModify : function() {
		var node = this.getSelectionModel().getSelectedNode();
		if (node.id != 0) {
			var win = new Ext.kqTree.win(this);
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
		if (node.id == water.sortId) {
			Ext.ux.Toast.msg('信息', '水量节点不允许删除');
			return;
		}
		Ext.eu.ajax(path + '/wbb/queryKq.do', {
					kqSortId : '\'' + node.id + '\''
				}, function(resp) {
					var data = Ext.decode(resp.responseText).rows;
					if (data.length > 0) {
						Ext.ux.Toast.msg('信息', '该节点存在关键指标记录，不允许删除！');
						return;
					} else {
						Ext.Msg.confirm('删除操作', '确定要删除选中节点吗?', function(btn) {
									if (btn == 'yes') {
										Ext.eu.ajax(
												path + '/wbb/deleteKqSort.do',
												{
													kqSort : Ext.encode({
																id : node.id
															})
												}, function(resp) {
													Ext.ux.Toast.msg('信息',
															'删除成功');
													this.getRootNode().reload();// 刷新当前树
												}, this);
									}
								}, this);
					}
				}, this);
	}
});