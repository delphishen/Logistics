Ext.namespace('Ext.grade');

Ext.grade.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;	

		this.items = [{
					xtype : 'hidden',
					id : 'id'
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '等级名称',
								xtype : 'textfield',
								name : 'grade',
								anchor : '98%',			
								allowBlank : false,
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '月卸货次数起始',
								xtype : 'numberfield',
								name : 'unloadingStart',
								anchor : '98%',
								selectOnFocus : true
							}]
				}, {
					columnWidth : 1,
					items : [{
								fieldLabel : '月卸货次数截止',
								xtype : 'numberfield',
								name : 'unloadingEnd',
								anchor : '98%',
								selectOnFocus : true
							}]
				}			
				];

		Ext.grade.form.superclass.constructor.call(this, {
					labelWidth : 90,
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

Ext.grade.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.grade.form(this);
				Ext.grade.win.superclass.constructor.call(this, {
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
					//user.isAdmin = user.isAdmin == 1 ? 1 : 0;
				//	Ext.ux.Toast.msg('信息', Ext.encode(user));
					Ext.eu.ajax(path + '/logistics/saveGrade.do', {
						        grade : Ext.encode(user)
							}, function(resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getStore().reload();
									this.close();
								} else {
									Ext.ux.Toast.msg('提示', '等级名称已经存在！！！');
									btn.setDisabled(false);
								}
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});

Ext.grade.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/logistics/queryGrade.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',							
							fields : ['id', 'grade', 'unloadingStart', 'unloadingEnd'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								isPaging : true,
								start : 0,
								limit : 20
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
										header : '等级名称',
										dataIndex : 'grade'
										
									},  {
										header : '月卸货次数起始',
										dataIndex : 'unloadingStart',
										hidden : false
									},  {
										header : '月卸货次数截止',
										dataIndex : 'unloadingEnd',
										hidden : false
									}									
									
									]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							id:'buttonAddGradeView',
							xtype : 'button',
							iconCls : 'add',
							text : '新增',
							handler : this.onAdd,
							scope : this
						}, {
							id:'buttonModifyGradeView',
							xtype : 'button',
							iconCls : 'modify',
							text : '修改',
							handler : this.onModify,
							scope : this
						}, {
							id:'buttonDelGradeView',
							xtype : 'button',
							iconCls : 'delete',
							text : '删除',
							handler : this.onDelete,
							scope : this
						}]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.grade.grid.superclass.constructor.call(this, {
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
				var win = new Ext.grade.win(this);
				win.setTitle('添加等级', 'add');
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
				var win = new Ext.grade.win(this);
				var form = win.form.getForm();
				win.setTitle('修改等级', 'modify');				
				form.findField('id').setValue(select.id);
				form.findField('grade').setValue(select.grade);
				form.findField('unloadingStart').setValue(select.unloadingStart);
				form.findField('unloadingEnd').setValue(select.unloadingEnd);
				
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
								Ext.eu.ajax(path + '/logistics/deleteGrade.do', {
									      grades : Ext.encode(ary)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			}
		});

Ext.grade.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
					width : 250,
					items : [{
								xtype : 'textfield',
								fieldLabel : '等级名称',
								id : 'grade',
								anchor : '90%'
							}]
				}, {
							width : 65,
							items : [{
										xtype : 'button',
										id : 'linesQuery',
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
										id : 'linesReset',
										text : '清空',
										iconCls : 'reset',
										handler : function() {
											this.getForm().reset();
										},
										scope : this
									}]
						}];
				// panel定义
				Ext.grade.queryPanel.superclass.constructor.call(this, {
							id : 'gradeQueryPanel',
							region : 'north',
							height : 40,
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
				return this.getForm().getValues();
			}
		});


/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var gradeView = function(params) {
	this.queryPanel = new Ext.grade.queryPanel(this);
	this.grid = new Ext.grade.grid(this);
	
	Ext.getCmp('buttonAddGradeView').hidden=!params[0].isAdd;
	Ext.getCmp('buttonModifyGradeView').hidden=!params[0].isModify;
	Ext.getCmp('buttonDelGradeView').hidden=!params[0].isDel;
	
	return new Ext.Panel({
				id : 'gradeView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '车辆等级档案',
				layout : 'border',
				items : [this.queryPanel, this.grid]
			})
}
