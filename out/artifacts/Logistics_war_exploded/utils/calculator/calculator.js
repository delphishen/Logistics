Ext.namespace("Ext.calculator");

Ext.calculator.panel = Ext.extend(Ext.Panel, {
	constructor : function(app) {
		this.app = app;
		this.display = new Ext.Panel({
					width : '100%',
					html : '<div id="display" style="text-align:right;'
							+ 'width:100%;height:60px;background:white"></div>'
				});
		this.showAry = new Array();
		this.dataAry = new Array();
		this.displaySet = {
			xtype : 'fieldset',
			height : 75,
			columnWidth : 1,
			title : '显示区',
			layout : 'column',
			style : 'padding : 5;margin : 0 2 0 0',
			defaults : {
				baseCls : 'x-plain',
				layout : 'form'
			},
			items : [this.display],
			scope : this
		}
		this.importSet = {
			xtype : 'fieldset',
			columnWidth : .2,
			height : 300,
			title : '引用区',
			autoScroll : true,
			layout : 'column',
			anchor : '100%',
			style : 'padding : 5;margin : 5 5 0 0',
			defaults : {
				baseCls : 'x-plain',
				layout : 'form'
			},
			items : [{
				columnWidth : 1,
				items : [{
							style : 'margin : 20 0 0 0',
							height : 30,
							xtype : 'button',
							text : '指标参数',
							iconCls : 'zoom',
							anchor : '100%',
							handler : this.selectParam,
							scope : this
						}, {
							style : 'margin : 20 0 0 0',
							height : 30,
							xtype : 'button',
							text : '关键指标',
							iconCls : 'zoom',
							anchor : '100%',
							hidden : this.app.app.state == 'qp'
									|| this.app.app.state == 'cq'
									? false
									: true,
							handler : this.selectQuota,
							scope : this
						}, {
							style : 'margin : 20 0 0 0',
							height : 30,
							xtype : 'button',
							text : '结论参数',
							iconCls : 'zoom',
							anchor : '100%',
							handler : this.selectRp,
							hidden : this.app.app.state == 'jq' ? false : true,
							scope : this
						}]
			}]
		}
		this.logicSet = {
			xtype : 'fieldset',
			columnWidth : .2,
			height : 300,
			title : '逻辑区',
			autoScroll : true,
			layout : 'column',
			anchor : '100%',
			style : 'padding : 5;margin : 5 5 0 5',
			defaults : {
				baseCls : 'x-plain',
				layout : 'form'
			},
			items : [{
						columnWidth : .5,
						items : [{
									style : 'margin : 40 0 20 0',
									height : 30,
									xtype : 'button',
									text : '&gt;',
									handler : function(btn, event) {
										this.append(btn, this.showAry);
									},
									anchor : '98%',
									scope : this
								}, {
									style : 'margin : 20 0 20 0',
									height : 30,
									xtype : 'button',
									text : '≥',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '98%',
									scope : this
								}, {
									style : 'margin : 20 0 20 0',
									height : 30,
									xtype : 'button',
									text : '=',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '98%',
									scope : this
								}, {
									style : 'margin : 20 0 20 0',
									height : 30,
									xtype : 'button',
									text : 'and',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '98%',
									scope : this
								}]
					}, {
						columnWidth : .5,
						items : [{
									style : 'margin : 40 0 20 0',
									height : 30,
									xtype : 'button',
									text : '&lt;',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '98%',
									scope : this
								}, {
									style : 'margin : 20 0 20 0',
									height : 30,
									xtype : 'button',
									text : '≤',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '98%',
									scope : this
								}, {
									style : 'margin : 20 0 20 0',
									height : 30,
									xtype : 'button',
									text : '≠',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '98%',
									scope : this
								}, {
									style : 'margin : 20 0 20 0',
									height : 30,
									xtype : 'button',
									text : 'or',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '98%',
									scope : this
								}]
					}]
		}
		this.numberSet = {
			xtype : 'fieldset',
			columnWidth : .6,
			title : '算术区',
			height : 300,
			layout : 'column',
			anchor : '100%',
			style : 'padding : 5;margin : 5 0 0 5',
			defaults : {
				baseCls : 'x-plain',
				layout : 'form'
			},
			items : [{
						// 第一列
						columnWidth : .2,
						items : [{
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '!',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'sin',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'cos',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'tan',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'ln(',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'lg(',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}]
					}, {
						// 第二列
						columnWidth : .2,
						items : [{
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '^',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '(',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '7',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '4',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '1',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '0',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}]
					}, {
						// 第三列
						columnWidth : .2,
						items : [{
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '√',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : ')',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '8',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '5',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '2',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '.',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}]
					}, {
						// 第四列
						columnWidth : .2,
						items : [{
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'π',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'e',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '9',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '6',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '3',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									hidden : true,
									text : '=',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}]
					}, {
						// 第五列
						columnWidth : .2,
						items : [{
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'C',
									handler : function(btn, event) {
										this.showAry = [];
										this.dataAry = [];
										$('#display').html('');
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : 'DEL',
									handler : function(btn, event) {
										var id = this.dataAry[this.dataAry.length
												- 1];
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '/',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '*',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '-',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}, {
									style : 'margin : 5',
									xtype : 'button',
									height : 40,
									text : '+',
									handler : function(btn, event) {
										this.append(btn, this.showAry,
												this.dataAry);
									},
									anchor : '100%',
									scope : this
								}]
					}]
		}
		this.items = [this.displaySet, this.importSet, this.logicSet,
				this.numberSet];
		Ext.calculator.panel.superclass.constructor.call(this, {
					region : 'center',
					border : true,
					baseCls : 'x-plain',
					layout : 'column',
					style : 'padding : 5'
				});
	},
	importQuota : function(btn) {
		var win = new Ext.szmxSelector.win(this);
		win.show();
	},
	append : function(btn, showAry, dataAry) {
		var text = btn.text;
		if (text == '&lt;') {
			this.showAry.push(text);
			text = '<';
			this.dataAry.push(text);
		} else if (text == '&gt;') {
			this.showAry.push(text);
			text = '>';
			this.dataAry.push(text);
		} else if (text == '=') {
			this.showAry.push(text);
			text = '==';
			this.dataAry.push(text);
		} else if (text == '≤') {
			this.showAry.push(text);
			text = '<=';
			this.dataAry.push(text);
		} else if (text == '≥') {
			this.showAry.push(text);
			text = '>=';
			this.dataAry.push(text);
		} else if (text == '≠') {
			this.showAry.push(text);
			text = '!=';
			this.dataAry.push(text);
		} else if (text == 'lg(') {
			this.showAry.push(text);
			text = 'Math.log10(';
			this.dataAry.push(text);
		} else if (text == 'ln(') {
			this.showAry.push(text);
			text = 'Math.log(';
			this.dataAry.push(text);
		} else if (text == 'e') {
			this.showAry.push(text);
			text = '2.718281828';
			this.dataAry.push(text);
		} else if (text == 'DEL') {
			this.showAry.pop();
			this.dataAry.pop();
			$('#display').html(Ext.calculator.toString(this.showAry));
			return;
		} else {
			this.showAry.push(text);
			this.dataAry.push(text);
		}

		$('#display').html(Ext.calculator.toString(this.showAry));
	},
	selectParam : function(btn) {
		new qpSelector(function(id, name) {
					this.dataAry.push('{qp#' + id + '}');
					this.showAry.push(name);
					$('#display').html(Ext.calculator.toString(this.showAry));
				}, true, this)
	},
	selectQuota : function(btn) {
		var kqId = this.app.app.scope.kqId;
		var type = this.app.app.scope.type;
		if (kqId && kqId != '') {
			this.kqId = kqId;
		}
		if (type && type != '') {
			this.type = type;
		}
		new kqEvolveSelector(function(ary) {
					this.showAry.push(ary[0].chName);
					this.dataAry.push('{ke#' + ary[0].id + '}');
					$('#display').html(Ext.calculator.toString(this.showAry));
				}, true, this);

	},
	selectRp : function(btn) {
		new rpSelector(function(id, name) {
					this.showAry.push(name);
					this.dataAry.push('{rp#' + id + '}');
					$('#display').html(Ext.calculator.toString(this.showAry));
				}, true, this)
	}
});

Ext.calculator.toString = function(ary) {
	var str = '';
	for (var i = 0; i < ary.length; i++) {
		str += ary[i];
	}
	return str;
}

Ext.calculator.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.panel = new Ext.calculator.panel(this);
				Ext.calculator.win.superclass.constructor.call(this, {
							title : '计算器',
							width : 600,
							height : 480,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							layout : 'border',
							items : [this.panel],
							buttons : [{
										text : '确认',
										iconCls : 'tick',
										handler : this.onSure,
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
				var formula = $('#display').html();
				this.app.callback.call(this.app.scope, formula, Ext.calculator
								.toString(this.panel.dataAry));
				this.close();

			},
			onClose : function() {
				this.close();
			}
		});

/**
 * 初始化时需要把配置的函数、当前指标种类传入 例如 new calculator(回调函数function(显示内容，分析内容),当前域
 * ,'szd'或者'sld',已配置的函数ID)
 * 
 * @param {}
 *            callback
 * @param {}
 *            scope
 */
var calculator = function(callback, scope, state) {
	this.callback = callback;
	this.scope = scope;
	this.state = state;
	var win = new Ext.calculator.win(this);
	win.show();
}