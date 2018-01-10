Ext.namespace('Ext.muw');

Ext.muw.form = Ext.extend(Ext.FormPanel, {
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
						}];
				Ext.muw.form.superclass.constructor.call(this, {
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

Ext.muw.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.muw.form(this);
				Ext.muw.win.superclass.constructor.call(this, {
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
					Ext.eu.ajax(path + '/wbb/saveMuw.do', {
								muw : Ext.encode(form.getValues())
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

Ext.muw.tree = Ext.extend(Ext.tree.TreePanel, {
	constructor : function(app) {
		this.muwNode = null;
		this.app = app;
		// 菜单根节点
		this.root = new Ext.tree.AsyncTreeNode({
					id : '0',
					text : '补充水',
					draggable : false
				});
		// 菜单条
		this.tbar = new Ext.Toolbar([{
					text : '新增',
					iconCls : 'add',
					handler : this.onAdd,
					scope : this
				}, {
					text : '修改',
					iconCls : 'modify',
					handler : this.onModify,
					scope : this
				}, {
					text : '删除',
					iconCls : 'delete',
					handler : this.onDelete,
					scope : this
				}, '->', {
					text : '刷新',
					iconCls : 'refresh',
					handler : this.onRefresh,
					scope : this
				}, {
					text : '合并到一期',
					iconCls : 'add',
					handler : this.onMerge,
					scope : this
				}, {
					text : '引用补充水',
					iconCls : 'add',
					handler : this.onImport,
					scope : this
				}]);

		Ext.muw.tree.superclass.constructor.call(this, {
					region : 'center',
					width : '15%',
					animate : true,
					autoScroll : true,
					enableDD : false,// 是否支持拖拽效果
					containerScroll : true,// 是否支持滚动条
					rootVisible : true,// 是否显示根节点
					loader : new Ext.tree.TreeLoader({
								dataUrl : path + '/wbb/getAllMuw.do',
								baseParams : {}
							}),
					listeners : {
						click : function(node, event) {
							this.muwNode = node;
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
		if (this.muwNode == null) {
			Ext.ux.Toast.msg('信息', '请选择归属节点');
		} else {
			var id = this.muwNode.id;
			if (id == 0 || (id != 1 && id != 2)) {
				Ext.ux.Toast.msg('信息', '请选择常规或非常规节点');
			} else {
				var win = new Ext.muw.win(this);
				var form = win.form.getForm();
				win.show();
				win.setTitle('添加补充水', 'add');
				form.findField('fatherName').setValue(this.muwNode.text);
				form.findField('fatherId').setValue(id);
			}
		}
	},
	onModify : function() {
		if (this.muwNode == null) {
			Ext.ux.Toast.msg('信息', '请选择要修改的节点');
		} else {
			var id = this.muwNode.id;
			if (id == 0 || id == 1 || id == 2) {
				Ext.ux.Toast.msg('信息', '此节点不允许修改');
			} else {
				var win = new Ext.muw.win(this);
				var form = win.form.getForm();
				form.findField('id').setValue(id);
				form.findField('text').setValue(this.muwNode.text);
				form.findField('fatherName')
						.setValue(this.muwNode.parentNode.text);
				form.findField('fatherId').setValue(this.muwNode.parentNode.id);
				win.setTitle('修改补充水', 'modify');
				win.show();
			}
		}
	},
	onDelete : function() {
		if (this.muwNode == null) {
			Ext.ux.Toast.msg('信息', '请选择要删除的节点');
		} else {
			var id = this.muwNode.id;
			if (id == 0 || id == 1 || id == 2) {
				Ext.ux.Toast.msg('信息', '此节点不允许删除');
			} else {
				Ext.Msg.confirm('删除操作', '确定要删除选中节点吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/wbb/deleteMuw.do', {
											muw : Ext.encode({
														id : this.muwNode.id
													})
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getRootNode().reload();// 刷新当前树
										}, this);
							}
						}, this);
			}
		}
	},
	onMerge : function(btn) {
		Ext.Msg.show({
					buttons : Ext.Msg.CANCEL,
					icon : Ext.Msg.INFO,
					title : '信息',
					msg : '功能暂未开放！'
				});
	},
	onImport : function(btn) {
		Ext.Msg.show({
					buttons : Ext.Msg.CANCEL,
					icon : Ext.Msg.INFO,
					title : '信息',
					msg : '功能暂未开放！'
				});
	}
});

/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var muwView = function() {
	this.tree = new Ext.muw.tree(this);
	return new Ext.Panel({
				id : 'muwView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '补充水类别管理',
				layout : 'border',
				items : [this.tree]
			});
}