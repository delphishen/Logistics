Ext.namespace('Ext.qp');

Ext.qp.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;

		// 种类下拉树
		this.sortCombo = new Ext.ex.TreeCombo({
					fieldLabel : '指标种类',
					name : 'sortName',
					submitValue : false,
					allowBlank : false,
					anchor : '100%',
					rootId : '0',
					url : path + '/wbb/buildTreeQpSort.do',
					listeners : {
						'expand' : function(combo) {
							var sortId = this.getForm().findField('sortId').value;
							if (typeof(sortId) != 'undefined') {
								combo.selectNode(sortId);
							}
							combo.renderTree();
						},
						'select' : function(combo, node) {
							if (node.attributes.type == 0) {
								return false;
							} else {
								this.getForm().findField('sortId')
										.setValue(node.id);
								this.getForm().findField('sortName')
										.setValue(node.text);
								combo.collapse();
							}
						},
						scope : this
					}
				});

		this.items = [{
					xtype : 'hidden',
					id : 'id'
				}, {
					xtype : 'hidden',
					id : 'sortId'
				}, {
					xtype : 'hidden',
					id : 'realFormula'
				}, {
					columnWidth : .8,
					labelWidth : 60,
					items : [{
								fieldLabel : '参数名称',
								xtype : 'textfield',
								name : 'name',
								anchor : '98%',
								allowBlank : false
							}]
				}, {
					columnWidth : .2,
					items : [{
						xtype : 'button',
						text : '引用',
						iconCls : 'cog',
						anchor : '100%',
						listeners : {
							'click' : function() {
								new kqEvolveSelector(function(ary) {
											this.getForm().findField('name')
													.setValue(ary[0].chName);
										}, true, this);
							},
							scope : this
						}
					}]
				}, {
					columnWidth : 1,
					labelWidth : 60,
					items : [this.sortCombo]
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
											this.getForm()
													.findField('showFormula')
													.setValue(showFormula);
											this.getForm()
													.findField('realFormula')
													.setValue(realFormula);
										}, this, 'qp')
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

		Ext.qp.form.superclass.constructor.call(this, {
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

Ext.qp.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.qp.form(this);
				Ext.qp.win.superclass.constructor.call(this, {
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
					var qp = form.getValues();
					Ext.eu.ajax(path + '/wbb/saveQp.do', {
								qp : Ext.encode(qp)
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