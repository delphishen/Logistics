Ext.namespace('Ext.vehicleScheduling');


var gridSelectTaskID = null; //当前页面grid 选中的任务ID
var selectDate = null;  //点击日历控件选择的日期
var dispatchLinesLabelText='';
var loginEmpolyeeID=loginEmpID;

var arrayPlateNumber=new Array();// 选中的车牌号列表  
var dispatchListSelectPlateNumber;


var proxy = new Ext.data.HttpProxy({
    disableCaching: false, // no need for cache busting when loading via Ajax
    api: {
//        read:    apiRoot+'view',
        create:  path+ '/logistics/saveDispatchList.do',
        update:  path+ '/logistics/saveDispatchList.do',
//        destroy: apiRoot+'destroy'
        read:  path+ '/logistics/queryDispatchListCalendar.do'        
    },
    listeners: {
        exception: function(proxy, type, action, o, res, arg){
            var msg = res.message ? res.message : Ext.decode(res.responseText).message;
            // ideally an app would provide a less intrusive message display
            Ext.Msg.alert('Server Error======', msg);
        }
    }
});


var reader = new Ext.data.JsonReader({
    totalProperty: 'total',
    successProperty: 'success',
    idProperty: 'id',
    root: 'rows',
    messageProperty: 'message',
    fields: Ext.ensible.cal.EventRecord.prototype.fields.getRange()
});

var writer = new Ext.data.JsonWriter({
    encode: true,
    writeAllFields: false
});


var eventStore = new Ext.ensible.cal.EventStore({
    id: 'event-store',
 //   restful: true,
    proxy: proxy,
    reader: reader,
    writer: writer,
    autoLoad: true, 
    baseParams:{taskID:'0',sendCarDate:''},
    listeners: {
        'write': function(store, action, data, resp, rec){
            var title = Ext.value(rec.data[Ext.ensible.cal.EventMappings.Title.name], '(No title)');
            switch(action){
                case 'create': 
                    Ext.ensible.sample.msg('Add', 'Added "' + title + '"');
                    break;
                case 'update':
                    Ext.ensible.sample.msg('Update', 'Updated "' + title + '"');
                    break;
                case 'destroy':
                    Ext.ensible.sample.msg('Delete', 'Deleted "' + title + '"');
                    break;
            }
        },
		'beforeload' : function() {
		//	alert('beforeload======'+Ext.encode(options.data));

//			if (gridSelectTaskID != null) {
//				var str = "";
//				str = "'" + gridSelectTaskID + "'"
//			//	Ext.encode( Mixed o ) : String： json对象转换json字符串
//			//	 Ext.decode( String json ) : Object： json字符串转换json对象
//			//	alert(Ext.encode(Ext.getCmp('vehicleSchedulingGrid').getStore().baseParams));
//			Ext.apply(Ext.getCmp('vehicleSchedulingGrid').getStore().baseParams,{	'taskID' : str});				
//				//	alert(Ext.encode(Ext.getCmp('vehicleSchedulingGrid').getStore().baseParams));				
//			}
		},
		'load' : function(store, records, successful, opts) {
		//	alert(store.getCount());
		//	alert(records.length);
			//获取json字符串 
		//	dispatchListSelectPlateNumber = store.reader.jsonData.rows;
			//alert(Ext.encode(store.reader.jsonData.rows));
		//	alert(Ext.encode(dispatchListSelectPlateNumber));
			

		
		},
		scope : this        
    }
});

Ext.vehicleScheduling.calendarPanel = Ext.extend(Ext.ensible.cal.CalendarPanel, {
	  id: 'calendar',
	region : 'east',
	width : 800,
	height : '100%',
	eventStore : eventStore,
//	 calendarStore: calendarStore,
	editModal : true,  // EventEditWindow 打开模式
	recurrence : true,
	readOnly : false,
	showDayView : false,
	showWeekView : false,
	showMultiWeekView : false,
	showMonthView : true,
	showNavBar : true,
	showTodayText : false,
	enableDD : false,// 是否支持拖拽效果
	showTime : true,
	showDayView:false,
	enableEditDetails : false, //2017.08.06 隐藏编辑事件
	multiWeekViewCfg : {
		weekCount : 2
	},	
	sharedViewCfg:{
		showTime: false,
	},
	listeners : {
		'eventcancel' : function(the, record) {
			//alert('eventcancel');
			 //this.win.close();  
		},
		'eventclick' : function(the, record) {
			// alert('eventclick');
				var selects = Ext.getCmp('vehicleSchedulingGrid').getSelectionModel().getSelections();
				
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择任务！");
					return false;
				}else if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条任务！");
					return false;
				}
			
				
		},		
		 dayclick : {fn:function ( thisEv, dt, allday, el ){

		//     alert(dt);
		     
				var selects = Ext.getCmp('vehicleSchedulingGrid').getSelectionModel().getSelections();
				
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择任务！");
					return false;
				}else if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条任务！");
					return false;
				}
		       
		       
		      //  return false;
		    } ,scope: this}		
		

	}
});



	
//alert(loginEmpID);



Ext.override(Ext.ensible.cal.EventEditWindow,
		{
			width : 950,
			height : 600,
			resizable:false,
			closeAction: 'hide',//close 关闭  hide  隐藏      destroy
			eventdelete:false,
			onExport:function(){
				
				//alert("onExport");
			},		
		    onSave: function(){	    	

		    //	alert('===='+ Ext.encode(dispatchListSelectPlateNumber));  	
		    //	alert(dispatchListSelectPlateNumber.length);
		    	
		   //获取选择的车牌信息 	
//		    	var truckSelectorGridModel = Ext.getCmp('truckSelectorGrid').getSelectionModel().getSelections();//获取所有选中行
//		    	var dispatchListSelectPlateNumber="";  //根据任务 日期 保存当前选择的车牌 
				var dates=Ext.getCmp('dStartField').getValue();							
					// alert(dates[0].format('Y-m-d'));	  	
		        var str = '{"taskID":"'+gridSelectTaskID+
		        		  '","dispatchersID":"'+loginEmpolyeeID+
		         		   '","sendCarDate":"'+dates[0].format('Y-m-d')+
		         		   '","dispatchLines":"'+dispatchLinesLabelText+
		         		  '","plateNumber":"'+""+'"}';	 
		        if(dispatchListSelectPlateNumber.length == 0)
		        	{
		        	dispatchListSelectPlateNumber.push(JSON.parse(str));
		        	
		        	}		        
//		         
//		         for(var i=0;i <truckSelectorGridModel.length;i++){
//		        	 dispatchListSelectPlateNumber = dispatchListSelectPlateNumber+str + 
//		        	 truckSelectorGridModel[i].get('plateNumber') + '"},';
//		        	
//		         }   
//		         dispatchListSelectPlateNumber = dispatchListSelectPlateNumber.substring(0, dispatchListSelectPlateNumber.lastIndexOf(','));		         
//		         dispatchListSelectPlateNumber="["+dispatchListSelectPlateNumber+"]";
   //    alert( Ext.encode(dispatchListSelectPlateNumber));

					Ext.eu.ajax(path + '/logistics/batchSaveDispatchList.do', {
							dispatchLists : Ext.encode(dispatchListSelectPlateNumber)
						}, function(resp) {
							var res = Ext.decode(resp.responseText);
							Ext.ux.Toast.msg('信息', '成功处理：'+res.label+' 记录');
							eventStore.reload({params:{taskID:''+gridSelectTaskID+''}});//传参数 				
						}, this);		
		    	
		    	dispatchListSelectPlateNumber=[];
		    	this.hide();
		    }	    
			
		});



Ext.vehicleScheduling.grid = Ext.extend(Ext.grid.GridPanel, {
	id:'vehicleSchedulingGrid',
	constructor : function(app) {
		this.app = app;
		this.ds = new Ext.data.JsonStore({
			url : path + '/logistics/queryTaskList.do',
			idProperty : 'id',
			root : 'rows',
			totalProperty : 'results',
			fields : [ 'id', 'taskID', 'dateBegin', 'dateEnd',
				'customerID', 'customerName', 'loadingPoint', 'loadingPointID', 'unloadingPoint', 'unloadingPointID', 'cargoType',
				'shipName', 'contract', 'trafficVolume', 'residualQuantity',
				'freight', 'isYN', 'receivablesMethod', 'salesmanID', 'salesman', 'taskCondition' ],
			autoDestroy : true,
			autoLoad : true,
			baseParams : {
				taskCondition:'正常',
				isPaging : true,
				start : 0,
				limit : 80
			},
			listeners : {
				'beforeload' : function() {
					//alert(this.getStore().baseParams);
					Ext.apply(this.getStore().baseParams,this.app.queryPanel.getQueryParams());

				},
				scope : this
			}
		});



		// 选择框
		this.sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect : true, //单选
			listeners : {
				rowdeselect : function(model, index, record) {
					//取消选取
					var selects = Ext.eu.getSelects(this);
					if (selects.length == 0) {
						//	Ext.getCmp('modifyDispatchList').disable();
						//	Ext.getCmp('deleteDispatchList').disable();
					} else if (selects.length == 1) {
						//	Ext.getCmp('modifyDispatchList').enable();
						//	Ext.getCmp('deleteDispatchList').enable();
					} else {
						//	Ext.getCmp('deleteDispatchList').enable();
					}
					//	Ext.ux.Toast.msg("信息", "rowdeselect");
//					for (var i = 0; i < selects.length; i++) {
//						if (selects[i].data.id == water.id) {
//								Ext.getCmp('deleteDispatchList').disable();
//								Ext.getCmp('modifyDispatchList').disable();
//							break;
//						}
//					}
				},
				rowselect : function(model, index, record) {
					var selects = Ext.eu.getSelects(this);
					//已选择
					if (selects.length == 1) {
						gridSelectTaskID=record.data.taskID;		
						//任务单取 派车信息
						eventStore.reload({params:{taskID:''+gridSelectTaskID+''}});//向后台传参数 
		 			    dispatchLinesLabelText=record.data.loadingPoint+'-'+record.data.unloadingPoint;
		 			    
			    
		 			    
		 			    

					} else if (selects.length > 1) {
						//	Ext.getCmp('modifyDispatchList').disable();
						//	Ext.getCmp('deleteDispatchList').enable();
					}
					//	Ext.ux.Toast.msg("信息", "rowselect");
//					for (var i = 0; i < selects.length; i++) {
//						if (selects[i].data.sortId == water.sortId) {
//							//	Ext.getCmp('deleteDispatchList').disable();
//							//	Ext.getCmp('modifyDispatchList').disable();
//							break;
//						}
//					}
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
			columns : [ new Ext.grid.RowNumberer(), this.sm, {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '任务单号',
				dataIndex : 'taskID',
				hidden : true
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
				header : '运输合同量',
				dataIndex : 'contract'
			}, {
				header : '运输量/天',
				dataIndex : 'trafficVolume'
			}, {
				header : '剩余量',
				dataIndex : 'residualQuantity'
			}

			]
		});

		// 页码条
		this.bbar = new Ext.PagingToolbar({
			pageSize : 80,
			displayInfo : true,
			store : this.ds
		});
		// 构造
		Ext.vehicleScheduling.grid.superclass.constructor.call(this, {
			region : 'center',
			loadMask : 'loading...',
			columnLines : true,
			clicksToEdit : 1,
			stripeRows : true,
			viewConfig : {
				forceFit : true
			}
		});
	}
});

Ext.vehicleScheduling.queryPanel = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		this.linesDS = new Ext.data.Store({
			proxy : new Ext.data.HttpProxy({
				url : path
					+ '/logistics/getLinesAll.do',
				method : 'POST'
			}),
			reader : new Ext.data.JsonReader({}, [ {
				name : 'id',
				mapping : 'id'
			}, {
				name : 'linesName',
				mapping : 'linesName'
			} ])
		});
		// 在column布局的制约下，从左至右每个元素依次进行form布局
		this.items = [ {
			width : 180,
			items : [ {
				xtype : 'textfield',
				fieldLabel : '任务单号',
				hidden : true,
				name : 'taskID',
				anchor : '90%'
			} ]
		},
			{
				width : 180,
				items : [ {
					fieldLabel : '截止时间',
					xtype : 'datefield',
					name : 'dateEnd',
					format : 'Y-m-d',
					editable : false,
					anchor : '90%',
					selectOnFocus : true
				} ]
			},
			{
				width : 180,
				items : [ {
					fieldLabel : '货主',
					width : 60,
					xtype : 'combo',
					hiddenName : 'customerName',
					submitValue : false,
					anchor : '90%',
					editable : true,
					triggerAction : 'all',
					mode : 'local',
					store : new Ext.data.Store({
						proxy : new Ext.data.HttpProxy({
							url : path
								+ '/logistics/getAllCustomer.do',
							method : 'POST'
						}),
						reader : new Ext.data.JsonReader({}, [ {
							name : 'id',
							mapping : 'id'
						}, {
							name : 'customerName',
							mapping : 'customerName'
						} ])
					}),
					valueField : 'customerName',
					displayField : 'customerName',
					listeners : {
						'select' : function(combo, record) {
							//	this.getForm().findField('linesName').setValue(record.data.id);
						},
						scope : this
					}
				} ]
			},

			{
				width : 180,
				items : [ {
					fieldLabel : '装货点',
					width : 60,
					xtype : 'combo',
					hiddenName : 'loadingPoint',
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
				} ]
			},
			{
				width : 180,
				items : [ {
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
				} ]
			},
			{
				width : 180,
				items : [ {
					xtype : 'textfield',
					fieldLabel : '货物',
					name : 'cargoType',
					anchor : '90%'
				} ]
			}, {
				width : 180,
				items : [ {
					xtype : 'textfield',
					fieldLabel : '合同量',
					name : 'contract',
					anchor : '90%'
				} ]
			}, {
				width : 180,
				items : [ {
					xtype : 'textfield',
					fieldLabel : '运输量天',
					name : 'trafficVolume',
					anchor : '90%'
				} ]
			}, {
				width : 180,
				items : [ {
					xtype : 'textfield',
					fieldLabel : '剩余量',
					name : 'residualQuantity',
					anchor : '90%'
				} ]
			},


			{
				width : 65,
				items : [ {
					xtype : 'button',
					id : 'userQuery',
					text : '查询',
					iconCls : 'query',
					handler : function() {
						this.app.grid.getStore().load();
						eventStore.reload();
					//	alert(Ext.encode(eventStore));
				//		alert(eventStore.getCount());	
//						var aa = '';
//						for (var i = 0; i < eventStore.getCount(); i++) {
//							aa = aa + ',' + eventStore.getAt(i).get('end'); //遍历每一行
//						}
//						alert(aa);

					},
					scope : this
				} ]
			}, {
				width : 65,
				items : [ {
					xtype : 'button',
					id : 'userReset',
					text : '清空',
					iconCls : 'reset',
					handler : function() {
						this.getForm().reset();
					},
					scope : this
				} ]
			} ];
		// 查询panel定义
		Ext.vehicleScheduling.queryPanel.superclass.constructor.call(this, {
			id : 'vehicleSchedulingQueryPanel',
			region : 'north',
			height : 100,
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









var buttonSaveHidden=false;   //设置win 保存按钮权限,默认不隐藏


/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var vehicleSchedulingView = function(params) {
	this.queryPanel = new Ext.vehicleScheduling.queryPanel(this);
	this.calendarPanel = new Ext.vehicleScheduling.calendarPanel(this);
	this.grid = new Ext.vehicleScheduling.grid(this);


		//控制EventEditWindow 保存按钮是否可用
		buttonSaveHidden=!params[0].isModify;
		
	//	alert(buttonSaveHidden);

	
	

	return new Ext.Panel({
		id : 'vehicleSchedulingView', // 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
		title : '车辆调度',
		layout : 'border',
		items : [ {
			region : 'center',
			layout : 'border',
			items : [ this.queryPanel, this.grid ]
		}, this.calendarPanel ]
//	items : [this.calendarPanel ]}]



	})
}