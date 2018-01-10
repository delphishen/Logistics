Ext.namespace("Ext.truckSelector");



Ext.truckSelector.grid = Ext.extend(Ext.grid.GridPanel, {
//	anchor: '100%',
	height: 400,
	width:'100%',
	region : 'east',
	id:'truckSelectorGrid',
	constructor : function(app) {
		this.app = app;		
		
		var recordPlateNumber=new Array();// 选中的Record主键列id列表  
		var recordsChecked=new Array();// 选中的Record列表  
	
		var dispatchers=isAdmin == 1 ? '' : loginEmpID;
	  // alert('dispatchers='+dispatchers);
		// 数据源
		this.ds = new Ext.data.JsonStore({
					url : path + '/logistics/queryTruck.do',
					idProperty : 'id',
					root : 'rows',
					totalProperty : 'results',
					fields : ['id','vehicleManager','driver','tel','plateNumber', 'DWT', 'truckType','dispatchersName'],
					autoDestroy : true,
					autoLoad : false,  //此处设置为false 否则会导致首次打开窗口在参数还没传入时候会自动执行
					baseParams : {
						isPaging : true,
						dispatchers:dispatchers,
						vehicleCondition:'正常',
						start : 0,
						limit : 40
					},
					listeners : {
						'beforeload' : function() {
							var par = {
									'vehicleManager' : Ext.getCmp('vehicleManager').getValue(),
									'driver' : Ext.getCmp('driver').getValue(),	
									'tel' : Ext.getCmp('tel').getValue(),
								    'plateNumber' : Ext.getCmp('plateNumber').getValue(),
								    'truckType' : Ext.getCmp('truckType').getValue()
							};						
							Ext.apply(this.getStore().baseParams, par);								
						},
						//datachanged:clearAllSelectedcheckBox,
						load : function(store, records, successful, opts) {
							
							//alert(store.getCount());
						//	Ext.getCmp('selectorPlateNumber').setValue(Ext.encode(dispatchListSelectPlateNumber));
						//	this.onUnChecked();
							
//							this.ds.each(function(record) {								
//								alert(record.get("plateNumber"));								
//							});
							
						//	alert(Ext.encode(dispatchListSelectPlateNumber));
							if(dispatchListSelectPlateNumber!=[])
							this.onChecked(dispatchListSelectPlateNumber);
//							Ext.eu.ajax(
//											path+ '/logistics/queryDispatchListCalendar.do',
//											{
//												taskID : gridSelectTaskID,
//												sendCarDate:selectDate
//											}, function(resp) {
//												var arr = Ext.decode(resp.responseText);
//											//	dispatchListSelectPlateNumber=arr.rows;												
//											//	alert(Ext.encode(arr.rows));
//												this.onChecked(arr.rows);	
//											//	arrayPlateNumber = arr.rows.plateNumber;
//												//每次加载数据，保存数据库传过来的已选车牌到数组， 前端新增的车牌保存到新车牌数组
//												//这样翻页时候就能显示已经选择的车牌
//												
//											}, this);							
								
						},
						scope : this
					}
				});
				
		
		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
			     //singleSelect : this.app.app.isSingle,
			        singleSelect : false, //多选
			        checkOnly: true, //是否只能通过点击checkbox列进行选择，默认为false 
			        handleMouseDown : Ext.emptyFn, //不允许使用点击表格形式修改选择
					listeners : {
						'rowselect' : {
							fn : function(e, rowIndex, record) {  
								
								//   if (!recordPlateNumber.contains(record.get('plateNumber')))  
								//	   recordPlateNumber.push(record.get('plateNumber'));  
								 //      recordsChecked.push(record); 

							//	alert(record.get('plateNumber'));
							//	alert(Ext.encode(dispatchListSelectPlateNumber));
							//	this.app.plateNumberID=record.get('id');
							//	this.app.plateNumber=record.get('plateNumber');

							var dates=Ext.getCmp('dStartField').getValue();							
							// alert(dates[0].format('Y-m-d'));	  		start					
						var newJson='';
						newJson='{"plateNumber":"'+record.get('plateNumber')+
								  '","taskID":"'+gridSelectTaskID+
								  '","sendCarDate":"'+dates[0].format('Y-m-d')+
								  '","dispatchLines":"'+dispatchLinesLabelText+		
								  '","dispatchersID":"'+loginEmpolyeeID+
								  '"}';
						dispatchListSelectPlateNumber = addJsonData(dispatchListSelectPlateNumber,record.get('plateNumber'),newJson);
//						Ext.getCmp('vehicleManager').setValue(Ext.encode(dispatchListSelectPlateNumber));	
						
						showPlateNumber(dispatchListSelectPlateNumber);
							}
							
						},
						'rowdeselect' :  {
							fn : function(e, rowIndex, record) {  
								
								
							//	if (recordPlateNumber.contains(record.get('plateNumber'))) {  
							//		recordPlateNumber.remove(record.get('plateNumber'));  
							//		       recordsChecked.remove(record);  
							//	       }		
								
					//			alert(record.get('plateNumber'));
						dispatchListSelectPlateNumber = deleteJsonData(dispatchListSelectPlateNumber,record.get('plateNumber'));
					//		Ext.getCmp('vehicleManager').setValue(Ext.encode(dispatchListSelectPlateNumber));	
						showPlateNumber(dispatchListSelectPlateNumber);	
							
							}
						}
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
								header : '车辆管理员',
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
								header : '吨位',
								dataIndex : 'DWT'
							}, {
								header : '类别',
								dataIndex : 'truckType'
							}, {
								header : '调度员',
								dataIndex : 'dispatchersName'
							}
							
							
							
							]
				});
		// 菜单条	
		this.tbar = new Ext.Toolbar([
               '车管理员:',
		       {
            	   id : 'vehicleManager',
		    	   xtype : 'textfield',	
		    	   width : 80
		       },
		       '司机:',
		       {
		    	   id : 'driver',
		    	   xtype : 'textfield',					
				   width : 80
				},
			    '电话:',
			    {
			    	   id : 'tel',
			    	   xtype : 'textfield',					
					   width : 80
			    },				
		       '车牌号:',
		       {
					id : 'plateNumber',
					xtype : 'textfield',
					width : 80
				}, 
				'类别:',
				{   
					id:'truckType',
								xtype : 'combo',
								width : 60,							
								hiddenName : 'truckType',
								anchor : '90%',
								typeAhead : true,
								editable : false,
								triggerAction : 'all',
								lazyRender : true,
								mode : 'local',
								store : new Ext.data.ArrayStore({
											fields : ['key', 'val'],
											data : [['全部', ''],['自有', '自有'], ['挂靠', '挂靠'], ['外车', '外车']]
										}),												
								valueField : 'val',
								displayField : 'key'
							
				},	
				
				'-', {
					text : '查询',
					xtype : 'button',
					iconCls : 'query',
					handler : function() {
			
						Ext.getCmp('truckSelectorGrid').getStore().reload();
								
						
					}
				}, {
					text : '清空',
					xtype : 'button',
					iconCls : 'reset',
					handler : function() {
						Ext.getCmp('vehicleManager').reset();
						Ext.getCmp('driver').reset();
						Ext.getCmp('tel').reset();
						Ext.getCmp('plateNumber').reset();					
						Ext.getCmp('truckType').reset();					

					}
				}]);
		// 页码条
		this.bbar = new Ext.PagingToolbar({
					pageSize : 40,
					displayInfo : true,
					store : this.ds
				});
		// 构造
		Ext.truckSelector.grid.superclass.constructor.call(this, {
					region : 'west',
					loadMask : 'loading...',
					columnLines : true,
					stripeRows : true,
					style : 'padding-right:1px',
					viewConfig : {
						forceFit : true
					}
				});
	},
	onUnChecked : function() {
		var selects = Ext.getCmp('truckSelectorGrid').getSelectionModel();	
		selects.clearSelections();
	//	Ext.getCmp('selectorPlateNumber').setValue('');
	},
	onChecked : function(oldPlateNumber) {
			//this.sm = new Ext.grid.CheckboxSelectionModel({
        var truckSelectorGridModel = Ext.getCmp('truckSelectorGrid').getSelectionModel();
        var truckSelectorGridStore = Ext.getCmp('truckSelectorGrid').getStore();
        
        var records = new Array();  
        
    //	alert(Ext.encode(tr));
		for (var i = 0; i < oldPlateNumber.length; i++) {
			//根据车牌在grid 中查找匹配的车牌 找到就勾选            
        //	alert(store.getCount());        	
    //        alert(store.getById('plateNumber'));
     //  alert(tr[i].plateNumber);            
       //     alert(store.getAt(0).get("plateNumber"));		
            for (var j = 0; j < truckSelectorGridStore.getCount(); j++) {          	
                var recored = truckSelectorGridStore.getAt(j);                
                 if (recored.get("plateNumber") == oldPlateNumber[i].plateNumber) {
                	 truckSelectorGridModel.selectRow(j,true); 
                	// alert('======'+tr[i].plateNumber);
                	// records.push(recored);
                }
            }   
		}		
		
	//	truckSelectorGridModel.selectRecords(records, true);// 		
		
//		  this.ds.each(function(record) {  
//		      if (recordPlateNumber.contains(record.get('plateNumber')))  
//		                records.push(record);  
//		          });  
		
	//	this.sm = new Ext.grid.CheckboxSelectionModel({
	//	Ext.getCmp('truckSelectorGrid').
	//	alert(this.sm);
		
		
		
	}
});


function deleteJsonData(jsonObj,nameStr) {
	var jObj=jsonObj;
    for (var i = 0; i < jsonObj.length; i++) {
        var cur_person = jsonObj[i];
        if (cur_person.plateNumber == nameStr) {
        //	alert(cur_person.plateNumber+'   '+nameStr);
        	jObj.splice(i, 1);
        }
    }
	return jObj;
}

function addJsonData(jsonObj,newPlateNumber,nameStr) {
	var jObj =jsonObj;
	var ed=0;

	//alert(jsonObj.length);
	//判断是否已经存在
    for (var i = 0; i < jsonObj.length; i++) {
        var cur_person = jsonObj[i];
   //   alert(cur_person.plateNumber+'   '+newPlateNumber);
        if (cur_person.plateNumber == newPlateNumber) {
        	ed=1;
        //	alert(cur_person.plateNumber+'   '+newPlateNumber);
        }
    }
    if (ed==0) {
    		jObj.push(JSON.parse(nameStr));
    }
    
	return jObj;
}



function delArrayData(arrayPlateNumber,plateNumber) {
	var jObj=arrayPlateNumber;
	
	
//	alert(Ext.Array.contains(arrayPlateNumber,plateNumber));    
	
    for (var i = 0; i < arrayPlateNumber.length; i++) {
        var oldPlateNumber = arrayPlateNumber[i];
        if (oldPlateNumber.plateNumber == plateNumber) {
        	
        	jObj.splice(i, 1);
        }
    }
	return jObj;
}
function addArrayData(arrayPlateNumber,newPlateNumber) {
	var jObj =arrayPlateNumber;
	var ed=0;

	//判断是否已经存在
    for (var i = 0; i < arrayPlateNumber.length; i++) {
        var oldPlateNumber = arrayPlateNumber[i];
        if (oldPlateNumber.plateNumber == newPlateNumber) {
        	ed=1;
        }
    }
    if (ed==0) {
    		jObj.push(newPlateNumber);
    }
    
	return jObj;
}

function showPlateNumber(jsonArrayPlateNumber) {
	var plateNumber='';
	for (var i = 0; i < jsonArrayPlateNumber.length; i++) {		      

	    plateNumber=plateNumber+jsonArrayPlateNumber[i].plateNumber+',';
	}
	Ext.getCmp('selPlateNumber').setValue(plateNumber); 	
}





Ext.truckSelector.panel = new Ext.Panel({
	id : 'truckSelectorPanel', 
	//title : '车辆调度',
//	layout : 'border',
	items : [new Ext.truckSelector.grid(), {
		region : 'east',
	//	layout : 'border',		
		items : [
				new Ext.form.TextArea({
					id:'selectorPlateNumber',
					fieldLabel : '已选车牌',		
				//	region : 'east',
					id : 'selPlateNumber',
				//	anchor : '100%',
					height: 100,
					width:'100%',
					readOnly : true,
					style : 'background:#E6E6E6'
				})
		]
	}
	
	]
//items : [this.calendarPanel ]}]



})



Ext.truckSelector.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.plateNumberID = '';
				this.plateNumber = '';
			//	this.form = new Ext.empSelector.form(this);
				this.grid = new Ext.truckSelector.grid(this);
				Ext.truckSelector.win.superclass.constructor.call(this, {
							title : '车辆选择器',
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
				this.app.callback.call(this.app.scope, this.plateNumberID,this.plateNumber);
				this.close();
			},
			onReset : function(btn) {
			//	this.form.getForm().reset();
			//	this.empId = [];
			//	this.empName = [];
			},
			onClose : function() {
				this.close();
			}
		});

var truckSelectorWin = function(callback, isSingle, scope) {
	this.callback = callback;
	this.isSingle = isSingle;
	this.scope = scope;
	var win = new Ext.truckSelector.win(this);
	win.show();
}


