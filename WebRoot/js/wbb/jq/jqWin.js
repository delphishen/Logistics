Ext.namespace('Ext.jq');

Ext.jq.form = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;

				this.radio = new Ext.form.RadioGroup({
							fieldLabel : '最优结果',
							items : [{
										boxLabel : '越大值',
										name : 'result',
										checked : true,
										inputValue : 1,
										listeners : {
											check : function(checkbox, checked) {
												if (checked) {
												}
											}
										}
									}, {
										boxLabel : '越小值',
										inputValue : 2,
										name : 'result',
										listeners : {
											check : function(checkbox, checked) {
												if (checked) {
												}
											}
										}
									}],
							scope : this
						});

				this.items = [{
							xtype : 'hidden',
							id : 'id'
						}, {
							xtype : 'hidden',
							id : 'realFormula'
						}, {
							columnWidth : 1,
							labelWidth : 60,
							items : [{
										fieldLabel : '名称',
										xtype : 'textfield',
										name : 'name',
										anchor : '100%',
										allowBlank : false
									}]
						}, {
							columnWidth : .8,
							labelWidth : 60,
							items : [{
										fieldLabel : '计算关系',
										xtype : 'textfield',
										name : 'showFormula',
										readOnly : true,
										style : 'background:#E6E6E6',
										anchor : '98%'
									}]
						}, {
							columnWidth : .2,
							items : [{
								xtype : 'button',
								text : '配置',
								iconCls : 'cog',
								anchor : '100%',
								listeners : {
									'click' : function() {
										new calculator(function(showFormula,
														realFormula) {
													this
															.getForm()
															.findField('showFormula')
															.setValue(showFormula);
													this
															.getForm()
															.findField('realFormula')
															.setValue(realFormula);
												}, this, 'jq')
									},
									scope : this
								}
							}]
						}, {
							columnWidth : 1,
							labelWidth : 60,
							items : [{
										fieldLabel : '备注',
										xtype : 'textarea',
										name : 'remark',
										anchor : '100%'
									}]
						}];

				Ext.jq.form.superclass.constructor.call(this, {
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

Ext.jq.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.jq.form(this);
				Ext.jq.win.superclass.constructor.call(this, {
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
					var jq = form.getValues();
					Ext.eu.ajax(path + '/wbb/saveJq.do', {
								jq : Ext.encode(jq)
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