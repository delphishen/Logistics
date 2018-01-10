Ext.namespace("Ext.dispatchListAmendedPetition");



//点击了选择框  onChecked : function(tr) {
function clickCheck(checkbox) {
	//clickAgain	
	var logType='';	
		
	if (document.getElementById(checkbox.id).value == '删除申请') {
		document.getElementById(checkbox.id).value = '撤销删除申请';
		logType = 'del';
	}else{
		document.getElementById(checkbox.id).value = '删除申请';
		logType = 'modify';
		
	}
	
	
	
	 var gridStore = Ext.getCmp('dispatchListAmendedPetitionGrid').getStore();													
     for (var j = 0; j < gridStore.getCount(); j++) {          	
         var recored = gridStore.getAt(j);       
          if (recored.data.dispatchListID == checkbox.id.substring(0,32)) {
        	  recored.data.logType=logType;
         }
     }	

}


Ext.dispatchListAmendedPetition.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		this.items = [ {
			columnWidth : 1,
			items : [{
				fieldLabel : '审批记录',
				xtype : 'textarea',
				height : 430,
				id : 'workflow',
				anchor : '100%',
				readOnly : true,
				style : 'background:#E6E6E6'
			} ]
		} ];

		Ext.dispatchListAmendedPetition.form.superclass.constructor.call(this, {
			region : 'east',
			height : 75,
			width : 200,
			labelWidth : 10,
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



Ext.dispatchListAmendedPetition.grid = Ext.extend(Ext.grid.EditorGridPanel, {
	id : 'dispatchListAmendedPetitionGrid',
	clicksToEdit : 1,
	constructor : function(app) {
		this.app = app;
		// 数据源
		this.ds = new Ext.data.JsonStore({
			url : path + '/logistics/queryDispatchListLog.do',
			idProperty : 'id',
			root : 'rows',
			totalProperty : 'results',
			fields : [ 'id', 'dispatchListID', 'logType','plateNumber', 'payFreight', 'totalLoading', 'loadingDate',
				'totalUnloading', 'unloadingDate', 'payFreightNew', 'totalLoadingNew', 'loadingDateNew',
				'totalUnloadingNew', 'unloadingDateNew', 'remark', 'status','dispatchersID'
			],
			autoDestroy : true,
			autoLoad : true,
			baseParams : {
				status: "2,1",
				dispatchersID:isAdmin == 1 ? '' : loginEmpID,
				start : 0,
				limit : 40
			},
			listeners : {
				'load' : function(store, records, successful, opts)  {					
					var recordNews = this.app.app.recordNews;					
					for (var i = 0; i < recordNews.length; i++) {
						var isExist=0;

					            for (var j = 0; j < store.getCount(); j++) {          	
						                var recored = store.getAt(j);                
						                 if (recored.data.dispatchListID == recordNews[i].get("dispatchListID")) {
						                	 isExist=1;
						                }
					            }	
					            					            
					            if(isExist==0){									
									this.getStore().add(recordNews[i]);
					            }						            
					            
					
					}
	
				},
				scope : this
			}
		});
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect : true,
			listeners : {
				'rowselect' : function(sm, index, record) {
				//	alert(record.get('id'));
						Ext.eu.ajax(
								path+ '/logistics/queryDispatchListLogWorkflow.do',
								{
									dispatchListLogID : record.get('id')
								}, function(resp) {
									var arr = Ext.decode(resp.responseText);
									var workflowMess='';	
									var status='';
								//	alert(resp.responseText);									
									for (var i = 0; i < arr.length; i++) {
										
										switch(arr[i].status) { 
										case '1': 
											status='提交';
										break; 
										case '2': 
											 if(arr[i].logType=='del')	status='删除驳回';
											 if(arr[i].logType=='modify')	status='修改驳回';											
										break; 
										case '3': 
											 if(arr[i].logType=='del')	status='删除通过';
											 if(arr[i].logType=='modify')	status='修改通过';
											
										break; 
										case '4':
											status='取消审批申请';
										break;	
										} 
										
										workflowMess = workflowMess+status+':';
										workflowMess = workflowMess+arr[i].moTime+'\n';
										workflowMess = workflowMess+arr[i].remark+'\n';
									}
									this.app.form.getForm().findField('workflow').setValue(workflowMess);								
								}, this);					
					
				},
				'rowdeselect' : function(sm, index, record) {
					//							var win = this.app;
					//							win.empId.splice(jQuery.inArray(record.get('id'),
					//											win.empId), 1);
					//							win.empName.splice(jQuery.inArray(record
					//													.get('name'), win.empName),
					//									1);
					//							win.form.getForm().findField('workflow')
					//									.setValue(win.empName.toString());
				},
				//					    'cellClick' : function(thisTab, td, cellIndex,record,tr,rowIndex,event,eventObj) {
				//					    	alert('s');	
				//					    	if(cellIndex==14){//设置按钮列
				//					    			alert('用户编号='+this.getStore().getAt(rowIndex).data.usercode);
				//					             
				//					        	}
				//					    	}
				//						,
				scope : this
			}
		});
		// 列
		this.cm = new Ext.grid.ColumnModel({
			defaults : {
				width : 150,
				sortable : true
			},
			columns : [ new Ext.grid.RowNumberer(), this.sm, {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : 'dispatchListID',
				dataIndex : 'dispatchListID',
				hidden : true
			}, {
				header : 'dispatchersID',
				dataIndex : 'dispatchersID',
				hidden : true
			},			
			{
				header : 'logType',
				dataIndex : 'logType',
				hidden : true
			},
				{
					header : '车牌号',
					width : 130,
					dataIndex : 'plateNumber',
					css : 'background: #bde0e8;'
				}, {
					header : '付运费',
					width : 90,
					dataIndex : 'payFreight',
					css : 'background: #bde0e8;'
				}, {
					header : '装货量',
					width : 90,
					dataIndex : 'totalLoading',
					css : 'background: #bde0e8;'
				}, {
					header : '装货时间',
					width : 140,
					dataIndex : 'loadingDate',
					css : 'background: #bde0e8;'
				}, {
					header : '卸货量',
					width : 90,
					dataIndex : 'totalUnloading',
					css : 'background: #bde0e8;'
				}, {
					header : '卸货时间',
					width : 140,
					dataIndex : 'unloadingDate',
					css : 'background: #bde0e8;'
				}, {
					header : '新付运费',
					width : 110,
					dataIndex : 'payFreightNew',
					editor : {
						xtype : 'numberfield',
						decimalPrecision : 4,
						selectOnFocus : true
					}
				}, {
					header : '新装货量',
					width : 110,
					dataIndex : 'totalLoadingNew',
					editor : {
						xtype : 'numberfield',
						decimalPrecision : 4,
						selectOnFocus : true
					}
				}, {
					header : '新装货时间',
					width : 140,
					dataIndex : 'loadingDateNew',
					renderer : Ext.util.Format.dateRenderer('Y-m-d'),
					editor : {
						xtype : 'datefield',
						format : 'Y-m-d',
						selectOnFocus : true
					}
				}, {
					header : '新卸货量',
					width : 110,
					dataIndex : 'totalUnloadingNew',
					editor : {
						xtype : 'numberfield',
						decimalPrecision : 4,
						selectOnFocus : true
					}
				}, {
					header : '新卸货时间',
					width : 140,
					dataIndex : 'unloadingDateNew',
					renderer : Ext.util.Format.dateRenderer('Y-m-d'),
					editor : {
						xtype : 'datefield',
						format : 'Y-m-d',
						selectOnFocus : true
					}
				}, {
					header : '修改说明',
					width : 200,
					dataIndex : 'remark',
					editor : {
						xtype : 'textfield',
						selectOnFocus : true
					}
				}, {
					header : '操作和状态',
					width : 150,
					dataIndex : 'amendedPetition',
					width : 230,
					renderer : function(value, cellmeta, record) {
					
					//	alert(isAdmin);
					//	alert(record.data.status);
						var returnStr;
						//if(isAdmin==0){						
							if (record.data.status == 1 && record.data.logType=='del') {
								returnStr = "等待删除审核";
							}
							if (record.data.status == 1 && record.data.logType=='modify') {
								returnStr = "等待修改审核";
							}

							if (record.data.status == 3 && record.data.logType=='del') {
								returnStr = "删除审核通过";
							}
							if (record.data.status == 3 && record.data.logType=='modify') {
								returnStr = "修改审核通过";
							}							
							
//							if (record.data.status == 2 && record.data.logType=='del') {
//								returnStr = "<INPUT id=" + record.data.id +
//								"_button type='button' onclick='clickCheck(this)' value='删除驳回,重提交'>";
//							}	
//							if (record.data.status == 2 && record.data.logType=='modify') {
//								returnStr = "<INPUT id=" + record.data.id +
//								"_button type='button' onclick='clickCheck(this)' value='修改驳回,重提交'>";								
//							}	
							//这里id用record.data.dispatchListID 只是为定位按钮用。新添加的数据申请record.data.id 是空的
							if (record.data.status == 0 ||record.data.status == 2 ) {
								returnStr = "<INPUT id=" + record.data.dispatchListID +
									"_button type='button' onclick='clickCheck(this)' value='删除申请'>";
								record.data.logType='modify';
							}	
							return returnStr;
						//}

						
					}
				}
				,
				{
					xtype : 'actioncolumn',
					header : '取消',
					width : 140,
					tdCls : 'tick',
					items : [ {
						icon : 'images/icons/cancel.png',
						tooltip : '删除该条记录,不参与修改申请！',
						handler : function(grid, rowIndex, colIndex, node, e, record, rowEl) {
							var recorded = grid.getStore().getAt(rowIndex);
							
							//alert(recorded.data.id);

					
							
							
							Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
								if (btn == 'yes') {		

									if(recorded.data.id==''){
										//新添加的数据，直接删除
										grid.getStore().remove(recorded);
									}else{
										
										var dispatchListLogs = new Array();
										var dispatchListLog = {
												id:recorded.data.id,
												dispatchListID : recorded.data.dispatchListID,		
												payFreightNew : recorded.data.payFreightNew,
												totalLoadingNew : recorded.data.totalLoadingNew,
												loadingDateNew : recorded.data.loadingDateNew,
												totalUnloadingNew : recorded.data.totalUnloadingNew,
												unloadingDateNew : recorded.data.unloadingDateNew,
												remark : recorded.data.remark,
												logType:'del',
												dispatchersID:loginEmpID,													
												status:'4'										
											};				
					
											dispatchListLogs.push(dispatchListLog);												
										
										
										Ext.eu.ajax(path + '/logistics/saveDispatchListLog.do', {
											dispatchListLogs : Ext.encode(dispatchListLogs)
											}, function(resp) {
												Ext.ux.Toast.msg('信息', '删除成功');
												// 清空变更记录
												Ext.getCmp('dispatchListAmendedPetitionGrid').getStore().reload();
												
											}, this);											
									}	
									
								}
							}, this);							
							

						},
						getClass : function(v, metadata, r, rowIndex, colIndex, store) {
							// this.items[1].tooltip = 'Hold stock'; 
							//	alert(r.data.status);
							if (r.data.status == 1 ) {
								return 'x-hidden';
							}

						}
					} ]
				}

			]
		});
		// 菜单条
		//this.tbar = new Ext.Toolbar();
		// 页码条
		this.bbar = new Ext.PagingToolbar({
			pageSize : 40,
			displayInfo : true,
			store : this.ds
		});
		// 构造
		Ext.dispatchListAmendedPetition.grid.superclass.constructor.call(this, {
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

Ext.dispatchListAmendedPetition.win = Ext.extend(Ext.Window, {
	constructor : function(app) {
		this.app = app;
		this.empId = new Array();
		this.empName = new Array();
		this.form = new Ext.dispatchListAmendedPetition.form(this);
		this.grid = new Ext.dispatchListAmendedPetition.grid(this);
		Ext.dispatchListAmendedPetition.win.superclass.constructor.call(this, {
			title : '数据修改申请',
			width : 1200,
			height : 500,
			plain : true,
			showLock : true,
			modal : false,
			resizable : false,
			buttonAlign : 'center',
			layout : 'border',
			items : [this.grid, this.form ],
			buttons : [ {
				text : '确定提交',
				iconCls : 'tick',
				handler : this.onSave,
				scope : this
			}, {
				text : '取消',
				iconCls : 'cancel',
				handler : this.onClose,
				scope : this
			} ]
		});
	},
	onSave : function(btn) {
		//	alert(this.app.recordNews.length);	
		//this.app.callback.call(this.app.scope, this.empId.toString(),
		//		this.empName.toString());				
		//	btn.setDisabled(true);
		var records = this.grid.getStore().getRange();
		var dispatchListLogs = new Array();
		for (var i = 0; i < records.length; i++) {
			var plateNumber = records[i].data.plateNumber;
			var status = records[i].data.status;
			
			//alert(records[i].data.logType);
			
			//判断修改申请的数据是否有改动数据，没有改动不能提交申请
			if(records[i].data.logType=='modify' && 
				records[i].data.payFreight==records[i].data.payFreightNew &&
				records[i].data.totalLoading==records[i].data.totalLoadingNew &&
				records[i].data.loadingDate==records[i].data.loadingDateNew &&
				records[i].data.totalUnloading==records[i].data.totalUnloadingNew &&
				records[i].data.unloadingDate==records[i].data.unloadingDateNew	
			){
				alert(plateNumber+' 数据没修改过，请重新修改后提交！')
				return;
			}

			if (plateNumber !== '' && (status == 0 ||status == 2)) {
				var dispatchListLog = {
					id:records[i].data.id,
					dispatchListID : records[i].data.dispatchListID,
					plateNumber : plateNumber,
					payFreight : records[i].data.payFreight,
					totalLoading : records[i].data.totalLoading,
					loadingDate : records[i].data.loadingDate,
					totalUnloading : records[i].data.totalUnloading,
					unloadingDate : records[i].data.unloadingDate,
					payFreightNew : records[i].data.payFreightNew,
					totalLoadingNew : records[i].data.totalLoadingNew,
					loadingDateNew : records[i].data.loadingDateNew,
					totalUnloadingNew : records[i].data.totalUnloadingNew,
					unloadingDateNew : records[i].data.unloadingDateNew,
					remark : records[i].data.remark,
					logType:records[i].data.logType,
					dispatchersID:loginEmpID,
					//status:records[i].data.status
					status:'1'
						
				};				
				//alert(records[i].data.logType);				
				dispatchListLogs.push(dispatchListLog);
			}
		}
	//	alert(Ext.encode(dispatchListLogs));
		//alert(dispatchListLogs.length);
		if (dispatchListLogs.length == 0) {
			Ext.ux.Toast.msg('信息', '没发现需要提交修改申请的数据！');
		} else {
							Ext.eu.ajax(path + '/logistics/saveDispatchListLog.do', {
									dispatchListLogs : Ext.encode(dispatchListLogs)
									}, function(resp) {
										Ext.ux.Toast.msg('信息', '提交成功');
										// 清空变更记录
										this.grid.getStore().reload();
										btn.setDisabled(false);
									}, this);	
		}
			



	//	this.close();
	},
	onReset : function(btn) {
		this.form.getForm().reset();
		this.empId = [];
		this.empName = [];
	},
	onClose : function() {
		this.close();
	}
});



var dispatchListAmendedPetition = function(callback, recordNews, scope) {
	this.callback = callback;
	this.recordNews = recordNews;
	this.scope = scope;
	var win = new Ext.dispatchListAmendedPetition.win(this);
	win.show();
}