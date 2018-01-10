Ext.namespace("Ext.kqNameUtil");

Ext.kqNameUtil.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		this.displayPanel = new Ext.Panel({
			fieldLabel : '呈现形式',
			width : '100%',
			html : '<div id="quotaDisplay" style="padding:3;width:100%;height:20px;background:white"></div>',
			listeners : {
				'afterrender' : function() {
					if ($('#enName').html() && $('#enName').html() != '') {
						$('#quotaDisplay').html($('#enName').html());
					}
				},
				scope : this
			}
		});
		this.strAry = new Array();
		this.zbState = 0;
		this.index = 0;
		this.radio = new Ext.form.RadioGroup({
					items : [{
								boxLabel : "正常",
								name : "xs",
								checked : true,
								inputValue : 0,
								listeners : {
									'check' : function(checkbox, checked) {
										var form = this.getForm();
										if (checked) {
											form.findField('input')
													.setValue('');
											this.zbState = 0;
											this.index = this.strAry.length;
										}
									},
									scope : this
								}
							}, {
								boxLabel : "上标",
								name : "xs",
								inputValue : 1,
								listeners : {
									'check' : function(checkbox, checked) {
										var form = this.getForm();
										if (checked) {
											form.findField('input')
													.setValue('');
											this.zbState = 1;
											this.index = this.strAry.length;
										}
									},
									scope : this
								}
							}, {
								boxLabel : "下标",
								name : "xs",
								inputValue : 2,
								listeners : {
									'check' : function(checkbox, checked) {
										var form = this.getForm();
										if (checked) {
											form.findField('input')
													.setValue('');
											this.zbState = 2;
											this.index = this.strAry.length;
										}
									},
									scope : this
								}
							}],
					scope : this
				});
		this.items = [{
			columnWidth : 1,
			items : [this.displayPanel, {
				fieldLabel : '输入框',
				xtype : 'textfield',
				id : 'input',
				anchor : '100%',
				enableKeyEvents : true,
				listeners : {
					'keyup' : function(field, e) {
						var value = field.getValue();
						if (this.zbState == 1) {
							if (this.strAry.length > this.index) {
								this.strAry.pop();
							}
							this.strAry.push('<sup>' + value + '</sup>');
							$('#quotaDisplay').html(Ext.kqNameUtil
									.toString(this.strAry));
						} else if (this.zbState == 2) {
							if (this.strAry.length > this.index) {
								this.strAry.pop();
							}
							this.strAry.push('<sub>' + value + '</sub>');
							$('#quotaDisplay').html(Ext.kqNameUtil
									.toString(this.strAry));
						} else {
							if (this.strAry.length > this.index) {
								this.strAry.pop();
							}
							this.strAry.push(value)
							$('#quotaDisplay').html(Ext.kqNameUtil
									.toString(this.strAry));
						}
					},
					scope : this
				}
			}, this.radio]
		}];

		Ext.kqNameUtil.form.superclass.constructor.call(this, {
					region : 'center',
					height : 32,
					labelWidth : 60,
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

Ext.kqNameUtil.toString = function(ary) {
	var str = '';
	for (var i = 0; i < ary.length; i++) {
		str += ary[i];
	}
	return str
}

Ext.kqNameUtil.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.kqNameUtil.form(this);
				Ext.kqNameUtil.win.superclass.constructor.call(this, {
							title : '指标英文命名器',
							width : 300,
							height : 160,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							layout : 'border',
							items : [this.form],
							buttons : [{
										text : '确定',
										iconCls : 'tick',
										handler : this.onSure,
										scope : this
									}, {
										text : '清空',
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
				this.app.callback.call(this.app.scope, $('#quotaDisplay')
								.html());
				this.close();
			},
			onReset : function(btn) {
				this.form.getForm().reset();
				$('#quotaDisplay').html('');
				this.form.strAry = [];
				this.form.zbState = 0;
				this.form.index = 0;
			},
			onClose : function() {
				this.close();
			}
		});

var kqNameUtil = function(callback, scope) {
	this.callback = callback;
	this.scope = scope;
	var win = new Ext.kqNameUtil.win(this);
	win.show();
}