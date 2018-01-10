Ext.namespace('Ext.cq');

Ext.cq.form = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;

				this.radio = new Ext.form.RadioGroup({
							fieldLabel : '进出口',
							items : [{
										boxLabel : '进口',
										name : 'type',
										checked : true,
										inputValue : 1,
										listeners : {
											check : function(checkbox, checked) {
												if (checked) {
												}
											}
										}
									}, {
										boxLabel : '出口',
										inputValue : 2,
										name : 'type',
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
							id : 'kqSortId'
						}, {
							xtype : 'hidden',
							id : 'kqId'
						}, {
							xtype : 'hidden',
							id : 'kqEvolveId'
						}, {
							xtype : 'hidden',
							id : 'realFormula'
						}, {
							columnWidth : .8,
							labelWidth : 60,
							items : [{
										fieldLabel : '结果指标',
										xtype : 'textfield',
										name : 'name',
										submitValue : false,
										anchor : '98%',
										style : 'background:#E6E6E6',
										readOnly : true,
										// disabled : true,
										allowBlank : false
									}]
						}, {
							columnWidth : .2,
							items : [{
								xtype : 'button',
								text : '引用',
								iconCls : 'zoom',
								anchor : '100%',
								listeners : {
									'click' : function() {
										new kqSelector(function(ary) {
													this
															.getForm()
															.findField('name')
															.setValue(ary[0].chName);
													this
															.getForm()
															.findField('kqId')
															.setValue(ary[0].id);
													this
															.getForm()
															.findField('kqSortId')
															.setValue(ary[0].sortId);
												}, true, this);
									},
									scope : this
								}
							}]
						}, {
							columnWidth : 1,
							labelWidth : 60,
							items : [this.radio]
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
										this.kqId = this.getForm()
												.findField('kqId').getValue();
										this.type = this.radio.getValue().inputValue;
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
												}, this, 'cq')
									},
									scope : this
								}
							}]
						}];

				Ext.cq.form.superclass.constructor.call(this, {
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

Ext.cq.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.cq.form(this);
				Ext.cq.win.superclass.constructor.call(this, {
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
					var cq = form.getValues();
					Ext.eu.ajax(path + '/wbb/saveCq.do', {
								cq : Ext.encode(cq)
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