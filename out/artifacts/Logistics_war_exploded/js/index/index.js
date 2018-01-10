Ext.namespace('Ext.main'); // 创建域

/**
 * 主展示区
 * 
 * @class Ext.main.viewport
 * @extends Ext.Viewport
 */
Ext.main.viewport = Ext.extend(Ext.Viewport, {
	constructor : function() {
		// 顶端
		this.header = new Ext.Panel({
			baseCls : 'x-plain',
			region : 'north',
			contentEl : 'north',
			height : 45,
			boxMinHeight : 45,
			boxMaxHeight : 45,
			split : true,
			collapseMode : 'mini'
		});
		// 底部
		this.footer = new Ext.BoxComponent({
			baseCls : 'x-plain',
			region : 'south',
			el : 'south',
			height : 20
		});
		// 菜单树
		this.menu = new Ext.Panel({
			title : '导航菜单',
			id : 'west_panel',
			iconCls : 'direction',
			// bodyStyle : 'background-color:#C9D9EB',
			split : true,
			collapseMode : 'mini',
			width : 170,
			region : 'west',
			tools : [ {
				id : 'refresh',
				qtip : '刷新菜单',
				handler : function(event, toolEl, panel, tc) {
					this.menu.removeAll(true);
					menuRefresh(this.menu);
				},
				scope : this
			} ],
			layout : {
				type : 'accordion',
				animate : true
			},
			listeners : {
				'afterrender' : {
					fn : function(panel) {
						menuRefresh(panel);
					},
					scope : this
				}
			}
		});
		// 主要显示区
		this.main = new Ext.TabPanel({
			id : 'centerTabPanel',
			region : 'center',
			deferredRender : true,
			enableTabScroll : true,
			activeTab : 0,
			defaults : {
				autoScroll : true,
				closable : true
			},
			items : [ {
				xtype : 'panel',
				id : 'homePanel',
				iconCls : 'house',
				title : '首页',
				region : 'center',
				closable : false,
				html : '<iframe style="width:100%;height:100%" frameborder="no"'
					+ ' border="0" scrolling="auto"'
					+ ' src='
					+ path
					//	+ '/jsLib/extensible-1.0.2/examples/calendar/test-app.jsp></iframe>'
					+ '/page/home/home.jsp></iframe>'
			} ]
		});
		// 定义
		Ext.main.viewport.superclass.constructor.call(this, {
			layout : 'border',
			id : 'viewport',
			border : false,
			items : [ this.header, this.main, this.menu, this.footer ]
		});
	}
});

/**
 * 菜单刷新
 * 
 * @param {}
 *            panel
 */
var menuRefresh = function(panel) {
	// 发送请求到服务器
	Ext.Ajax.request({
		url : path + '/system/buildByCurrUserMenu.do',
		params : {},
		method : 'POST',
		success : function(success, msg) { // 删除成功
			var data = Ext.decode(success.responseText);
			for (var i = 0; i < data.length; i++) {
				var temp = new Ext.tree.TreePanel({
					title : data[i].text, // 节点名称
					iconCls : data[i].iconCls, // 节点图标
					id : data[i].id, // 节点ID
					// bodyStyle : 'background-color:#C9D9EB',
					autoScroll : true,
					enableDD : false, // 是否支持拖拽效果
					containerScroll : true, // 是否支持滚动条
					collapsible : true,
					rootVisible : false, // 是否显示跟节点
					root : new Ext.tree.AsyncTreeNode({
						expanded : true,
						children : data[i].children
					}),
					listeners : {
						click : function(node, event) {
							//20170825    传入权限数组
							var arrayRight = new Array();
							var object = new Object();
							//	object.userId = Ext.getCmp('id').getValue();
							//	object.menuId = checkbox.id.substring(0,32);
							object.isModify = node.attributes.isModify;
							object.isAdd = node.attributes.isAdd;
							object.isDel = node.attributes.isDel;
							//	object.isSee=node.attributes.isSee;
							arrayRight.push(object);
							addTab(node.attributes.link, arrayRight);
						}
					}
				})
				panel.add(temp);
			}
			panel.doLayout(true);
		},
		failure : function() {
			alert("菜单目录加载失败....");
		},
		scope : this
	});
}

/**
 * 
 * @param {}
 *            id
 * @param {}
 *            params
 * @param {}
 *            precall
 * @param {}
 *            callback
 */
var addTab = function(id, params, precall, callback) {
	if (precall != null) {
		precall.call(this);
	}
	var tabs = Ext.getCmp('centerTabPanel');
	var tabItem = tabs.getItem(id);

	//	alert(params);


	if (tabItem == null) {
		if (tabs.items.length == 20) {
			Ext.ux.Toast.msg('操作提示', '标签页达到上限，请关闭无用标签页并重试。');
			return;
		} else {
			$ImportJs(id, function(view) {
				tabItem = tabs.add(view);
				tabs.activate(tabItem);

				//	alert(Ext.encode(view));
				//	alert(view);

			}, params);
		}
	} else {
		if (callback != null) {
			callback.call(this);
		}
		tabs.activate(tabItem);
	}
}

/**
 * 用户登出
 */
var logout = function() {
	Ext.Ajax.request({
		url : path + '/system/logout.do',
		params : {},
		method : 'POST',
		success : function() {
			window.location.href = path + '/login.jsp';
		}
	});
}

/**
 * 锁屏
 */
var myMessage = function() {
	Ext.Msg.show({
		buttons : Ext.Msg.CANCEL,
		icon : Ext.Msg.INFO,
		title : '信息',
		msg : '*********** LOCK *************'
	})
}

var switchPro = function() {
	Ext.Msg.show({
		buttons : Ext.Msg.CANCEL,
		icon : Ext.Msg.INFO,
		title : '信息',
		msg : '未连接到GIS系统！！！'
	})
}

//2017.09.06我的消息   需要审批的数据
var myMessage = function() {
	

	this.clickModify = function(checkbox, params) {
		
	
		
		var status = '1';  //0初始状态未提交1已经提交等待审批2驳回3审批通过4取消审批申请
		if (params == 1) {
			//修改
			if (document.getElementById(checkbox.id).value == '确认修改') {
				document.getElementById(checkbox.id).value = '撤销确认修改';
				status = '3';
				//设置驳回按钮不可用  _reject
				document.getElementById(checkbox.id.substring(0,32)+'_reject').disabled='disabled';
			} else {
				document.getElementById(checkbox.id).value = '确认修改';
				document.getElementById(checkbox.id.substring(0,32)+'_reject').disabled='';
				status = '1';

			}
		}

		if (params == 0) {
			//删除
			if (document.getElementById(checkbox.id).value == '确认删除') {
				document.getElementById(checkbox.id).value = '撤销确认删除';
				status = '3';
				//设置驳回按钮不可用  _reject     disabled='enabled'
				document.getElementById(checkbox.id.substring(0,32)+'_reject').disabled='disabled';
			} else {
				document.getElementById(checkbox.id).value = '确认删除';
				document.getElementById(checkbox.id.substring(0,32)+'_reject').disabled='';
				status = '1';
			}
		}
		 var gridStore = Ext.getCmp('dispatchListLogWorkflow').getStore();													
	     for (var j = 0; j < gridStore.getCount(); j++) {          	
	         var recored = gridStore.getAt(j);       
	          if (recored.data.id == checkbox.id.substring(0,32)) {
	        	  recored.data.status=status;
	         }
	     }	

	}



	this.clickReject = function(checkbox) {
		var status = '1';  //0初始状态未提交1已经提交等待审批2驳回3审批通过4取消审批申请
		if (document.getElementById(checkbox.id).value == '驳回') {
			document.getElementById(checkbox.id).value = '撤销驳回';
			status = '2';
	//		status = '0';
			//设置确认按钮不可用  _reject     disabled='enabled'
			document.getElementById(checkbox.id.substring(0,32)+'_button').disabled='disabled';			
		} else {
			document.getElementById(checkbox.id).value = '驳回';
			status = '1';
			document.getElementById(checkbox.id.substring(0,32)+'_button').disabled='';

		}
		 var gridStore = Ext.getCmp('dispatchListLogWorkflow').getStore();													
	     for (var j = 0; j < gridStore.getCount(); j++) {          	
	         var recored = gridStore.getAt(j);       
	          if (recored.data.id == checkbox.id.substring(0,32)) {
	        	  recored.data.status=status;
	         }
	     }			
		
	}





	var myMessageForm = Ext.extend(Ext.FormPanel, {
		constructor : function(app) {
			this.app = app;
			this.items = [ {
				columnWidth : 1,
				items : [ {
					fieldLabel : '审批记录',
					xtype : 'textarea',
					height : 430,
					id : 'workflow',
					anchor : '100%',
					readOnly : true,
					style : 'background:#E6E6E6'
				} ]
			} ];

			myMessageForm.superclass.constructor.call(this, {
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



	var myMessageGrid = Ext.extend(Ext.grid.EditorGridPanel, {
		id : 'dispatchListLogWorkflow',
		clicksToEdit : 1,
		constructor : function(app) {
			this.app = app;
			// 数据源
			this.ds = new Ext.data.JsonStore({
				url : path + '/logistics/queryDispatchListLog.do',
				idProperty : 'id',
				root : 'rows',
				totalProperty : 'results',
				fields : [ 'id', 'dispatchListID', 'logType', 'plateNumber', 'payFreight', 'totalLoading', 'loadingDate',
					'totalUnloading', 'unloadingDate', 'payFreightNew', 'totalLoadingNew', 'loadingDateNew',
					'totalUnloadingNew', 'unloadingDateNew', 'remark', 'status', 'dispatchersID', 'dispatchersName'
				],
				autoDestroy : true,
				autoLoad : true,
				baseParams : {
					status : isAdmin == 1 ? '1' : '',
					start : 0,
					limit : 40
				}
			});

			// 选择框
			this.sm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : true,
				listeners : {
					'rowselect' : function(sm, index, record) {

						Ext.eu.ajax(
							path + '/logistics/queryDispatchListLogWorkflow.do',
							{
								dispatchListLogID : record.get('id')
							}, function(resp) {
								var arr = Ext.decode(resp.responseText);
								var workflowMess = '';
								var status = '';
								for (var i = 0; i < arr.length; i++) {
									switch (arr[i].status) {
									case '1':
										status = '提交';
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
										status = '取消审批申请';
										break;
									}

									workflowMess = workflowMess + status + ':';
									workflowMess = workflowMess + arr[i].moTime + '\n';
									workflowMess = workflowMess + arr[i].remark + '\n';
								}
								this.app.form.getForm().findField('workflow').setValue(workflowMess);
							}, this);

					},
					'rowdeselect' : function(sm, index, record) {},

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
					header : 'logType',
					dataIndex : 'logType',
					hidden : true
				},
					{
						header : '调度员',
						width : 100,
						dataIndex : 'dispatchersName',
						css : 'background: #bde0e8;'
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
						css : 'background: #bde0e8;'
					}, {
						header : '新装货量',
						width : 110,
						dataIndex : 'totalLoadingNew',
						css : 'background: #bde0e8;'
					}, {
						header : '新装货时间',
						width : 140,
						dataIndex : 'loadingDateNew',
						renderer : Ext.util.Format.dateRenderer('Y-m-d'),
						css : 'background: #bde0e8;'
					}, {
						header : '新卸货量',
						width : 110,
						dataIndex : 'totalUnloadingNew',
						css : 'background: #bde0e8;'
					}, {
						header : '新卸货时间',
						width : 140,
						dataIndex : 'unloadingDateNew',
						renderer : Ext.util.Format.dateRenderer('Y-m-d'),
						css : 'background: #bde0e8;'
					}, {
						header : '审批说明',
						width : 450,
						dataIndex : 'remark',
						editor : {
							xtype : 'textfield',
							selectOnFocus : true
						}
					}, {
						header : '操作',
						//	tooltip: '修改申请！',
						dataIndex : 'amendedPetition',
						width : 150,
						renderer : function(value, cellmeta, record) {
							var returnStr;
							if (record.data.status == 1 && record.data.logType == 'modify') {
								returnStr = "<INPUT   id=" + record.data.id +
									"_button type='button' onclick='clickModify(this,1)' value='确认修改'>";
							}
							if (record.data.status == 1 && record.data.logType == 'del') {
								returnStr = "<INPUT  id=" + record.data.id + "_button type='button' onclick='clickModify(this,0)' value='确认删除'>";

							}
							return returnStr;
						}
					},
					{
						header : '驳回',
						dataIndex : 'reject',
						width : 150,
						renderer : function(value, cellmeta, record) {

							return "<INPUT   id=" + record.data.id + "_reject type='button' onclick='clickReject(this)' value='驳回'>";



						}
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
			myMessageGrid.superclass.constructor.call(this, {
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

	var myMessageWin = Ext.extend(Ext.Window, {
		constructor : function(app) {
			this.app = app;
			this.form = new myMessageForm(this);
			this.grid = new myMessageGrid(this);
			myMessageWin.superclass.constructor.call(this, {
				title : '数据修改审批',
				width : 1300,
				height : 500,
				plain : true,
				showLock : true,
				modal : false,
				resizable : false,
				buttonAlign : 'center',
				layout : 'border',
				items : [ this.form, this.grid ],
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

				//alert(status);


				if (plateNumber != '' && records[i].data.status !=1) {
					var dispatchListLog = {
						id : records[i].data.id,
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
						logType : records[i].data.logType,
						auditor : loginEmpID,
						status:records[i].data.status
					};
					//alert(records[i].data.logType);				
					dispatchListLogs.push(dispatchListLog);
				}
			}
		//	alert(Ext.encode(dispatchListLogs));

			//	alert(records);


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
		onClose : function() {
			this.close();
		}
	});



	var messageWin = new myMessageWin;
	messageWin.show();


}


var modifyPassword = function() {
	//20170825 顶部栏增加修改密码功能
	var userForm = Ext.extend(Ext.FormPanel, {
		constructor : function(app) {
			this.app = app;

			Ext.apply(Ext.form.VTypes, {
				password : function(val, field) {
					if (field.confirmTo) {
						var pwd = Ext.get(field.confirmTo);
						if (val.trim() == pwd.getValue().trim()) {
							return true;
						} else {
							return false;
						}
						return false;
					}
				}
			}); //这段是必要的		

			this.items = [
				{
					columnWidth : 1,
					items : [ {
						fieldLabel : '旧密码',
						xtype : 'textfield',
						id : 'oldPass',
						maxLength : 16,
						inputType : 'password',
						allowBlank : false
					} ]
				}, {
					columnWidth : 1,
					items : [ {
						fieldLabel : '新密码',
						xtype : 'textfield',
						id : 'password1',
						name : 'password',
						allowBlank : false,
						minLength : 6,
						maxLength : 30,
						inputType : 'password'
					} ]
				}, {
					columnWidth : 1,
					items : [ {
						fieldLabel : '确认密码',
						xtype : 'textfield',
						id : 'password2',
						name : 'surepassword',
						minLength : 6,
						maxLength : 30,
						inputType : 'password',
						vtype : 'password',
						vtypeText : "两次密码不一致！",
						confirmTo : 'password1',
						allowBlank : false
					} ]
				} ];

			userForm.superclass.constructor.call(this, {
				labelWidth : 60,
				baseCls : 'x-plain',
				layout : 'column',
				style : 'padding : 5',
				defaults : {
					baseCls : 'x-plain',
					layout : 'form'
				},
				listeners : {
					'render' : function(form) {}
				}
			});
		}
	});
	//20170825 顶部栏增加修改密码功能
	var passwordWin = Ext.extend(Ext.Window, {
		constructor : function(app) {
			this.app = app;
			this.form = new userForm;
			passwordWin.superclass.constructor.call(this, {
				width : 300,

				plain : true,
				showLock : true,
				modal : true,
				resizable : false,
				buttonAlign : 'center',
				items : this.form,
				buttons : [ {
					text : '保存',
					iconCls : 'save',
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
			var form = this.form.getForm();
			if (form.isValid()) {
				//	btn.setDisabled(true);
				var user = form.getValues();
				Ext.apply(user, {
					password : Ext.getCmp('password2').getValue()
				});
				Ext.apply(user, {
					id : loginID
				});
				//	alert(Ext.getCmp('oldPass').getValue());
				//	alert(Ext.encode(user));
				Ext.eu.ajax(path + '/system/login.do', {
					loginName : loginName,
					password : Ext.getCmp('oldPass').getValue(),
				}, function(resp) {
					var res = Ext.decode(resp.responseText);
					//	alert(resp.responseText);								
					if (res.msg != 'ok') {
						//	Ext.ux.Toast.msg('信息', res.msg);
						Ext.ux.Toast.msg('信息', '输入的旧密码错误!');

					} else {
						Ext.eu.ajax(path + '/system/resetPassword.do', {
							user : Ext.encode(user)
						}, function(resp) {
							Ext.ux.Toast.msg('信息', '密码修改成功');
						}, this);
					//	btn.setDisabled(false);
					}
				}, this);
			}
		},
		onClose : function() {
			//alert(loginID); loginName
			this.close();
		}
	});

	var passWin = new passwordWin;
	passWin.show();












}

Ext.onReady(function() {
	Ext.QuickTips.init();
	this.viewport = new Ext.main.viewport();
	// 屏蔽backspace
	Ext.getDoc().on('keydown', function(e) {
		if (e.getKey() == 8 && e.getTarget().type == 'text'
			&& !e.getTarget().readOnly) {

		} else if (e.getKey() == 8 && e.getTarget().type == 'textarea'
			&& !e.getTarget().readOnly) {

		} else if (e.getKey() == 8) {
			e.preventDefault();
		}
	});
});