Ext.namespace('Ext.userPageRight');

Ext.userPageRight.form = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.tree = new Ext.userPageRight.tree(this);
				this.items = [{
							xtype : 'hidden',
							id : 'id',
							value : this.app.app.user.id
						}, {
							columnWidth : 1,
							items : [{
										fieldLabel : '授权对象',
										xtype : 'textfield',
										name : 'empName',
										readOnly : true,
										style : 'background:#E6E6E6',
										anchor : '100%',
										value : this.app.app.user.empName
									}]
						}, {
							columnWidth : 1,
							items : [this.tree]
						}];

				Ext.userPageRight.form.superclass.constructor.call(this, {
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

Ext.userPageRight.tree = Ext.extend(Ext.tree.TreePanel, {
	constructor : function(app) {
		this.app = app;
		// 菜单根节点
		this.root = new Ext.tree.AsyncTreeNode({
					text : '所有菜单',
					draggable : false,
					id : '0'
				});

		Ext.userPageRight.tree.superclass.constructor.call(this, {
					region : 'center',
					id : 'userPageRightTree',
					title : '权限列表',
					iconCls : 'vcard',
					checkModel : 'cascade',
					height : 400,
					animate : true,
					autoScroll : true,
					enableDD : false,// 是否支持拖拽效果
					containerScroll : true,// 是否支持滚动条
					rootVisible : false,// 是否显示根节点
					loader : new Ext.tree.TreeLoader({
								dataUrl : path + '/system/buildMenu.do',// http://localhost:8080/mccdesign/system/buildByUserIdMenu.do
								baseParams : {},
								baseAttrs : {
									uiProvider : Ext.ux.tree.TreeCheckNodeUI
								},
								listeners : {
									load : function() {
										var userId = this.app.app.app.user.id;
										Ext.eu.ajax(
														path+ '/system/getByUserIdMenu.do',
														{
															userId : userId
														}, function(resp) {
															var arr = Ext.decode(resp.responseText);
														//	alert(resp.responseText);
															this.onChecked(arr);
														}, this);
									},
									scope : this
								}
							})
				});
		this.expandAll();
	},
	onUnChecked : function() {
		var nodes = this.getChecked();
		for (var i = 0; i < nodes.length; i++) {
			// 设置UI状态为未选中状态
			nodes[i].getUI().toggleCheck(false);
		}
	},
	onChecked : function(tr) {
		this.onUnChecked();
		for (var i = 0; i < tr.length; i++) {
			var node = this.getNodeById(tr[i].id);
			if (node.isLeaf())  node.getUI().toggleCheck(true);
		}
	}

});

Ext.userPageRight.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.userPageRight.form(this);
				Ext.userPageRight.win.superclass.constructor.call(this, {
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
				this.userId = this.form.getForm().findField('id').getValue();
				if (this.userId == '') {
					Ext.ux.Toast.msg('信息', '请先选择授权对象');
					return;
				}
				var nodes = this.form.tree.getChecked();
				if (nodes.length == 0) {
					Ext.ux.Toast.msg('信息', '请选择权限');
					return;
				}
				var array = new Array();
				for (var i = 0; i < nodes.length; i++) {
					var object = new Object();
					object.userId = this.userId;
					object.menuId = nodes[i].id;
					array.push(object);
				}
				Ext.eu.ajax(path + '/system/saveRight.do', {
							userPageRights : Ext.encode(array)
						}, function(resp) {
							Ext.ux.Toast.msg('信息', '保存成功');
							this.close();
						}, this);
			},
			onClose : function() {
				this.close();
			}
		});