Ext.namespace('Ext.kq');

Ext.kq.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;

		this.kqPanel = new Ext.Panel({
			width : '100%',
			fieldLabel : '英文名称',
			html : '<div id="enName" style="width:100%;height:20px;background:white;padding-left:2px">'
					+ this.app.app.kq.enName + '</div>'
		});

		this.radio = new Ext.form.RadioGroup({
					fieldLabel : '归属类别',
					items : [{
								boxLabel : '进出口关系',
								checked : false,
								name : 'type',
								inputValue : 1,
								listeners : {
									check : function(checkbox, checked) {
										if (checked) {
										}
									}
								}
							}, {
								boxLabel : '进出口固定值',
								inputValue : 2,
								name : 'type',
								checked : true,
								listeners : {
									check : function(checkbox, checked) {
										if (checked) {
										}
									}
								}
							}],
					scope : this
				});
		// 种类下拉树
		this.sortCombo = new Ext.ex.TreeCombo({
					fieldLabel : '指标种类',
					name : 'sortName',
					submitValue : false,
					allowBlank : false,
					anchor : '100%',
					rootId : '0',
					url : path + '/wbb/buildTreeKqSort.do',
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
					columnWidth : 1,
					labelWidth : 60,
					items : [{
								fieldLabel : '中文名称',
								xtype : 'textfield',
								name : 'chName',
								anchor : '100%',
								allowBlank : false
							}]
				}, {
					columnWidth : .8,
					labelWidth : 60,
					items : [this.kqPanel]
				}, {
					columnWidth : .2,
					items : [{
								xtype : 'button',
								text : '配置',
								iconCls : 'cog',
								anchor : '100%',
								listeners : {
									'click' : function() {
										new kqNameUtil(function(name) {
													$('#enName').html(name);
												}, this);
									},
									scope : this
								}
							}]
				}, {
					columnWidth : 1,
					labelWidth : 60,
					items : [this.sortCombo, {
								fieldLabel : '标准单位',
								xtype : 'textfield',
								name : 'unit',
								anchor : '100%',
								allowBlank : false
							}, this.radio, {
								fieldLabel : '误差率',
								xtype : 'numberfield',
								name : 'errorRate',
								anchor : '100%'
							}, {
								fieldLabel : '备注',
								xtype : 'textarea',
								name : 'remark',
								anchor : '100%'
							}]
				}];

		Ext.kq.form.superclass.constructor.call(this, {
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

Ext.kq.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.kq.form(this);
				Ext.kq.win.superclass.constructor.call(this, {
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
					var kq = form.getValues();
					if ($('#enName').html() == '') {
						Ext.ux.Toast.msg('提示', '指标的英文名称不能为空');
						btn.setDisabled(false);
						return;
					}
					kq.enName = $('#enName').html();
					kq.enNameCs = getEnNameCs(kq.enName);
					Ext.eu.ajax(path + '/wbb/saveKq.do', {
								kq : Ext.encode(kq)
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

var getEnNameCs = function(enName) {
	var enNameCs = "";
	var reg = /<sub>.*?<\/sub>|<sup>.*?<\/sup>/g;
	var str = "SO<sub>4</sub>wewe<sup>2-</sup><sub>ce</sub>";
	var enNames = enName.replace(reg, '@$&@').split('@');
	for (var i = 0; i < enNames.length; i++) {
		var en = enNames[i];
		if (!reg.test(en) && en != '') {
			enNameCs += '<Run>' + en + '</Run>'
		} else {
			enNameCs += en;
		}
	}
	enNameCs = enNameCs.replace(/<sub>/g,
			'<Run FontSize=\"10\" BaselineAlignment=\"Subscript\">');
	enNameCs = enNameCs.replace(/<sup>/g,
			'<Run FontSize=\"10\" BaselineAlignment=\"Superscript\">');
	enNameCs = enNameCs.replace(/<\/sub>|<\/sup>/g, '</Run>');
	return enNameCs;
}