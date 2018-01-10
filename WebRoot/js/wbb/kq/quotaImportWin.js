Ext.namespace('Ext.quota');

Ext.quota.seletForm = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;

				this.items = [{
							columnWidth : 1,
							items : [{
										fieldLabel : '已选指标',
										xtype : 'textarea',
										id : 'selected',
										anchor : '100%',
										readOnly : true,
										style : 'background:#E6E6E6'
									}]
						}];

				Ext.quota.seletForm.superclass.constructor.call(this, {
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

Ext.quota.importSzzbGrid = Ext.extend(Ext.grid.GridPanel, {
	constructor : function(app) {
		this.app = app;
		// 数据源
		this.ds = new Ext.data.JsonStore({
					url : path + '/js/wbb/kq/importQuota.json',
					idProperty : 'id',
					root : 'rows',
					totalProperty : 'results',
					fields : ['id', 'chName', 'enName', 'unit'],
					autoDestroy : true,
					autoLoad : true,
					pruneModifiedRecords : true,
					baseParams : {
						start : 0,
						limit : 20
					},
					listeners : {
						'beforeload' : function() {
							Ext.apply(this.getStore().baseParams,
									this.app.mccDataPanel.getQueryParams());
						},
						scope : this
					}
				});
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : false,
					listeners : {
						'rowselect' : function(sm, index, record) {
							var win = this.app;
							if (jQuery.inArray(record.get('id'), win.importIds) < 0) {
								win.importIds.push(record.get('id'));
								win.importNames.push(record.get('chName'));
							}
							win.form.getForm().findField('selected')
									.setValue(win.importNames.toString());
						},
						'rowdeselect' : function(sm, index, record) {
							var win = this.app;
							win.importIds.splice(jQuery.inArray(record
													.get('id'), win.importIds),
									1);
							win.importNames.splice(jQuery.inArray(record
													.get('chName'),
											win.importNames), 1);
							win.form.getForm().findField('selected')
									.setValue(win.importNames.toString());
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
								header : '中文名称',
								dataIndex : 'chName'
							}, {
								header : '英文名称',
								dataIndex : 'enName'
							}, {
								header : '单位',
								dataIndex : 'unit'
							}]
				});
		// 页码条
		this.bbar = new Ext.PagingToolbar({
					pageSize : 20,
					displayInfo : true,
					store : this.ds
				});
		// 构造
		Ext.quota.importSzzbGrid.superclass.constructor.call(this, {
					region : 'center',
					loadMask : 'loading...',
					columnLines : true,
					clicksToEdit : 1,
					stripeRows : true,
					viewConfig : {
						forceFit : true
					},
					listeners : {
						'render' : function() {
							// 强制同步,comboStore加载完毕之后回调时,才加载gridStore,否则将出现第一次显示ID问题
						},
						scope : this
					}
				});
	}
});

Ext.quota.importDsyswGrid = Ext.extend(Ext.grid.GridPanel, {
	constructor : function(app) {
		this.app = app;
		// 数据源
		this.ds = new Ext.data.JsonStore({
					url : path + '/js/wbb/importQuota.json',
					idProperty : 'id',
					root : 'rows',
					totalProperty : 'results',
					fields : ['id', 'chName', 'enName', 'unit'],
					autoDestroy : true,
					autoLoad : false,
					pruneModifiedRecords : true,
					baseParams : {
						start : 0,
						limit : 20
					},
					listeners : {
						'beforeload' : function() {
							// Ext.apply(this.getStore().baseParams,
							// this.app.queryPanel.getQueryParams());
						},
						scope : this
					}
				});
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : false,
					listeners : {
						'rowselect' : function(sm, index, record) {
							var win = this.app;
							if (jQuery.inArray(record.get('id'), win.importIds) < 0) {
								win.importIds.push(record.get('id'));
								win.importChName.push(record.get('name'));
							}
							win.form.getForm().findField('emp')
									.setValue(win.empName.toString());
						},
						'rowdeselect' : function(sm, index, record) {
							var win = this.app;
							win.empId.splice(jQuery.inArray(record.get('id'),
											win.empId), 1);
							win.empName.splice(jQuery.inArray(record
													.get('name'), win.empName),
									1);
							win.form.getForm().findField('emp')
									.setValue(win.empName.toString());
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
								header : '中文名称',
								dataIndex : 'chName'
							}, {
								header : '英文名称',
								dataIndex : 'enName'
							}, {
								header : '单位',
								dataIndex : 'unit'
							}]
				});
		// 页码条
		this.bbar = new Ext.PagingToolbar({
					pageSize : 20,
					displayInfo : true,
					store : this.ds
				});
		// 构造
		Ext.quota.grid.superclass.constructor.call(this, {
					region : 'center',
					loadMask : 'loading...',
					columnLines : true,
					clicksToEdit : 1,
					stripeRows : true,
					viewConfig : {
						forceFit : true
					},
					listeners : {
						'render' : function() {
							// 强制同步,comboStore加载完毕之后回调时,才加载gridStore,否则将出现第一次显示ID问题
						},
						scope : this
					}
				});
	}
});

Ext.quota.importKsyswGrid = Ext.extend(Ext.grid.GridPanel, {
	constructor : function(app) {
		this.app = app;
		// 数据源
		this.ds = new Ext.data.JsonStore({
					url : path + '/js/wbb/importQuota.json',
					idProperty : 'id',
					root : 'rows',
					totalProperty : 'results',
					fields : ['id', 'chName', 'enName', 'unit'],
					autoDestroy : true,
					autoLoad : false,
					pruneModifiedRecords : true,
					baseParams : {
						start : 0,
						limit : 20
					},
					listeners : {
						'beforeload' : function() {
							// Ext.apply(this.getStore().baseParams,
							// this.app.queryPanel.getQueryParams());
						},
						scope : this
					}
				});
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : false,
					listeners : {
						'rowselect' : function(sm, index, record) {
							var win = this.app;
							if (jQuery.inArray(record.get('id'), win.importIds) < 0) {
								win.importIds.push(record.get('id'));
								win.importChName.push(record.get('name'));
							}
							win.form.getForm().findField('emp')
									.setValue(win.empName.toString());
						},
						'rowdeselect' : function(sm, index, record) {
							var win = this.app;
							win.empId.splice(jQuery.inArray(record.get('id'),
											win.empId), 1);
							win.empName.splice(jQuery.inArray(record
													.get('name'), win.empName),
									1);
							win.form.getForm().findField('emp')
									.setValue(win.empName.toString());
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
								header : '中文名称',
								dataIndex : 'chName'
							}, {
								header : '英文名称',
								dataIndex : 'enName'
							}, {
								header : '单位',
								dataIndex : 'unit'
							}]
				});
		// 页码条
		this.bbar = new Ext.PagingToolbar({
					pageSize : 20,
					displayInfo : true,
					store : this.ds
				});
		// 构造
		Ext.quota.grid.superclass.constructor.call(this, {
					region : 'center',
					loadMask : 'loading...',
					columnLines : true,
					clicksToEdit : 1,
					stripeRows : true,
					viewConfig : {
						forceFit : true
					},
					listeners : {
						'render' : function() {
							// 强制同步,comboStore加载完毕之后回调时,才加载gridStore,否则将出现第一次显示ID问题
						},
						scope : this
					}
				});
	}
});

Ext.quota.importSlzbGrid = Ext.extend(Ext.grid.GridPanel, {
	constructor : function(app) {
		this.app = app;
		// 数据源
		this.ds = new Ext.data.JsonStore({
					url : path + '/js/wbb/importQuota.json',
					idProperty : 'id',
					root : 'rows',
					totalProperty : 'results',
					fields : ['id', 'chName', 'enName', 'unit'],
					autoDestroy : true,
					autoLoad : false,
					pruneModifiedRecords : true,
					baseParams : {
						start : 0,
						limit : 20
					},
					listeners : {
						'beforeload' : function() {
							// Ext.apply(this.getStore().baseParams,
							// this.app.queryPanel.getQueryParams());
						},
						scope : this
					}
				});
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
					singleSelect : false,
					listeners : {
						'rowselect' : function(sm, index, record) {
							var win = this.app;
							if (jQuery.inArray(record.get('id'), win.importIds) < 0) {
								win.importIds.push(record.get('id'));
								win.importChName.push(record.get('name'));
							}
							win.form.getForm().findField('emp')
									.setValue(win.empName.toString());
						},
						'rowdeselect' : function(sm, index, record) {
							var win = this.app;
							win.empId.splice(jQuery.inArray(record.get('id'),
											win.empId), 1);
							win.empName.splice(jQuery.inArray(record
													.get('name'), win.empName),
									1);
							win.form.getForm().findField('emp')
									.setValue(win.empName.toString());
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
								header : '中文名称',
								dataIndex : 'chName'
							}, {
								header : '英文名称',
								dataIndex : 'enName'
							}, {
								header : '单位',
								dataIndex : 'unit'
							}]
				});
		// 页码条
		this.bbar = new Ext.PagingToolbar({
					pageSize : 20,
					displayInfo : true,
					store : this.ds
				});
		// 构造
		Ext.quota.grid.superclass.constructor.call(this, {
					region : 'center',
					loadMask : 'loading...',
					columnLines : true,
					clicksToEdit : 1,
					stripeRows : true,
					viewConfig : {
						forceFit : true
					},
					listeners : {
						'render' : function() {
							// 强制同步,comboStore加载完毕之后回调时,才加载gridStore,否则将出现第一次显示ID问题
						},
						scope : this
					}
				});
	}
});

Ext.quota.mccDataPanel = Ext.extend(Ext.Panel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							labelWidth : 60,
							items : [{
										xtype : 'textfield',
										fieldLabel : '指标名称',
										id : 'quotaName',
										anchor : '95%'
									}]
						}, {
							width : 55,
							items : [{
										xtype : 'button',
										text : '查询',
										iconCls : 'query',
										handler : function() {
											// if
											// (this.app.tabs.getActiveTab().id
											// == 'kztszPanel') {
											// this.app.kztszGrid.getStore().reload();
											// } else if
											// (this.app.tabs.getActiveTab().id
											// == 'dsyswPanel') {
											// this.app.dsyswGrid.getStore().reload();
											// } else if
											// (this.app.tabs.getActiveTab().id
											// == 'ksyswPanel') {
											// this.app.ksyswGrid.getStore().reload();
											// } else if
											// (this.app.tabs.getActiveTab().id
											// == 'ksyslPanel') {
											// this.app.ksyslGrid.getStore().reload();
											// }
										},
										scope : this
									}]
						}, {
							width : 55,
							items : [{
										xtype : 'button',
										text : '清空',
										iconCls : 'reset',
										handler : function() {
											Ext.getCmp('quotaName')
													.setValue('');
											// Ext.getCmp('SYMC').setValue('');
											// Ext.getCmp('ZBMC').setValue('');
										},
										scope : this
									}]
						}];
				// panel定义
				Ext.quota.mccDataPanel.superclass.constructor.call(this, {
							region : 'north',
							height : 35,
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
				return {
					name : Ext.getCmp('quotaName').getValue()
				};
			}
		});

Ext.quota.importWin = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.importIds = new Array();
				this.importNames = new Array();
				this.form = new Ext.quota.seletForm(this);
				this.mccDataPanel = new Ext.quota.mccDataPanel(this);
				this.szzbGrid = new Ext.quota.importSzzbGrid(this);
				// this.dsyswGrid = new Ext.quota.importDsyswGrid(this);
				// this.ksyswGrid = new Ext.quota.importKsyswGrid(this);
				// this.slzbGrid = new Ext.quota.importSlzbGrid(this);
				this.tabs = new Ext.TabPanel({
							id : 'importTab',
							region : 'center',
							deferredRender : true,
							enableTabScroll : true,
							activeTab : 0, // first tab initially active,
							defaults : {
								autoScroll : true,
								closable : false
							},
							items : [{
										title : '水质指标',
										xtype : 'panel',
										id : 'szzbPanel',
										layout : 'border',
										items : [this.szzbGrid]
									}
							// , {
							// title : '单水样水稳指标',
							// xtype : 'panel',
							// id : 'dsyswPanel',
							// layout : 'border',
							// items : [this.dsyswGrid]
							// }, {
							// title : '跨水样水稳指标',
							// xtype : 'panel',
							// id : 'ksyswPanel',
							// layout : 'border',
							// items : [this.ksyswGrid]
							// }, {
							// title : '水量指标',
							// xtype : 'panel',
							// id : 'slzbPanel',
							// layout : 'border',
							// items : [this.slzbGrid]
							// }
							],
							listeners : {
								'tabchange' : function(tab, panel) {
									// if (panel.id == 'kztszPanel') {
									// } else if (panel.id == 'dsyswPanel') {
									// } else if (panel.id == 'ksyswPanel') {
									// } else if (panel.id == 'ksyslPanel') {
									// }
								},
								scope : this
							}
						});
				Ext.quota.importWin.superclass.constructor.call(this, {
							width : 600,
							height : 500,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							layout : 'border',
							items : [this.mccDataPanel, this.tabs, this.form],
							buttons : [{
										text : '确定',
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
				var form = this.form.getForm();
				if (form.isValid()) {
					btn.setDisabled(true);
					var quota = form.getValues();
					quota.enName = $('#enName').html();
					// Ext.eu.ajax(path + '/wbb/saveQuota.do', {
					// quota : Ext.encode(quota)
					// }, function(resp) {
					// Ext.ux.Toast.msg('信息', '保存成功');
					// this.app.getStore().reload();
					// this.close();
					// }, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});