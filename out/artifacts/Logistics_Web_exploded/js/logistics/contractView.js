Ext.namespace('Ext.contract');

Ext.contract.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;	
		this.loadingPointCombo = new Ext.form.ComboBox({
			fieldLabel : '装货点',
			name : 'loadingPoint',
			xtype : 'combo',
			anchor : '100%',
			submitValue : false,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			lazyRender : true,
			selectOnFocus : true,
			allowBlank : false,
			store : Ext.getCmp('contractQueryPanel').linesDS,
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
			anchor : '100%',
			submitValue : false,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			lazyRender : true,
			selectOnFocus : true,
			allowBlank : false,
			store : Ext.getCmp('contractQueryPanel').linesDS,
			displayField : 'linesName',
			valueField : 'id',			
			listeners : {
				'select' : function(combo, record) {
					this.getForm().findField('unloadingPointID').setValue(record.data.id);
				//	Ext.ux.Toast.msg('卸货点record.data.id', record.data.id);
				},
				scope : this
			},
			
			scope : this
		});		
		
		this.customerCombo = new Ext.form.ComboBox({
			fieldLabel : '货主',
			name : 'customerCom',
			xtype : 'combo',
			anchor : '100%',
			submitValue : false,
			editable : false,
			mode : 'local',
			triggerAction : 'all',
			lazyRender : true,
			selectOnFocus : true,
			allowBlank : false,
			store :this.customerDS,		
			displayField : 'customerName',
			valueField : 'id',
			store : Ext.getCmp('contractQueryPanel').getForm()
			.findField('customerName').getStore(),	
			listeners : {
				'select' : function(combo, record) {
					//Ext.taskList.queryPanel
//form.getForm().findField('customerStore').getStore().reload();
					this.getForm().findField('customerID').setValue(record.data.id);
				},
				scope : this
			},
			
			scope : this
		});			
			

		this.items = [{
					xtype : 'hidden',
					id : 'id'
				}, 
				{
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
					columnWidth : 1,
				//	labelWidth : 60,
					items : [{
								fieldLabel : '合同编号',
								xtype : 'textfield',
								id : 'contractNO',
								anchor : '98%',			
								allowBlank : false,
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [this.customerCombo]
				}, {
					columnWidth : 1,
					items : [this.loadingPointCombo]
				}, {
					columnWidth : 1,
					items : [this.unloadingPointCombo]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '运输价格',
								xtype : 'textfield',
								name : 'freight',
								anchor : '98%',
								selectOnFocus : true
							}]
				},
				{
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
				];

		Ext.contract.form.superclass.constructor.call(this, {
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

Ext.contract.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.contract.form(this);
				Ext.contract.win.superclass.constructor.call(this, {
							width : 400,
							height:200,
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
					//user.isAdmin = user.isAdmin == 1 ? 1 : 0;
				//	alert(Ext.encode(user));
					Ext.eu.ajax(path + '/logistics/saveContract.do', {
						        contract : Ext.encode(user)
							}, function(resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getStore().reload();
									this.close();
								} else {
									Ext.ux.Toast.msg('提示', '合同编号已经存在！！！');
									btn.setDisabled(false);
								}
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});


Ext.contract.grid = Ext.extend(Ext.grid.GridPanel, {
	id:'contractGrid',
	constructor : function(app) {
		this.app = app;
		this.ds = new Ext.data.JsonStore({
			url : path + '/logistics/queryContract.do',
			idProperty : 'id',
			root : 'rows',
			totalProperty : 'results',
			fields : [ 'id', 'contractNO', 'customerID','customerName','loadingPointID','loadingPoint',
				'unloadingPointID', 'unloadingPoint', 'freight', 'taxYN' ],
			autoDestroy : true,
			autoLoad : true,
			baseParams : {
				isPaging : true,
				start : 0,
				limit : 60
			},
			listeners : {
				'beforeload' : function() {
					//alert(this.getStore().baseParams);
					Ext.apply(this.getStore().baseParams,
						this.app.queryPanel.getQueryParams());

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
					//	gridSelectTaskID=record.data.taskID;		
					//	eventStore.reload({params:{taskID:''+gridSelectTaskID+''}});//向后台传参数 
					//	grid.getStore().load();
					//	alert(record.data.id);
						Ext.getCmp('attachGrid').getStore().reload({params:{link:''+record.data.id+''}});

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
				header : '合同编号',				
				dataIndex : 'contractNO'				
			}, {
				header : '客户名称',
				dataIndex : 'customerName'
			}, 
			{
				header : '装货点',
				dataIndex : 'loadingPoint'
			}, {
				header : '卸货点',
				dataIndex : 'unloadingPoint'
			}, {
				header : '运输价格',
				dataIndex : 'freight'
			}, 
			{
				header : '是否含税',
				dataIndex : 'taxYN',
				xtype: "booleancolumn",
				trueText: "含税",
				falseText: "不含税"
			}, 

			]
		});
	
		// 菜单条
		this.tbar = new Ext.Toolbar([{
			        id:'buttonAddContractView',
					xtype : 'button',
					iconCls : 'add',
					text : '新增',
					handler : this.onAdd,
				//	hidden:true,
					scope : this
				}, {
					id:'buttonModifyContractView',
					xtype : 'button',
					iconCls : 'modify',
					text : '修改',
					handler : this.onModify,
					scope : this
				}, {
					id:'buttonDelContractView',
					xtype : 'button',
					iconCls : 'delete',
					text : '删除',
					handler : this.onDelete,
					scope : this
				}]);		
		

		// 页码条
		this.bbar = new Ext.PagingToolbar({
			pageSize : 60,
			displayInfo : true,
			store : this.ds
		});
		// 构造
		Ext.contract.grid.superclass.constructor.call(this, {
			region : 'center',
		//	region : 'west',
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
		var win = new Ext.contract.win(this);
		win.setTitle('添加合同', 'add');
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
		var win = new Ext.contract.win(this);
		var form = win.form.getForm();
		win.setTitle('修改合同信息', 'modify');				
		form.findField('id').setValue(select.id);
		form.findField('contractNO').setValue(select.contractNO);		
		form.findField('customerID').setValue(select.customerID);
		form.findField('customerCom').setValue(select.customerName);
		form.findField('loadingPoint').setValue(select.loadingPoint);		
		form.findField('loadingPointID').setValue(select.loadingPointID);	
		form.findField('unloadingPoint').setValue(select.unloadingPoint);
		form.findField('unloadingPointID').setValue(select.unloadingPointID);
		form.findField('freight').setValue(select.freight)
		form.findField('taxYN').setValue(select.taxYN);
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
						Ext.eu.ajax(path + '/logistics/deleteContract.do', {
							      contracts : Ext.encode(ary)
								}, function(resp) {
									Ext.ux.Toast.msg('信息', '删除成功');
									this.getStore().reload();
								}, this);
					}
				}, this);
	}







});

Ext.contract.queryPanel = Ext.extend(Ext.FormPanel, {
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
				fieldLabel : '合同编号',
				hidden : false,
				name : 'contractNO',
				anchor : '90%'
			} ]
		},		
		{
				width : 180,
				items : [ {
					fieldLabel : '客户名称',
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
					fieldLabel : '运输价格',
					name : 'freight',
					anchor : '90%'
				} ]
			}, {
				width : 180,
				items : [{
							xtype : 'combo',
							width : 60,
							fieldLabel : '是否含税',									
							hiddenName : 'taxYN',
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
		Ext.contract.queryPanel.superclass.constructor.call(this, {
			id : 'contractQueryPanel',
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
var contractView = function(params) {
	this.queryPanel = new Ext.contract.queryPanel(this);
	this.attachPanel = new Ext.attach.grid(this);
	this.grid = new Ext.contract.grid(this);

		Ext.getCmp('buttonAddContractView').hidden=!params[0].isAdd;
		Ext.getCmp('buttonModifyContractView').hidden=!params[0].isModify;
		Ext.getCmp('buttonDelContractView').hidden=!params[0].isDel;
//		Ext.getCmp('buttonSee').setHidden=!params[0].isSee;


	return new Ext.Panel({
		id : 'contractView', // 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
		title : '合同管理',
		layout : 'border',
		items : [ {
			region : 'center',
			layout : 'border',
			items : [ this.queryPanel, this.grid ]
		}, this.attachPanel ]
//	items : [this.calendarPanel ]}]



	})
}