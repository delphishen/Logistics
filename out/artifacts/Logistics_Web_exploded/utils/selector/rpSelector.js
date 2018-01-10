Ext.namespace("Ext.rpSelector");

Ext.rpSelector.form = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.items = [{
							columnWidth : 1,
							items : [{
										fieldLabel : '已选参数',
										xtype : 'textarea',
										id : 'rp',
										anchor : '100%',
										readOnly : true,
										style : 'background:#E6E6E6'
									}]
						}];

				Ext.rpSelector.form.superclass.constructor.call(this, {
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

Ext.rpSelector.grid = Ext.extend(Ext.grid.GridPanel, {
	constructor : function(app) {
		this.app = app;
		// 数据源
		this.ds = new Ext.data.JsonStore({
					url : path + '/wbb/queryJqRp.do',
					idProperty : 'id',
					root : 'rows',
					totalProperty : 'results',
					fields : ['id', 'name'],
					autoDestroy : true,
					autoLoad : true,
					baseParams : {
						start : 0,
						limit : 20
					},
					listeners : {
						'beforeload' : function() {
							// 参数类别为计算参数的记录
							Ext.apply(this.getStore().baseParams,
									this.app.queryPanel.getQueryParams());
						},
						scope : this
					}
				});
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : this.app.app.isSingle,
					listeners : {
						'rowselect' : function(sm, index, record) {
							var win = this.app;
							if (win.app.isSingle) {
								win.rpId = [];
								win.rpName = [];
							}
							if (jQuery.inArray(record.get('id'), win.rpId) < 0) {
								win.rpId.push(record.get('id'));
								win.rpName.push(record.get('name'));
							}
							win.form.getForm().findField('rp')
									.setValue(win.rpName.toString());
						},
						'rowdeselect' : function(sm, index, record) {
							var win = this.app;
							win.rpId.splice(jQuery.inArray(record.get('id'),
											win.rpId), 1);
							win.rpName.splice(jQuery.inArray(
											record.get('name'), win.rpName), 1);
							win.form.getForm().findField('rp')
									.setValue(win.rpName.toString());
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
								header : '参数名称',
								dataIndex : 'name'
							}]
				});
		// 页码条
		this.bbar = new Ext.PagingToolbar({
					pageSize : 20,
					displayInfo : true,
					store : this.ds
				});
		// 构造
		Ext.rpSelector.grid.superclass.constructor.call(this, {
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

Ext.rpSelector.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							labelWidth : 60,
							items : [{
										xtype : 'textfield',
										fieldLabel : '参数名称',
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
				Ext.rpSelector.queryPanel.superclass.constructor.call(this, {
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

Ext.rpSelector.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.rpId = new Array();
				this.rpName = new Array();
				this.form = new Ext.rpSelector.form(this);
				this.grid = new Ext.rpSelector.grid(this);
				this.queryPanel = new Ext.rpSelector.queryPanel(this);
				Ext.rpSelector.win.superclass.constructor.call(this, {
							title : '结论参数',
							width : 500,
							height : 400,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							layout : 'border',
							items : [this.form, this.grid, this.queryPanel],
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
				this.app.callback.call(this.app.scope, this.rpId.toString(),
						this.rpName.toString());
				this.close();
			},
			onReset : function(btn) {
				this.form.getForm().reset();
				this.rpId = [];
				this.rpName = [];
			},
			onClose : function() {
				this.close();
			}
		});

var rpSelector = function(callback, isSingle, scope) {
	this.callback = callback;
	this.isSingle = isSingle;
	this.scope = scope;
	var win = new Ext.rpSelector.win(this);
	win.show();
}