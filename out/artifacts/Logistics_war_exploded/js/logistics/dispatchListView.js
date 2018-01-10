Ext.namespace('Ext.dispatchList');



Ext.dispatchList.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		
		this.empSelector = new Ext.form.TriggerField({
			fieldLabel : '调度员',
			name : 'dispatchersName',
			anchor : '98%',
			triggerClass : 'x-form-search-trigger',
			selectOnFocus : true,
			submitValue : false,
			editable : false,
			readOnly:true,
			hidden:true,
			onTriggerClick : function(e) {
				new empSelector(function(id, name) {
					this.setValue(name);
					Ext.getCmp('dispatchersID').setValue(id);		
							
						}, true, this);
			},
			scope : this
		});

		this.items = [{
					xtype : 'hidden',
					id : 'id'
				},{
					xtype : 'hidden',
					id : 'taskID'
				}, {
					xtype : 'hidden',
					id : 'dispatchID'
				},				
				{					
					xtype : 'hidden',
					id : 'dispatchersID'
				},		
				{
					columnWidth : .5,					
					items : [{
								fieldLabel : '车牌号',
								xtype : 'textfield',
								name : 'plateNumber',
								anchor : '98%',	
								readOnly:true,
								selectOnFocus : true
							},{
								fieldLabel : '运输线路',
								xtype : 'textfield',
								name : 'dispatchLines',
								anchor : '98%',			
								readOnly:true,
								selectOnFocus : true
							},{
								fieldLabel : '装货量吨',
								xtype : 'numberfield',
								id:'tLoading',
								name : 'totalLoading',
								decimalPrecision:3,
								anchor : '98%',
								selectOnFocus : true,
								listeners : {
											change: function(field,newValue,oldValue) {
											//		alert((new Date()).format('Y-m-d'));
											//	alert(newValue+'---'+oldValue);
												Ext.getCmp("lDate").setValue(new Date());
												var diff;
												diff=(newValue-Ext.getCmp("tUNloading").getValue())/1000;
												Ext.getCmp("diff").setValue(diff);
												}
											}
						    },{
								fieldLabel : '装货时间',
								xtype : 'datefield',
								id:'lDate',
								name : 'loadingDate',
								format : 'Y-m-d',
								editable : true,
								allowBlank : true,
								anchor : '98%',
								selectOnFocus : true
						   },{
								xtype : 'combo',
								fieldLabel : '付款方式',
								hiddenName : 'paymentMethod',
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
						   },{
								xtype : 'combo',
								fieldLabel : '是否含税',
								hiddenName : 'taxYN',
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
							  }
							]
				},			
				{
					columnWidth : .5,					
					items : [{
								fieldLabel : '派车时间',
								xtype : 'datefield',
								name : 'sendCarDate',
								format : 'Y-m-d',
								editable : true,
								anchor : '98%',
								selectOnFocus : true
							},{
								fieldLabel : '付运费',
								xtype : 'numberfield',
								name : 'payFreight',
								anchor : '98%',
								selectOnFocus : true
							},{
								fieldLabel : '卸货量吨',
								xtype : 'numberfield',
								id:'tUNloading',
								name : 'totalUnloading',
								anchor : '98%',
								decimalPrecision:3,
								selectOnFocus : true,
								listeners : {
									change: function(field,newValue,oldValue) {
									//		alert((new Date()).format('Y-m-d'));
										Ext.getCmp("uDate").setValue(new Date());
										var diff;
										diff=(Ext.getCmp("tLoading").getValue()-newValue)/1000;
										Ext.getCmp("diff").setValue(diff);		
										
										}
									}
						   },{
								fieldLabel : '卸货时间',
								xtype : 'datefield',
								id:'uDate',
								name : 'unloadingDate',
								format : 'Y-m-d',
								editable : true,
								allowBlank : true,
								anchor : '98%',
								selectOnFocus : true
						  },{
								fieldLabel : '磅差',
								xtype : 'numberfield',
								id:'diff',
								name : 'difference',
								anchor : '98%',
								decimalPrecision:5,
							//	format : '0.0000',
								selectOnFocus : true
						 },{
								xtype : 'combo',
								fieldLabel : '过磅单实收',
								hiddenName : 'netReceiptsYN',
								anchor : '98%',
								typeAhead : true,
								editable : false,
								triggerAction : 'all',
								lazyRender : true,
								mode : 'local',
								value:'',
								store : new Ext.data.ArrayStore({
											fields : ['key', 'val'],
											data : [['是','1'],
													['否', '0']]
										}),
								valueField : 'val',
								displayField : 'key'
						}
						,this.empSelector							
						]
				}];

		Ext.dispatchList.form.superclass.constructor.call(this, {
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

Ext.dispatchList.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.dispatchList.form(this);
				Ext.dispatchList.win.superclass.constructor.call(this, {
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
					var user = form.getValues();
						user.isAdmin = user.isAdmin == 1 ? 1 : 0;
					Ext.eu.ajax(path + '/logistics/saveDispatchList.do', {
						       dispatchList : Ext.encode(user)
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

Ext.dispatchList.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				
				this.recordNew = new Ext.data.Record.create([{
					id:'',
					plateNumber : '',
					payFreight:'',
					totalLoading:'',
					loadingDate:'',
					totalUnloading:'',
					unloadingDate:'',
					payFreightNew:'',
					totalLoadingNew:'',
					loadingDateNew:'',
					totalUnloadingNew:'',
					unloadingDateNew:'',
					remark : ''
				
				}]);				
				this.treeTaskID = null;
				this.app = app;
				// 数据源  
				this.ds = new Ext.data.JsonStore({
							url : path + '/logistics/queryDispatchList.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'taskID', 'dispatchID', 'plateNumber','dispatchLines','sendCarDate',
									'payFreight', 'picture', 'totalLoading', 'loadingDate','totalUnloading','unloadingDate',
									'difference','dispatchersID','dispatchersName','paymentMethod','taxYN','netReceiptsYN',
									'truckType','moTime','modifyYN','delYN','warnYN'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								isPaging : true,
								start : 0,
								limit : 80
							},
							listeners : {
								'beforeload' : function() {
									
									Ext.apply(this.getStore().baseParams, {'taskID' : this.treeTaskID});
									Ext.apply(this.getStore().baseParams, {'dispatchersID' : isAdmin == 1 ? '' : loginEmpID});									
									Ext.apply(this.getStore().baseParams,this.app.queryPanel.getQueryParams());
								},
								scope : this
							}
						});
				// 选择框
				this.sm = new Ext.grid.CheckboxSelectionModel({
							singleSelect : false,
							listeners : {
								rowdeselect : function(model, index, record) {
									
									var selects = Ext.eu.getSelects(this);
									if (selects.length == 0) {
										Ext.getCmp('buttonModifyDispatchListView').disable();
										Ext.getCmp('buttonDelDispatchListView').disable();
									} else if (selects.length == 1) {
										Ext.getCmp('buttonModifyDispatchListView').enable();
										Ext.getCmp('buttonDelDispatchListView').enable();
									} else {
										Ext.getCmp('buttonDelDispatchListView').enable();
									}
									
									if(Ext.getCmp('dispatchListAmendedPetitionGrid')!=undefined){
										 var dispatchListAmendedPetitionGridStore = Ext.getCmp('dispatchListAmendedPetitionGrid').getStore();													
								            for (var j = 0; j < dispatchListAmendedPetitionGridStore.getCount(); j++) {          	
								                var recorded = dispatchListAmendedPetitionGridStore.getAt(j);                
								                 if (recorded.data.dispatchListID == record.data.id && recorded.data.status==0 ) {
								                	 Ext.getCmp('dispatchListAmendedPetitionGrid').getStore().remove(recorded);
								                }
								            }										
										
									}	
									
									
									

								},
								rowselect : function(model, index, record) {
									var selects = Ext.eu.getSelects(this);
									if (selects.length == 1) {
										Ext.getCmp('buttonModifyDispatchListView').enable();
										Ext.getCmp('buttonDelDispatchListView').enable();
									} else if (selects.length > 1) {
										Ext.getCmp('buttonModifyDispatchListView').disable();
										Ext.getCmp('buttonDelDispatchListView').enable();
									}
									
									if(Ext.getCmp('dispatchListAmendedPetitionGrid')!=undefined){
										var isExist=0;
										
										 var dispatchListAmendedPetitionGridStore = Ext.getCmp('dispatchListAmendedPetitionGrid').getStore();													
								            for (var j = 0; j < dispatchListAmendedPetitionGridStore.getCount(); j++) {          	
								                var recored = dispatchListAmendedPetitionGridStore.getAt(j);       
								            //    alert(recored.data.dispatchListID);
								                 if (recored.data.dispatchListID == record.data.id) {
								                	 isExist=1;
								                }
								            }	
								            
								            if(isExist==0){
												var recordNew = new this.recordNew({
													id:'',
													dispatchListID:record.data.id,
													plateNumber : record.data.plateNumber,
													payFreight:record.data.payFreight,
													totalLoading:record.data.totalLoading,
													loadingDate:record.data.loadingDate,
													totalUnloading:record.data.totalUnloading,
													unloadingDate:record.data.unloadingDate,
													
													payFreightNew:record.data.payFreight,
													totalLoadingNew:record.data.totalLoading,
													loadingDateNew:record.data.loadingDate,
													totalUnloadingNew:record.data.totalUnloading,
													unloadingDateNew:record.data.unloadingDate,
													remark : '',
													status:'0',
													dispatchersID:loginEmpID
												});														
												
												Ext.getCmp('dispatchListAmendedPetitionGrid').getStore().add(recordNew);
								            }										
									}
									
							
									

									
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
										header : 'taskID',
										dataIndex : 'taskID',
										hidden : true
									}, {
										header : 'picture',
										dataIndex : 'picture',
										hidden : true
									},  {
										header : 'dispatchersID',
										dataIndex : 'dispatchersID',
										hidden : true
									},   {
										header : 'modifyYN',
										dataIndex : 'modifyYN',
										hidden : true
									},  {
										header : 'delYN',
										dataIndex : 'delYN',
										hidden : true
									},	{
										header : 'warnYN',
										dataIndex : 'warnYN',
										hidden : true
									},									
									{
										header : '调度号',
										dataIndex : 'dispatchID',
										hidden : true
									}, 
									{
										header : '车牌号',
										dataIndex : 'plateNumber',
										renderer:function(value,cellmeta,record,rowIndex,columnIndex,stroe){											 
											if(record.data['truckType']=='自有'){
												return "<span style='color:red;font-weight:bold;'>"+value+"</span>";
											}else{
												return value;
											}											 
									   }
									}, 	
									{
										header : '运输线路',
										dataIndex : 'dispatchLines'
									}, 	
									{
										header : '派车时间',
										dataIndex : 'sendCarDate'
									}, 	
									{
										header : '付运费',
										dataIndex : 'payFreight'
									}, 	
									{
										header : '装货量',
										dataIndex : 'totalLoading',
										renderer:function(value,cellmeta,record,rowIndex,columnIndex,stroe){											 
										
											if(record.data['warnYN']==1){
												cellmeta.css='x-grid-back-red'; 
											}
												return value;
																					 
									   }										
									}, 	
									{
										header : '装货时间',
										dataIndex : 'loadingDate'
									}, 	
									{
										header : '卸货量',
										dataIndex : 'totalUnloading',
										renderer:function(value,cellmeta,record,rowIndex,columnIndex,stroe){											 
											
											if(record.data['warnYN']==1){
												cellmeta.css='x-grid-back-red'; 
											}
												return value;
																					 
									   }										
									}, 	
									{
										header : '卸货时间',
										dataIndex : 'unloadingDate'
									}, 	
									{
										header : '磅差(‰)',
										dataIndex : 'difference',
									//	xtype: 'numbercolumn',
										// format: '{difference*100}‰',
										 renderer:function(value){											 
													var aa=value*1000;
													if(value>=0.003){
														return "<span style='color:red;font-weight:bold;'>"+aa+'‰'+"</span>";
													}else if(value==0){
														return '';
													}else{
														return aa+'‰';
													}											 
											 }											 
											 
									},{
										header : '付款方式',
										dataIndex : 'paymentMethod'
									}, {
										header : '是否含税',
										dataIndex : 'taxYN',
										xtype: "booleancolumn",
										trueText: "含税",
										falseText: "不含税"
									}, {
										header : '过磅实收',
										dataIndex : 'netReceiptsYN',
										xtype: "booleancolumn",
										trueText: "是",
										falseText: "否"
									},{
										header : '车辆类型',
										dataIndex : 'truckType'
									},{
										header : '调度员',
										dataIndex : 'dispatchersName'
									},{
										header : '最后修改时间',
										dataIndex : 'moTime'
									}
									
									]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([
				        {
							xtype : 'button',
							iconCls : 'add',
							id : 'buttonAddDispatchListView',
							text : '新增',
							handler : this.onAdd,
							hidden : true,
							scope : this
						}, 
						{
							xtype : 'button',
							iconCls : 'modify',
							text : '修改',
							id : 'buttonModifyDispatchListView',
							handler : this.onModify,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'delete',
							id : 'buttonDelDispatchListView',
							text : '删除',
							handler : this.onDelete,
							scope : this
						},'|',{
							xtype : 'button',
							iconCls : 'user_edit',
							id : 'buttonAmendedPetitionDispatchListView',
							text : '修改申请',
							handler : this.onAmendedPetition,
							scope : this
						}, '->', {
							xtype : 'button',
							iconCls : 'phone',
							hidden:false,
							text : '发送短信提醒',
							handler : this.onMerge,
							scope : this
						}
						]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 80,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.dispatchList.grid.superclass.constructor.call(this, {
							region : 'center',
							loadMask : 'loading...',
							columnLines : true,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							}
						});
			},
			onAdd : function(btn) {
				this.dispatchList = new Object();
				this.dispatchList.enName = '';
				var win = new Ext.dispatchList.win(this);
				win.setTitle('添加车辆', 'add');
				var node = this.treeTaskID;
				if (node != null) {
					win.form.getForm().findField('dispatchersID').setValue(loginEmpID);
					win.form.getForm().findField('taskID').setValue(node);
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
				if (select.modifyYN == 0) {
					Ext.ux.Toast.msg("信息", "该记录已经超过修改时间，请提交修改申请！");
					return;					
				}								
				//Ext.ux.Toast.msg("信息", select.buyingTime);
				var win = new Ext.dispatchList.win(this);
				var form = win.form.getForm();
				win.setTitle('修改信息', 'modify');				
				form.findField('id').setValue(select.id);
				form.findField('taskID').setValue(select.taskID);
								
				form.findField('dispatchID').setValue(select.dispatchID);
				form.findField('plateNumber').setValue(select.plateNumber);
				form.findField('dispatchLines').setValue(select.dispatchLines);
				form.findField('sendCarDate').setValue(select.sendCarDate);
				form.findField('payFreight').setValue(select.payFreight);
				
				form.findField('totalLoading').setValue(select.totalLoading);	
				form.findField('loadingDate').setValue(select.loadingDate);
				form.findField('totalUnloading').setValue(select.totalUnloading);
				form.findField('unloadingDate').setValue(select.unloadingDate);
				form.findField('dispatchersID').setValue(select.dispatchersID);
				form.findField('dispatchersName').setValue(select.dispatchersName);				
	
				form.findField('paymentMethod').setValue(select.paymentMethod);
				form.findField('taxYN').setValue(select.taxYN);	
				form.findField('difference').setValue(select.difference);
				
				form.findField('netReceiptsYN').setValue(select.netReceiptsYN);
				win.show();

			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条记录！");
					return;
				}					
				var select = selects[0].data;				
				if (select.delYN == 0) {
					Ext.ux.Toast.msg("信息", "该记录已经超过删除时间，请提交删除申请！");
					return;					
				}					
								
				
				var delArr = Array();
				for (var i = 0; i < selects.length; i++) {
					if (selects[i].data.id != water.id) {
						var dispatchList = {
							id : selects[i].data.id,
							taskID:selects[i].data.taskID,
							plateNumber:selects[i].data.plateNumber
						}
						delArr.push(dispatchList);
					} else {
						Ext.ux.Toast.msg("信息", "所选记录存在引用，不允许删除！");
						return;
					}
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/logistics/deleteDispatchList.do', {
									dispatchLists : Ext.encode(delArr)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			},
			onAmendedPetition : function() {
				var selects = Ext.eu.getSelects(this);
//				if (selects.length == 0) {
//					Ext.ux.Toast.msg("信息", "请选择要申请修改的记录！");
//					//return;
//				}	
				var recordNews = new Array();
				
				for (var i = 0; i < selects.length; i++) {
				
			         
							var recordNew = new this.recordNew({
								id:'',
								dispatchListID:selects[i].data.id,
								plateNumber : selects[i].data.plateNumber,
								payFreight:selects[i].data.payFreight,
								totalLoading:selects[i].data.totalLoading,
								loadingDate:selects[i].data.loadingDate,
								totalUnloading:selects[i].data.totalUnloading,
								unloadingDate:selects[i].data.unloadingDate,								
								
								payFreightNew:selects[i].data.payFreight,
								totalLoadingNew:selects[i].data.totalLoading,
								loadingDateNew:selects[i].data.loadingDate,
								totalUnloadingNew:selects[i].data.totalUnloading,
								unloadingDateNew:selects[i].data.unloadingDate,
								remark : '',
								status:'0',
								dispatchersID:loginEmpID
							});													
							recordNews.push(recordNew);	
					
				}
				
				new dispatchListAmendedPetition(function(id, name) {
				//	this.setValue(name);
				//	Ext.getCmp('empId').setValue(id);
				//	if(Ext.getCmp('loginName').getValue != ''){
				//		Ext.getCmp('loginName').setValue(name);	
				//	}		
						}, recordNews, this);						
						
				
				
				
				
				
				
				
				
				
				
			},
			onMerge : function(btn) {
				Ext.Msg.show({
							buttons : Ext.Msg.CANCEL,
							icon : Ext.Msg.INFO,
							title : '信息',
							msg : '功能暂未开放！'
						});
			},			
			getChildrenIds : function(arr, node, scope) {
				if (node.hasChildNodes()) {
					node.eachChild(function(child) {
								arr.push(child.id);
								arr.concat(scope.getChildrenIds(arr, child,
										scope));
							});
				}
				return arr;
			}
		});

Ext.dispatchList.queryPanel = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		// 在column布局的制约下，从左至右每个元素依次进行form布局
		this.items = [{
					width : 180,
					hidden : true,
					items : [{
								xtype : 'textfield',
								fieldLabel : '调度单号',
								id : 'dispatchID',
								anchor : '90%'
							}]
				}, {
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '车牌号',
								name : 'plateNumber',
								anchor : '90%'
							}]
				}, {
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '线路',
								id : 'dispatchLines',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								fieldLabel : '派车时间',
								xtype : 'datefield',
								name : 'sendCarDate',
								format : 'Y-m-d',
								editable : false,
								anchor : '90%',
								selectOnFocus : true
							}]
				},
				{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '付运费',
								name : 'payFreight',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '装货量',
								id : 'totalLoading',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								fieldLabel : '装货时间',
								xtype : 'datefield',
								name : 'loadingDate',
								format : 'Y-m-d',
								editable : false,
								anchor : '90%',
								selectOnFocus : true
							}]
				},{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '卸货量',
								id : 'totalUnloading',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								fieldLabel : '卸货时间',
								xtype : 'datefield',
								name : 'unloadingDate',
								format : 'Y-m-d',
								editable : false,
								anchor : '90%',
								selectOnFocus : true
							}]
				}
				,{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '磅差',
								id : 'difference',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '调度员',
								id : 'dispatchersName',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '付款方式',
								id : 'paymentMethod',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '含税',
								id : 'taxYN',
								anchor : '90%'
							}]
				},{
					width : 180,
					items : [{
								xtype : 'textfield',
								fieldLabel : '过磅单',
								id : 'netReceiptsYN',
								anchor : '90%'
							}]
				},				
				{
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
									this.app.grid.getStore().reload();
								},
								scope : this
							}]
				}];
		// panel定义
		Ext.dispatchList.queryPanel.superclass.constructor.call(this, {
					id : 'dispatchListQueryPanel',
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
		var queryParams = this.getForm().getValues();
	//	queryParams.kqType = this.getForm().findField('kqType').getValue();
		return queryParams;
	}
});

/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var dispatchListView = function(params) {
	this.queryPanel = new Ext.dispatchList.queryPanel(this);
	this.dispatchListTree = new Ext.dispatchListTree.tree(this);
	this.grid = new Ext.dispatchList.grid(this);
	
//	alert(params[0].isAdd);
	
	Ext.getCmp('buttonAddDispatchListView').hidden=!params[0].isAdd;
	Ext.getCmp('buttonModifyDispatchListView').hidden=!params[0].isModify;
	Ext.getCmp('buttonDelDispatchListView').hidden=!params[0].isDel;
	Ext.getCmp('buttonAmendedPetitionDispatchListView').hidden=!params[0].isModify;
	
	
	return new Ext.Panel({
				id : 'dispatchListView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '车辆调度跟踪',
				layout : 'border',
				items : [this.dispatchListTree, {
							region : 'center',
							layout : 'border',
							items : [this.queryPanel, this.grid]
						}]
			})
}
