Ext.namespace("Ext.userSelector");

Ext.userSelector.form = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.items = [{
							columnWidth : 1,
							items : [{
										fieldLabel : '已选人员',
										xtype : 'textarea',
										id : 'user',
										anchor : '100%',
										readOnly : true,
										style : 'background:#E6E6E6'
									}]
						}];

				Ext.userSelector.form.superclass.constructor.call(this, {
							region : 'south',
							height : 75,
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

Ext.userSelector.grid = Ext.extend(Ext.grid.GridPanel, {
	constructor : function(app) {
		this.app = app;
		// 数据源
		this.ds = new Ext.data.JsonStore({
					url : path + '/system/queryUser.do',
					idProperty : 'id',
					root : 'rows',
					totalProperty : 'results',
					fields : ['id', 'userName', 'loginName', 'accountId',
							'roleId', 'deptName', 'deptId'],
					autoDestroy : true,
					autoLoad : true,
					baseParams : {
						start : 0,
						limit : 20
					},
					listeners : {
						'beforeload' : function() {
							var params = {
								'Q_u.name_S_LK' : Ext.getCmp('queryUserName')
										.getValue(),
								'Q_a.loginName_S_LK' : Ext
										.getCmp('queryLoginName').getValue()
							};
							Ext.apply(this.baseParams, params);
						}
					}
				});
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : this.app.app.isSingle,
					listeners : {
						'rowselect' : function(sm, index, record) {
							var win = this.app;
							if (win.app.isSingle) {
								win.userId = [];
								win.userName = [];
							}
							if (jQuery.inArray(record.get('id'), win.userId) < 0) {
								win.userId.push(record.get('id'));
								win.userName.push(record.get('userName'));
							}
							win.form.getForm().findField('user')
									.setValue(win.userName.toString());
						},
						'rowdeselect' : function(sm, index, record) {
							var win = this.app;
							win.userId.splice(jQuery.inArray(record.get('id'),
											win.userId), 1);
							win.userName.splice(jQuery.inArray(record
													.get('userName'),
											win.userName), 1);
							win.form.getForm().findField('user')
									.setValue(win.userName.toString());
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
								header : 'accountId',
								dataIndex : 'accountId',
								hidden : true
							}, {
								header : '姓名',
								dataIndex : 'userName'
							}, {
								header : '账号',
								dataIndex : 'loginName'
							}, {
								header : '角色',
								dataIndex : 'roleId',
								hidden : true
							}, {
								header : '部门',
								dataIndex : 'deptName'
							}, {
								header : 'deptId',
								dataIndex : 'deptId',
								hidden : true
							}]
				});
		// 菜单条
		this.tbar = new Ext.Toolbar(['&nbsp;姓名:', {
					id : 'queryUserName',
					xtype : 'textfield',
					width : 100
				}, '&nbsp;账号:', {
					id : 'queryLoginName',
					xtype : 'textfield',
					width : 100
				}, '-', {
					text : '查询',
					xtype : 'button',
					iconCls : 'query',
					handler : function() {
						this.getStore().load();
					},
					scope : this
				}, {
					text : '清空',
					xtype : 'button',
					iconCls : 'reset',
					handler : function() {
						Ext.getCmp('queryUserName').reset();
						Ext.getCmp('queryLoginName').reset();
					}
				}]);
		// 页码条
		this.bbar = new Ext.PagingToolbar({
					pageSize : 20,
					displayInfo : true,
					store : this.ds
				});
		// 构造
		Ext.userSelector.grid.superclass.constructor.call(this, {
					region : 'center',
					loadMask : 'loading...',
					columnLines : true,
					stripeRows : true,
					style : 'padding-right:1px',
					viewConfig : {
						forceFit : true
					}
				});
	}
});

Ext.userSelector.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.userId = new Array();
				this.userName = new Array();
				this.form = new Ext.userSelector.form(this);
				this.grid = new Ext.userSelector.grid(this);
				Ext.userSelector.win.superclass.constructor.call(this, {
							title : '人员选择器',
							width : 500,
							height : 400,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							layout : 'border',
							items : [this.form, this.grid],
							buttons : [{
										text : '确定所选',
										iconCls : 'tick',
										handler : this.onSure,
										scope : this
									}, {
										text : '清空所选',
										iconCls : 'reset',
										handler : this.onReset,
										scope : this
									}, {
										text : '取消',
										iconCls : 'cancel',
										handler : this.onClose,
										scope : this
									}]
						});
			},
			onSure : function(btn) {
				this.app.callback.call(this.app.scope, this.userId.toString(),
						this.userName.toString());
				this.close();
			},
			onReset : function(btn) {
				this.form.getForm().reset();
				this.userId = [];
				this.userName = [];
			},
			onClose : function() {
				this.close();
			}
		});

var userSelector = function(callback, isSingle, scope) {
	this.callback = callback;
	this.isSingle = isSingle;
	this.scope = scope;
	var win = new Ext.userSelector.win(this);
	win.show();
}