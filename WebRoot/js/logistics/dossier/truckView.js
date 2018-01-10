Ext.namespace('Ext.truck');

Ext.truck.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;

		this.empSelector = new Ext.form.TriggerField({
			fieldLabel : '调度员',
			name : 'dispatchersName',
			anchor : '98%',
			triggerClass : 'x-form-search-trigger',
			selectOnFocus : true,
			submitValue : false,
			allowBlank : false,
			editable : false,
			onTriggerClick : function(e) {
				new empSelector(function(id, name) {
					this.setValue(name);
					Ext.getCmp('dispatchers').setValue(id);		
							
						}, true, this);
			},
			scope : this
		});

		this.items = [{
					xtype : 'hidden',
					id : 'id'
				},{
					xtype : 'hidden',
					id : 'dispatchers'
				}, {
					columnWidth : 1,
					labelWidth : 60,
					items : [{
								fieldLabel : '车管理员',
								xtype : 'textfield',
								name : 'vehicleManager',
								anchor : '98%',								
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '司机',
								xtype : 'textfield',
								name : 'driver',
								anchor : '98%',
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '电话',
								xtype : 'textfield',
								name : 'tel',
								anchor : '98%',
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '车牌号',
								xtype : 'textfield',
								name : 'plateNumber',
								anchor : '98%',
								allowBlank : false,
								selectOnFocus : true							
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '车型',
								xtype : 'textfield',
								name : 'truckModel',
								anchor : '98%',
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '载重吨位',
								xtype : 'numberfield',
								name : 'DWT',
								anchor : '98%',
								allowBlank : false,
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '适载货物',
								xtype : 'textfield',
								name : 'truckCargoType',
								anchor : '98%',
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '购车时间',
								xtype : 'datefield',
								name : 'buyingTime',
								format : 'Y-m-d',
								editable : false,
								anchor : '98%',
								selectOnFocus : true
							}]
				}, 
				 {
					columnWidth : 1,
					labelWidth : 60,
					items : [{
						fieldLabel : '类别',
						width : 60,
						xtype : 'combo',
						hiddenName : 'truckType',
						submitValue : false,
						anchor : '98%',
						editable : false,
						autoLoad : true,						
						triggerAction : 'all',
						mode : 'local',
						store : Ext.getCmp('truckTypeSelect').getStore(),									
						valueField : 'truckTypeName',
						displayField : 'truckTypeName',
						listeners : {
							'select' : function(combo, record) {
							//	this.getForm().findField('linesName').setValue(record.data.id);
							},
							scope : this
						}
					}]	
				},				
				{
					columnWidth : 1,
					items : [{								
								fieldLabel : '配合级别',
								width : 60,
								xtype : 'combo',
								hiddenName : 'gradeID',
								submitValue : false,
								anchor : '98%',
								editable : false,
								autoLoad : true,
								readOnly:true, 
								hidden:true,
								triggerAction : 'all',
								mode : 'local',
								store : Ext.getCmp('gradeSelect').getStore(),  									
								valueField : 'grade',
								displayField : 'grade',
								listeners : {
									'select' : function(combo, record) {
									//	this.getForm().findField('linesName').setValue(record.data.id);
									},
									scope : this
								}								
								
								
								
							}]
				},  {
					columnWidth : 1,
					items : [this.empSelector]
				}, 
				 {
						columnWidth : 1,
						labelWidth : 60,
						items : [{
									xtype : 'combo',
									fieldLabel : '车辆状况',
									hiddenName : 'vehicleCondition',
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
								}]
					}				
				];

		Ext.truck.form.superclass.constructor.call(this, {
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

Ext.truck.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.truck.form(this);
				Ext.truck.win.superclass.constructor.call(this, {
							width : 300,
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
					Ext.eu.ajax(path + '/logistics/saveTruck.do', {
								truck : Ext.encode(user)
							}, function(resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getStore().reload();
									this.close();
								} else {
									Ext.ux.Toast.msg('提示', '车牌号已经存在！！！');
									btn.setDisabled(false);
								}
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});

Ext.truck.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/logistics/queryTruck.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',							
							fields : ['id', 'vehicleManager', 'driver', 'tel',
									'plateNumber', 'truckModel', 'DWT', 'truckCargoType',
									'buyingTime','truckType','gradeID','dispatchers',
									'vehicleCondition','dispatchersName'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								dispatchers:isAdmin == 1 ? '' : loginEmpID,
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
							singleSelect : false
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
										header : '调度员编号',
										dataIndex : 'dispatchers',
										hidden : true
									}, {
										header : '车管理员',
										dataIndex : 'vehicleManager'										
									}, {
										header : '司机',
										dataIndex : 'driver'
									}, {
										header : '电话',
										dataIndex : 'tel'
									}, {
										header : '车牌号',
										dataIndex : 'plateNumber',
										renderer:function(value,cellmeta,record,rowIndex,columnIndex,stroe){											 
										
											if(record.data['truckType']=='自有'){
												return "<span style='color:red;font-weight:bold;'>"+value+"</span>";
											}else{
												return value;
											}											 
									   }	
									}, {
										header : '车型',
										dataIndex : 'truckModel'
									}, {
										header : '吨位',
										dataIndex : 'DWT'
									}, {
										header : '适载货物',
										dataIndex : 'truckCargoType'
									}, {
										header : '购车时间',
										dataIndex : 'buyingTime'
									}, {
										header : '类别',
										dataIndex : 'truckType'
									}, {
										header : '配合级别',
										dataIndex : 'gradeID'
									}, {
										header : '调度员',
										dataIndex : 'dispatchersName'
									}, {
										header : '车辆状态',
										dataIndex : 'vehicleCondition'
									}									
									
									]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							id:'buttonAddTruckView',
							xtype : 'button',
							iconCls : 'add',
							text : '新增',
							handler : this.onAdd,
							scope : this
						}, {
							id:'buttonModifyTruckView',
							xtype : 'button',
							iconCls : 'modify',
							text : '修改',
							handler : this.onModify,
							scope : this
						}, {
							id:'buttonDelTruckView',
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
				Ext.truck.grid.superclass.constructor.call(this, {
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
				var win = new Ext.truck.win(this);
				var form = win.form.getForm();		
				if(isAdmin == 0 ){
					form.findField('dispatchersName').readOnly=true;					
					form.findField('dispatchersName').setValue(loginName);
					form.findField('dispatchers').setValue(loginEmpID);	
					
				}		
				form.findField('gradeID').setValue('C');
				win.setTitle('添加车辆', 'add');
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
				var win = new Ext.truck.win(this);
				var form = win.form.getForm();
				win.setTitle('修改车辆信息', 'modify');				
				form.findField('id').setValue(select.id);
				form.findField('vehicleManager').setValue(select.vehicleManager);
				form.findField('driver').setValue(select.driver);
				form.findField('tel').setValue(select.tel);
				form.findField('plateNumber').setValue(select.plateNumber);
				form.findField('truckModel').setValue(select.truckModel);				
				form.findField('DWT').setValue(select.DWT);
				form.findField('truckCargoType').setValue(select.truckCargoType);
				form.findField('buyingTime').setValue(select.buyingTime);
	
				form.findField('truckType').setValue(select.truckType);
				form.findField('gradeID').setValue(select.gradeID);
				//调度员
				form.findField('dispatchersName').setValue(select.dispatchersName);
				form.findField('dispatchers').setValue(select.dispatchers);
				form.findField('vehicleCondition').setValue(select.vehicleCondition);
				if(isAdmin == 0 ){
					form.findField('dispatchersName').readOnly=true;
				}					
				
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
								Ext.eu.ajax(path + '/logistics/deleteTruck.do', {
											trucks : Ext.encode(ary)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			}
		});

Ext.truck.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				 this.dispatchersDS = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
							url : path + '/system/getAllEmployee.do',
							method : 'POST'
						}),
				reader : new Ext.data.JsonReader({}, 
						[{name : 'id'}, {name : 'name'}])
			});	
				 this.dispatchersDS.load();		
				 
				 
				 this.truckTypeDS = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
							url : path + '/logistics/getAllTruckType.do',
							method : 'POST'
						}),
				reader : new Ext.data.JsonReader({}, 
						[{name : 'id'}, {name : 'truckTypeName'}])
			});	
				 this.truckTypeDS.load();		
				 
				 this.gradeDS = new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
							url : path + '/logistics/getAllGrade.do',
							method : 'POST'
						}),
				reader : new Ext.data.JsonReader({}, 
						[{name : 'id'}, {name : 'grade'}])
			});	
				 this.gradeDS.load();					 
				 
				 
			
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '车管理员',
								id : 'vehicleManager',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '司机',
								id : 'driver',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '电话',
								id : 'tel',
								anchor : '90%'
							}]
				},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '车牌号',
										id : 'plateNumber',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '车型',
										id : 'truckModel',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
										xtype : 'textfield',
										fieldLabel : '适载货物',
										id : 'truckCargoType',
										anchor : '90%'
									}]
						},{
							width : 180,
							items : [{
								id:'truckTypeSelect',
								fieldLabel : '类别',
								width : 60,
								xtype : 'combo',
								hiddenName : 'truckType',
								submitValue : false,
								anchor : '90%',
								editable : true,
								autoLoad : true,
								triggerAction : 'all',
								mode : 'local',
								store : this.truckTypeDS,									
								valueField : 'truckTypeName',
								displayField : 'truckTypeName',
								listeners : {
									'select' : function(combo, record) {
									//	this.getForm().findField('linesName').setValue(record.data.id);
									},
									scope : this
								}
							}]							
							
						}, {
							width : 180,
							items : [{
								id:'gradeSelect',
								fieldLabel : '配合级别',
								width : 60,
								xtype : 'combo',
								hiddenName : 'gradeID',
								submitValue : false,
								anchor : '90%',
								editable : true,
								autoLoad : true,
								triggerAction : 'all',
								mode : 'local',
								store : this.gradeDS,									
								valueField : 'grade',
								displayField : 'grade'
							}]							
							
						},  {
							width : 180,
							items : [{
										xtype : 'combo',
										width : 60,
										fieldLabel : '车辆状态',
										hiddenName : 'vehicleCondition',									
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
						},
						{						
								width : 180,
								items : [{
									fieldLabel : '调度员',
									width : 180,
									xtype : 'combo',
									hiddenName : 'dispatchersName',
									submitValue : false,
									anchor : '90%',
									editable : true,
									autoLoad : true,
									triggerAction : 'all',
									mode : 'local',
									store : this.dispatchersDS,									
									valueField : 'name',
									displayField : 'name',
									listeners : {
										'select' : function(combo, record) {
										//	this.getForm().findField('linesName').setValue(record.data.id);
										},
										scope : this
									}
								}]						
							
						},
						{
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
				// panel定义
				Ext.truck.queryPanel.superclass.constructor.call(this, {
							id : 'truckQueryPanel',
							region : 'north',
							height : 70,
							frame : true,
							split : true,
							collapseMode : 'mini',
							layout : 'column',
							labelAlign : 'right',
							defaults : {
								layout : 'form',
								labelWidth : 60
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
var truckView = function(params) {
	this.queryPanel = new Ext.truck.queryPanel(this);
	this.grid = new Ext.truck.grid(this);

	Ext.getCmp('buttonAddTruckView').hidden=!params[0].isAdd;
	Ext.getCmp('buttonModifyTruckView').hidden=!params[0].isModify;
	Ext.getCmp('buttonDelTruckView').hidden=!params[0].isDel;	
	
	return new Ext.Panel({
				id : 'truckView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '车辆档案',
				layout : 'border',
				items : [this.queryPanel, this.grid]
			})
}
