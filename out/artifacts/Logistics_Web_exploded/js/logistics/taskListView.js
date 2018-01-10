Ext.namespace('Ext.taskList');

Ext.taskList.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		this.loadingPointCombo = new Ext.form.ComboBox({
			fieldLabel : '装货点',
			name : 'loadingPoint',
			xtype : 'combo',
			anchor : '98%',
			submitValue : false,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			lazyRender : true,
			selectOnFocus : true,			
			typeAhead : true,			
			allowBlank : false,
		//	store : Ext.getCmp('taskListQueryPanel').getForm().findField('loadingPoint').getStore(),
			store : Ext.getCmp('taskListQueryPanel').linesDS,
			displayField : 'linesName',
			valueField : 'id',			
			listeners : {
				'select' : function(combo, record) {
					this.getForm().findField('loadingPointID').setValue(record.data.id);
				//	Ext.ux.Toast.msg('装货点record.data.id', record.data.id);
				},
				scope : this
			},
			
			scope : this
		});
		this.unloadingPointCombo = new Ext.form.ComboBox({
			fieldLabel : '卸货点',
			name : 'unloadingPoint',
			xtype : 'combo',
			anchor : '98%',
			submitValue : false,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			lazyRender : true,
			selectOnFocus : true,
			allowBlank : false,
			store : Ext.getCmp('taskListQueryPanel').linesDS,
			displayField : 'linesName',
			valueField : 'id',			
			listeners : {
				'select' : function(combo, record) {
					this.getForm().findField('unloadingPointID').setValue(record.data.id);
				},
				scope : this
			},
			
			scope : this
		});		
		
		this.customerCombo = new Ext.form.ComboBox({
			fieldLabel : '货主',
			name : 'customerCom',
			xtype : 'combo',
			anchor : '98%',
			submitValue : false,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			lazyRender : true,
			selectOnFocus : true,
			allowBlank : false,
			displayField : 'customerName',
			valueField : 'id',
			store : Ext.getCmp('taskListQueryPanel').customerDS,	
			listeners : {
				'select' : function(combo, record) {
					this.getForm().findField('customerID').setValue(record.data.id);
				},
				scope : this
			}
		});		
		
		this.contractCombo = new Ext.form.ComboBox({
			
			fieldLabel : '关联合同',
			xtype : 'combo',
			hiddenName : 'contractNO',
		//	name : 'contractCom',
			submitValue : false,
			anchor : '98%',
			editable : true,
			triggerAction : 'all',
			mode : 'local',	
		//	autoDestroy : true,
		//	autoLoad : true,			
			allowBlank : true,		
			store :Ext.getCmp('taskListQueryPanel').contractDS,
		//	Ext.getCmp('taskListQueryPanel').contractDS,
			valueField : 'id',
			displayField : 'contractNO',
			listeners : {
				'select' : function(combo, record) {
					this.getForm().findField('contractID').setValue(record.data.id);
				},
				scope : this
			},			
			scope : this			
			
			
		});		
		
		
		
		this.empSelector = new Ext.form.TriggerField({
			fieldLabel : '业务员',
			name : 'salesman',
			anchor : '98%',
			triggerClass : 'x-form-search-trigger',
			selectOnFocus : true,
			submitValue : false,
			editable : false,
			onTriggerClick : function(e) {
				new empSelector(function(id, name) {
					this.setValue(name);
					Ext.getCmp('salesmanID').setValue(id);		
							
						}, true, this);
			},
			scope : this
		});

		this.items = [{
					xtype : 'hidden',
					id : 'id'
				},{
					xtype : 'hidden',
					id : 'salesmanID'
				}, {
					xtype : 'hidden',
					id : 'customerID'
				},				
				{					
					xtype : 'hidden',
					id : 'loadingPointID'
				},
				{				
					xtype : 'hidden',
					id : 'unloadingPointID'
				},
				{				
					xtype : 'hidden',
					id : 'contractID'
				},
				{
					columnWidth : 1,					
					items : [{
								fieldLabel : '任务单号',
								xtype : 'textfield',
								name : 'taskID',
								anchor : '98%',								
								selectOnFocus : true,
								hidden : true
							}]
				},{
					columnWidth : .5,					
					items : [{
								fieldLabel : '开始时间',
								xtype : 'datefield',
								name : 'dateBegin',
								format : 'Y-m-d',
								editable : false,
								anchor : '98%',
								selectOnFocus : true
							},
							{
								fieldLabel : '截止时间',
								xtype : 'datefield',
								name : 'dateEnd',
								format : 'Y-m-d',
								editable : false,
								allowBlank : false,
								anchor : '98%',
								selectOnFocus : true
							}//货主  
							,this.customerCombo,
							{
								fieldLabel : '船名',
								xtype : 'textfield',
								name : 'shipName',
								anchor : '98%',
								selectOnFocus : true
							},{
								fieldLabel : '运输量天',
								xtype : 'numberfield',
								name : 'trafficVolume',
								anchor : '98%',
								selectOnFocus : true
							},
							{
								xtype : 'combo',
								fieldLabel : '收款方式',
								hiddenName : 'receivablesMethod',
								anchor : '98%',
								typeAhead : true,
								editable : false,
								triggerAction : 'all',
								lazyRender : true,
								mode : 'local',
								value:'',
								store : new Ext.data.ArrayStore({
											fields : ['key', 'val'],
											data : [['含税','含税'],
													['不含税', '不含税']]
										}),
								valueField : 'val',
								displayField : 'key'
							},
							{
								xtype : 'combo',
								fieldLabel : '状态',
								hiddenName : 'taskCondition',
								anchor : '98%',
								typeAhead : true,
								editable : false,
								triggerAction : 'all',
								lazyRender : true,
								mode : 'local',
								value:'正常',
								store : new Ext.data.ArrayStore({
											fields : ['key', 'val'],
											data : [['正常', '正常'],
													['不可用', '不可用']]
										}),
								valueField : 'val',
								displayField : 'key'
							}
							,this.contractCombo
					
					        ]
				},   
				{//  装货点  卸货点
					columnWidth : .5,					
					items : [this.loadingPointCombo,this.unloadingPointCombo]
				},	
				
				{
					columnWidth : .5,				
					items : [{
								fieldLabel : '货物',
								xtype : 'textfield',
								name : 'cargoType',
								anchor : '98%',
								selectOnFocus : true
							},{
								fieldLabel : '运合同量',
								xtype : 'numberfield',
								name : 'contract',
								anchor : '98%',
								selectOnFocus : true
							}]
				}, 
				 {
					columnWidth : .5,
					
					items : [{
						fieldLabel : '收运费',
						xtype : 'numberfield',
						name : 'freight',
						anchor : '98%',
						selectOnFocus : true
					},{
						fieldLabel : '付运费',
						xtype : 'numberfield',
						name : 'payFreight',
						anchor : '98%',
						selectOnFocus : true
					},
					{
								xtype : 'combo',
								fieldLabel : '是否含税',
								hiddenName : 'isYN',
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
							}]
				}	,			
				{//业务员
					columnWidth : .5,
					items : [this.empSelector]
				}			
				];

		Ext.taskList.form.superclass.constructor.call(this, {
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

Ext.taskList.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.taskList.form(this);
							
				
				Ext.taskList.win.superclass.constructor.call(this, {
							width : 700,
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
					Ext.eu.ajax(path + '/logistics/saveTaskList.do', {
						        taskList : Ext.encode(user)
							}, function(resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getStore().reload();
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

Ext.taskList.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				
			
				
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/logistics/queryTaskList.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',							
							fields : ['id', 'taskID', 'dateBegin', 'dateEnd',
							          'customerID','customerName', 'loadingPoint', 'loadingPointID','unloadingPoint','unloadingPointID', 
							          'cargoType','shipName','contract','trafficVolume','residualQuantity','freight','payFreight',
									  'isYN','receivablesMethod','salesmanID','salesman','taskCondition','contractID','contractNO'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								isPaging : true,
								start : 0,
								limit : 80
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
									},{
										header : '任务单号',
										dataIndex : 'taskID',
										hidden : false
									}, {
										header : '开始时间',
										dataIndex : 'dateBegin'										
									}, {
										header : '截止时间',
										dataIndex : 'dateEnd'
									}, {
										header : '货主',
										dataIndex : 'customerName'
									}, {
										header : '装货点',
										dataIndex : 'loadingPoint'
									}, {
										header : '卸货点',
										dataIndex : 'unloadingPoint'
									}, {
										header : '货物',
										dataIndex : 'cargoType'
									}, {
										header : '船名',
										dataIndex : 'shipName'
									}, {
										header : '运输合同量',
										dataIndex : 'contract'
									}, {
										header : '运输量/天',
										dataIndex : 'trafficVolume'
									}, {
										header : '剩余量',
										dataIndex : 'residualQuantity'
									}, {
										header : '收运费',
										dataIndex : 'freight'
									},  {
										header : '付运费',
										dataIndex : 'payFreight'
									}, 	{
										header : '是否含税',
										dataIndex : 'isYN',
										xtype: "booleancolumn",
										trueText: "含税",
										falseText: "不含税"
									}, {
										header : '收款方式',
										dataIndex : 'receivablesMethod'
									}, {
										header : '业务员',
										dataIndex : 'salesman'
									}, {
										header : '状态',
										dataIndex : 'taskCondition'
									}, {
										header : '关联合同',
										dataIndex : 'contractNO'
									}		
									
									
									]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							id:'buttonAddCopyTaskListView',
							xtype : 'button',
							iconCls : 'add',
							text : '复制新增',
							handler : this.onAdd,
							scope : this
						},{
							id:'buttonAddTaskListView',
							xtype : 'button',
							iconCls : 'add',
							text : '新增',
							handler : this.onAdd,
							scope : this
						}, {
							id:'buttonModifyTaskListView',
							xtype : 'button',
							iconCls : 'modify',
							text : '修改',
							handler : this.onModify,
							scope : this
						}, {
							id:'buttonDelTaskListView',
							xtype : 'button',
							iconCls : 'delete',
							text : '删除',
							handler : this.onDelete,
							scope : this
						}]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 80,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.taskList.grid.superclass.constructor.call(this, {
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
				var win = new Ext.taskList.win(this);
				
				win.setTitle('添加任务', 'add');

				if(btn.id=='buttonAddCopyTaskListView'){
					
					var selects = Ext.eu.getSelects(this);
					if (selects.length == 0) {
						Ext.ux.Toast.msg("信息", "请选择要复制的记录！");
						return;
					}
					if (selects.length > 1) {
						Ext.ux.Toast.msg("信息", "只能选择一条记录！");
						return;
					}
					var select = selects[0].data;					
					var form = win.form.getForm();
					win.setTitle('复制添加任务', 'add');
					form.findField('dateBegin').setValue(select.dateBegin);
					form.findField('dateEnd').setValue(select.dateEnd);
					form.findField('customerID').setValue(select.customerID);
					form.findField('customerCom').setValue(select.customerName);
					form.findField('loadingPoint').setValue(select.loadingPoint);		
					form.findField('loadingPointID').setValue(select.loadingPointID);	
					form.findField('unloadingPoint').setValue(select.unloadingPoint);
					form.findField('unloadingPointID').setValue(select.unloadingPointID);
					form.findField('cargoType').setValue(select.cargoType);
					form.findField('shipName').setValue(select.shipName);	
					form.findField('contract').setValue(select.contract);
					form.findField('trafficVolume').setValue(select.trafficVolume);
					
					form.findField('payFreight').setValue(select.payFreight)
					form.findField('freight').setValue(select.freight)
					form.findField('isYN').setValue(select.isYN)
					form.findField('receivablesMethod').setValue(select.receivablesMethod)
					
					//业务员
					form.findField('salesmanID').setValue(select.salesmanID);
					form.findField('salesman').setValue(select.salesman);
					form.findField('taskCondition').setValue(select.taskCondition);
					form.findField('contractID').setValue(select.contractID);
					form.findField('contractNO').setValue(select.contractNO);
					
				}
				
				
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
				//Ext.ux.Toast.msg("信息", select.buyingTime);
				var win = new Ext.taskList.win(this);
				var form = win.form.getForm();
				win.setTitle('修改任务信息', 'modify');				
				form.findField('id').setValue(select.id);
				form.findField('taskID').setValue(select.taskID);
				
				form.findField('dateBegin').setValue(select.dateBegin);
				form.findField('dateEnd').setValue(select.dateEnd);
				form.findField('customerID').setValue(select.customerID);

				form.findField('customerCom').setValue(select.customerName);
				
				form.findField('loadingPoint').setValue(select.loadingPoint);	
	
				form.findField('loadingPointID').setValue(select.loadingPointID);	
				form.findField('unloadingPoint').setValue(select.unloadingPoint);
				form.findField('unloadingPointID').setValue(select.unloadingPointID);
				form.findField('cargoType').setValue(select.cargoType);
				form.findField('shipName').setValue(select.shipName);	
				form.findField('contract').setValue(select.contract);
				form.findField('trafficVolume').setValue(select.trafficVolume);
				
				form.findField('payFreight').setValue(select.payFreight)
				form.findField('freight').setValue(select.freight)
				form.findField('isYN').setValue(select.isYN)
				form.findField('receivablesMethod').setValue(select.receivablesMethod)
				
				//业务员
				form.findField('salesmanID').setValue(select.salesmanID);
				form.findField('salesman').setValue(select.salesman);
				form.findField('taskCondition').setValue(select.taskCondition);
				form.findField('contractID').setValue(select.contractID);
				form.findField('contractNO').setValue(select.contractNO);
				
				
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
				 
				// Ext.ux.Toast.msg("信息", Ext.encode(ary));
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/logistics/deleteTaskList.do', {
									       taskLists : Ext.encode(ary)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			}
		});

Ext.taskList.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.linesDS = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : path
										+ '/logistics/getLinesAll.do',
								method : 'POST'
							}),
					reader : new Ext.data.JsonReader({}, [{
										name : 'id',
										mapping : 'id'
									}, {
										name : 'linesName',
										mapping : 'linesName'
									}])
				});	

				 this.contractDS = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
							url : path
									+ '/logistics/getAllContract.do',
							method : 'POST'
						}),
				reader : new Ext.data.JsonReader({}, 
						[{name : 'id'}, {name : 'contractNO'}])
			});	
				 this.contractDS.load();
		
				 
				 this.customerDS = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
							url : path
									+ '/logistics/getAllCustomer.do',
							method : 'POST'
						}),
				reader : new Ext.data.JsonReader({}, [{
									name : 'id',
									mapping : 'id'
								}, {
									name : 'customerName',
									mapping : 'customerName'
								}])
			});
				 
				 this.customerDS.load();
				 
				 
				 
				 
				 
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{		
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '任务单号',
								id : 'taskID',
								anchor : '90%'
							}]
				},
				{
					width : 180,
					items : [{
								fieldLabel : '开始时间',
								xtype : 'datefield',
								name : 'dateBegin',
								format : 'Y-m-d',
								editable : false,
								anchor : '90%',
								selectOnFocus : true
							}]
				},{
					width : 180,
					items : [{
								fieldLabel : '截止时间',
								xtype : 'datefield',
								name : 'dateEnd',
								format : 'Y-m-d',
								editable : false,
								anchor : '90%',
								selectOnFocus : true
							}]
				},
						{
							width : 180,
							items : [{
								fieldLabel : '货主',
								width : 60,
								xtype : 'combo',
								hiddenName : 'customerName',
								submitValue : false,
								anchor : '90%',
								editable : true,
								triggerAction : 'all',
								mode : 'local',
								store :this.customerDS,
								valueField : 'customerName',
								displayField : 'customerName',
								listeners : {
									'select' : function(combo, record) {
									//	this.getForm().findField('linesName').setValue(record.data.id);
									},
									scope : this
								}
							}]
						},						
						
						{
							width : 180,
							items : [{
								fieldLabel : '装货点',
								width : 60,
								xtype : 'combo',
								hiddenName : 'loadingPoint',
								submitValue : false,
								anchor : '90%',
								editable : true,
								triggerAction : 'all',
								mode : 'local',
								store :this.linesDS,
								valueField : 'linesName',
								displayField : 'linesName',
								listeners : {
									'select' : function(combo, record) {
									//	this.getForm().findField('linesName').setValue(record.data.id);
									},
									scope : this
								}
							}]
						},
						{
							width : 180,
							items : [{
								fieldLabel : '卸货点',
								width : 60,
								xtype : 'combo',
								hiddenName : 'unloadingPoint',
								submitValue : false,
								anchor : '90%',
								editable : true,
								triggerAction : 'all',
								mode : 'local',
								store : this.linesDS,
								valueField : 'linesName',
								displayField : 'linesName',
								listeners : {
									'select' : function(combo, record) {
									//	this.getForm().findField('linesName').setValue(record.data.id);
									},
									scope : this
								}
							}]
						},	
						{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '货物',
										id : 'cargoType',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '船名',
										id : 'shipName',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '合同量',
										id : 'contract',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '运输量天',
										id : 'trafficVolume',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '剩余量',
										id : 'residualQuantity',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '收运费',
										id : 'freight',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '付运费',
										id : 'payFreight',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'combo',
										width : 60,
										fieldLabel : '是否含税',									
										hiddenName : 'isYN',
										anchor : '90%',
										typeAhead : true,
										editable : false,
										triggerAction : 'all',
										lazyRender : true,
										mode : 'local',
										store : new Ext.data.ArrayStore({
													fields : ['key', 'val'],
													data : [['全部', ''],['是', '1'], ['否', '0']]
												}),												
										valueField : 'val',
										displayField : 'key'
									}]
						},  {
							width : 180,
							items : [{
										xtype : 'combo',
										width : 60,
										fieldLabel : '收款方式',									
										hiddenName : 'receivablesMethod',
										anchor : '90%',
										typeAhead : true,
										editable : false,
										triggerAction : 'all',
										lazyRender : true,
										mode : 'local',
										store : new Ext.data.ArrayStore({
													fields : ['key', 'val'],
													data : [['全部', ''],['含税', '含税'], ['不含税', '不含税']]
												}),												
										valueField : 'val',
										displayField : 'key'
									}]
						},  {
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '业务员',
										id : 'salesman',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'combo',
										fieldLabel : '状态',
										width : 60,
										hiddenName : 'taskCondition',									
										anchor : '90%',
										typeAhead : true,
										editable : false,
										triggerAction : 'all',
										lazyRender : true,
										mode : 'local',
										store : new Ext.data.ArrayStore({
													fields : ['key', 'val'],
													data : [['全部', ''],['正常', '正常'], ['不可用', '不可用']]
												}),											
										valueField : 'val',
										displayField : 'key'
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
						}];
				// 查询panel定义
				Ext.taskList.queryPanel.superclass.constructor.call(this, {
							id : 'taskListQueryPanel',
							region : 'north',
							height : 70,
						//	autoHeight:true,
						//	anchor: '100%',
							frame : true,
							split : true,
							collapseMode : 'mini',
							layout : 'column',
							labelAlign : 'right',
							defaults : {
								layout : 'form',							
								labelWidth : 60
							},
							listeners : {
								'render' : function(form) {
									
									this.linesDS.reload();
									form.getForm().findField('customerName').getStore().reload();	
								}
							}
						});
				
			},
			getQueryParams : function() {
			//	Ext.ux.Toast.msg('ccc', this.getForm().getValues());
				return this.getForm().getValues();
			}
		});


/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var taskListView = function(params) {
	this.queryPanel = new Ext.taskList.queryPanel(this);
	this.grid = new Ext.taskList.grid(this);

	Ext.getCmp('buttonAddTaskListView').hidden=!params[0].isAdd;
	Ext.getCmp('buttonAddCopyTaskListView').hidden=!params[0].isAdd;	
	Ext.getCmp('buttonModifyTaskListView').hidden=!params[0].isModify;
	Ext.getCmp('buttonDelTaskListView').hidden=!params[0].isDel;	
	
	return new Ext.Panel({
				id : 'taskListView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '运输任务列表',
				layout : 'border',
				items : [this.queryPanel, this.grid]
			})
}
