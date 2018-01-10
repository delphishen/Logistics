Ext.namespace("Ext.standardKqSelector");

Ext.standardKqSelector.form = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;

				this.radio = new Ext.form.RadioGroup({
							fieldLabel : '限值/范围',
							items : [{
										boxLabel : '限值',
										checked : true,
										name : 'limitType',
										inputValue : 1,
										listeners : {
											check : function(checkbox, checked) {
												if (checked) {
													Ext.getCmp('combo').show();
													Ext.getCmp('value1').hide();
													Ext.getCmp('left').hide();
													Ext.getCmp('right').hide();
												}
											},
											scope : this
										}
									}, {
										boxLabel : '范围',
										inputValue : 2,
										name : 'limitType',
										checked : false,
										listeners : {
											check : function(checkbox, checked) {
												if (checked) {
													Ext.getCmp('combo').hide();
													Ext.getCmp('value1').show();
													Ext.getCmp('left').show();
													Ext.getCmp('right').show();
												}
											},
											scope : this
										}
									}]
						});

				this.combo = new Ext.form.ComboBox({
							hideLabel : true,
							id : 'combo',
							xtype : 'combo',
							anchor : '100%',
							submitValue : false,
							editable : false,
							mode : 'local',
							triggerAction : 'all',
							lazyRender : true,
							selectOnFocus : true,
							allowBlank : false,
							store : new Ext.data.ArrayStore({
										fields : ['val'],
										data : [['>'], ['>='], ['='], ['<='],
												['<']]
									}),
							displayField : 'val',
							valueField : 'val',
							listeners : {
								'select' : function(combo, record) {
									// this.getForm().findField('belongSortId')
									// .setValue(record.data.id);
								},
								scope : this
							},
							scope : this
						});

				this.items = [{
							columnWidth : 1,
							items : [this.radio]
						}, {
							columnWidth : .2,
							items : [{
										xtype : 'label',
										text : '值:'
									}]
						}, {
							columnWidth : .1,
							items : [{
										xtype : 'textfield',
										hideLabel : true,
										hidden : true,
										id : 'value1',
										anchor : '100%'
									}]
						}, {
							columnWidth : .1,
							items : [{
										xtype : 'label',
										id : 'left',
										hidden : true,
										text : '<'
									}]
						}, {
							columnWidth : .15,
							items : [{
										xtype : 'label',
										id : 'chooseKq',
										text : '所选指标'
									}]
						}, {
							columnWidth : .15,
							items : [this.combo]
						}, {
							columnWidth : .1,
							items : [{
										xtype : 'label',
										id : 'right',
										hidden : true,
										text : '<'
									}]
						}, {
							columnWidth : .1,
							items : [{
										xtype : 'textfield',
										hideLabel : true,
										id : 'value2',
										anchor : '100%'
									}]
						}];

				Ext.standardKqSelector.form.superclass.constructor.call(this, {
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

Ext.standardKqSelector.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryKq.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'chName', 'enName', 'unit'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								start : 0,
								limit : 20,
								filter : this.app.app.scope.filter
							},
							listeners : {
								'beforeload' : function() {
									var params = {
										'kqChName' : Ext.getCmp('kqChName')
												.getValue(),
										'kqEnName' : Ext.getCmp('kqEnName')
												.getValue()
									};
									Ext.apply(this.baseParams, params);
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
										win.kq = new mapContainer();
									}
									win.kq.put(record.data.id, record.data);
									Ext.getCmp('chooseKq').setText(record
											.get('chName'));
								},
								'rowdeselect' : function(sm, index, record) {
									var win = this.app;
									Ext.getCmp('chooseKq').setText('所选指标');
									win.kq.remove(record.data.id);
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
										header : '指标中文名称',
										dataIndex : 'chName'
									}, {
										header : '指标英文名称',
										dataIndex : 'enName'
									}, {
										header : '单位',
										dataIndex : 'unit'
									}]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar(['&nbsp;指标中文名称:', {
							id : 'kqChName',
							xtype : 'textfield',
							width : 100
						}, '&nbsp;指标英文名称:', {
							id : 'kqEnName',
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
								Ext.getCmp('kqChName').reset();
								Ext.getCmp('kqEnName').reset();
							}
						}]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.standardKqSelector.grid.superclass.constructor.call(this, {
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

Ext.standardKqSelector.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.kq = new mapContainer();
				this.form = new Ext.standardKqSelector.form(this);
				this.grid = new Ext.standardKqSelector.grid(this);
				Ext.standardKqSelector.win.superclass.constructor.call(this, {
							title : '指标选择器',
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
										text : '取消',
										iconCls : 'cancel',
										handler : this.onClose,
										scope : this
									}]
						});
			},
			onSure : function(btn) {
				if (this.app.isSingle) {
					if (this.kq.values()[0]) {
						var kq = this.kq.values()[0];
						kq.limitType = this.form.radio.getValue().inputValue;
						if (this.form.radio.getValue().inputValue == 1) {
							kq.value = Ext.getCmp('combo').getValue()
									+ Ext.getCmp('value2').getValue();
						} else {
							kq.value = '(' + Ext.getCmp('value1').getValue()
									+ ',' + Ext.getCmp('value2').getValue()
									+ ')';
						}
						this.app.callback.call(this.app.scope, kq);
					} else {
						Ext.ux.Toast.msg('提示', '请选择关键指标');
						return;
					}
				} else {

				}
				this.close();
			},
			onReset : function(btn) {
				this.form.getForm().reset();
				this.kq = [];
			},
			onClose : function() {
				this.close();
			}
		});

var standardKqSelector = function(callback, isSingle, scope) {
	this.callback = callback;
	this.isSingle = isSingle;
	this.scope = scope;
	var win = new Ext.standardKqSelector.win(this);
	win.show();
}