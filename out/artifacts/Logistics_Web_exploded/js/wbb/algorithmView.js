Ext.namespace('Ext.algorithm');

Ext.algorithm.infoForm = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;

				this.items = [{
							xtype : 'hidden',
							id : 'id'
						}, {
							columnWidth : 1,
							labelWidth : 60,
							items : [{
										fieldLabel : '算法名称',
										xtype : 'textfield',
										name : 'name',
										anchor : '100%',
										allowBlank : false
									}, {
										fieldLabel : '算法描述',
										xtype : 'textfield',
										name : 'statement',
										anchor : '100%'
									}, {
										fieldLabel : '备注',
										xtype : 'textarea',
										name : 'remark',
										anchor : '100%'
									}]
						}];

				Ext.algorithm.infoForm.superclass.constructor.call(this, {
							region : 'center',
							labelWidth : 60,
							baseCls : 'x-plain',
							autoScroll : true,
							layout : 'column',
							style : 'padding : 5',
							defaults : {
								baseCls : 'x-plain',
								layout : 'form'
							}
						});
			}
		});

Ext.algorithm.infoWin = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.algorithm.infoForm(this);
				Ext.algorithm.infoWin.superclass.constructor.call(this, {
							width : 500,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							items : this.form,
							buttons : [{
										text : '保存',
										id : 'algorithmInfoWinSave',
										iconCls : 'save',
										handler : this.onSave,
										scope : this
									}, {
										text : '取消',
										id : 'algorithmInfoWinCancel',
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
					var algorithm = form.getValues();
					Ext.eu.ajax(path + '/wbb/updateAlgorithm.do', {
								algorithm : Ext.encode(algorithm)
							}, function(resp) {
								Ext.ux.Toast.msg('信息', '保存成功');
								this.app.getStore().reload();
								this.close();
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});

Ext.algorithm.cfgForm = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;

				this.items = [{
							xtype : 'hidden',
							id : 'id'
						}, {
							xtype : 'fieldset',
							columnWidth : 1,
							title : '迭代',
							autoScroll : false,
							style : 'padding : 5',
							height : 60,
							items : [{
										fieldLabel : '迭代值',
										xtype : 'numberfield',
										decimalPrecision : 0,
										name : 'iterator',
										anchor : '100%',
										allowBlank : false
									}]
						}, {
							xtype : 'fieldset',
							columnWidth : 1,
							title : '极小值',
							autoScroll : false,
							height : 60,
							layout : 'column',
							style : 'padding : 5',
							items : [{
										columnWidth : .5,
										labelWidth : 100,
										baseCls : 'x-plain',
										layout : 'form',
										items : [{
													fieldLabel : '用水单元极小值',
													xtype : 'numberfield',
													decimalPrecision : 0,
													name : 'wuMinValue',
													anchor : '100%',
													allowBlank : false
												}]
									}, {
										columnWidth : .5,
										style : 'margin-left : 5',
										labelWidth : 120,
										baseCls : 'x-plain',
										layout : 'form',
										items : [{
													fieldLabel : '处理单元极大值倍数',
													xtype : 'numberfield',
													decimalPrecision : 0,
													name : 'hucMaxTimes',
													anchor : '100%',
													allowBlank : false
												}]
									}]
						}];

				Ext.algorithm.cfgForm.superclass.constructor.call(this, {
							region : 'center',
							labelWidth : 60,
							baseCls : 'x-plain',
							autoScroll : true,
							layout : 'column',
							style : 'padding : 5',
							defaults : {
								baseCls : 'x-plain',
								layout : 'form'
							}
						});
			}
		});

Ext.algorithm.cfgWin = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.algorithm.cfgForm(this);
				Ext.algorithm.cfgWin.superclass.constructor.call(this, {
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
					var algorithm = form.getValues();
					Ext.eu.ajax(path + '/wbb/updateAlgorithm.do', {
								algorithm : Ext.encode(algorithm)
							}, function(resp) {
								Ext.ux.Toast.msg('信息', '保存成功');
								this.app.getStore().reload();
								this.close();
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});

Ext.algorithm.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.sortNode = null;
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryAlgorithm.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'name', 'statement', 'remark',
									'iterator', 'wuMinValue', 'hucMaxTimes',
									'crTime'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								start : 0,
								limit : 20
							},
							listeners : {
								'beforeload' : function() {
									Ext.apply(this.getStore().baseParams,
											this.app.queryPanel
													.getQueryParams());
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
									}, {
										header : '算法名称',
										dataIndex : 'name'
									}, {
										header : '算法描述',
										dataIndex : 'statement'
									}, {
										header : '备注',
										dataIndex : 'remark'
									}, {
										header : '创建时间',
										dataIndex : 'crTime'
									}]
						});

				// 菜单条
				this.tbar = new Ext.Toolbar([{
							xtype : 'button',
							iconCls : 'eye',
							text : '查看详情',
							handler : this.onCheck,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'modify',
							text : '修改详情',
							handler : this.onModify,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'cog',
							text : '配置',
							handler : this.onCfg,
							scope : this
						}]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.algorithm.grid.superclass.constructor.call(this, {
							region : 'center',
							loadMask : 'loading...',
							columnLines : true,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							}
						});
			},
			onCheck : function(btn) {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要查看的记录！");
					return;
				}
				if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条记录！");
					return;
				}
				this.algorithm = selects[0].data;
				var win = new Ext.algorithm.infoWin(this);
				var name = win.form.getForm().findField('name');
				name.setValue(this.algorithm.name);
				name.setDisabled(true);
				var statement = win.form.getForm().findField('statement');
				statement.setValue(this.algorithm.statement);
				statement.setDisabled(true);
				var remark = win.form.getForm().findField('remark');
				remark.setValue(this.algorithm.remark);
				remark.setDisabled(true);
				win.setTitle('查看算法详情', 'eye');
				var saveBtn = Ext.getCmp('algorithmInfoWinSave');
				var cancelBtn = Ext.getCmp('algorithmInfoWinCancel');
				saveBtn.hide();
				cancelBtn.setText('关闭');
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
				this.algorithm = selects[0].data;
				var win = new Ext.algorithm.infoWin(this);
				win.form.getForm().findField('id').setValue(this.algorithm.id);
				win.form.getForm().findField('name')
						.setValue(this.algorithm.name);
				win.form.getForm().findField('statement')
						.setValue(this.algorithm.statement);
				win.form.getForm().findField('remark')
						.setValue(this.algorithm.remark);
				win.setTitle('修改算法详情', 'modify');
				win.show();
			},
			onCfg : function(btn) {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要配置的记录！");
					return;
				}
				if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条记录！");
					return;
				}
				this.algorithm = selects[0].data;
				var win = new Ext.algorithm.cfgWin(this);
				win.form.getForm().findField('id').setValue(this.algorithm.id);
				win.form.getForm().findField('iterator')
						.setValue(this.algorithm.iterator);
				win.form.getForm().findField('wuMinValue')
						.setValue(this.algorithm.wuMinValue);
				win.form.getForm().findField('hucMaxTimes')
						.setValue(this.algorithm.hucMaxTimes);
				win.setTitle('算法配置', 'cog');
				win.show();
			}
		});

Ext.algorithm.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							labelWidth : 60,
							items : [{
										xtype : 'textfield',
										fieldLabel : '算法名称',
										name : 'name',
										anchor : '90%'
									}]
						}, {
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
										},
										scope : this
									}]
						}];
				// panel定义
				Ext.algorithm.queryPanel.superclass.constructor.call(this, {
							id : 'algorithmQueryPanel',
							region : 'north',
							height : 40,
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
				return this.getForm().getValues();
			}
		});

/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var algorithmView = function() {
	this.queryPanel = new Ext.algorithm.queryPanel(this);
	this.grid = new Ext.algorithm.grid(this);
	return new Ext.Panel({
				id : 'algorithmView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '水平衡算法管理',
				layout : 'border',
				items : [this.queryPanel, this.grid]
			})
}
