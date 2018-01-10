Ext.namespace("Ext.kqEvolveSelector");

Ext.kqEvolveSelector.tree = Ext.extend(Ext.tree.TreePanel, {
			constructor : function(app) {
				this.app = app;
				// 菜单根节点
				this.root = new Ext.tree.AsyncTreeNode({
							id : '0',
							text : '指标种类',
							draggable : false
						});

				Ext.kqEvolveSelector.tree.superclass.constructor.call(this, {
							region : 'west',
							width : 150,
							animate : true,
							autoScroll : true,
							enableDD : false,// 是否支持拖拽效果
							containerScroll : true,// 是否支持滚动条
							rootVisible : true,// 是否显示根节点
							loader : new Ext.tree.TreeLoader({
										dataUrl : path
												+ '/wbb/buildTreeKqSort.do',
										baseParams : {}
									}),
							listeners : {
								contextmenu : {
									fn : function(node, event) {
										// 必须写，使用preventDefault方法可防止浏览器的默认事件操作发生。
										event.preventDefault();
										node.select();
										this.menu.showAt(event.getXY());
									},
									scope : this
								},
								click : function(node, event) {
									this.app.grid.sortNode = node;
									this.app.grid.getStore().load();
								},
								scope : this
							}
						});
				this.expandAll();
			}
		});

Ext.kqEvolveSelector.form = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				this.items = [{
							columnWidth : 1,
							items : [{
										fieldLabel : '已选指标',
										xtype : 'textarea',
										name : 'kqChName',
										anchor : '100%',
										readOnly : true,
										style : 'background:#E6E6E6'
									}]
						}];

				Ext.kqEvolveSelector.form.superclass.constructor.call(this, {
							region : 'south',
							height : 75,
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

Ext.kqEvolveSelector.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							labelWidth : 60,
							items : [{
										xtype : 'textfield',
										fieldLabel : '中文名称',
										name : 'chName',
										anchor : '90%'
									}]
						}, {
							width : 200,
							labelWidth : 60,
							items : [{
										xtype : 'textfield',
										fieldLabel : '英文名称',
										name : 'enName',
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
				Ext.kqEvolveSelector.queryPanel.superclass.constructor.call(
						this, {
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

Ext.kqEvolveSelector.grid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.sortNode = null;
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryKqEvolve.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'kqId', 'sortId', 'sortName',
									'chName', 'enName', 'type'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								start : 0,
								limit : 20
							},
							listeners : {
								'beforeload' : function() {
									var sortIds = new Array();
									var kqId = this.app.app.scope.kqId;
									var type = this.app.app.scope.type;
									if (this.sortNode != null) {
										if (this.sortNode.id != 0) {
											sortIds.push(this.sortNode.id);
											sortIds = this.getChildrenIds(
													sortIds, this.sortNode,
													this);
										}
										var str = "";
										for (var i = 0; i < sortIds.length; i++) {
											str += "'" + sortIds[i] + "',"
										}
										str = str.substring(0, str
														.lastIndexOf(','));
										Ext.apply(this.getStore().baseParams, {
													'sortId' : str
												});

									}
									if (kqId && kqId != '' && type
											&& type != '') {
										Ext.apply(this.getStore().baseParams, {
													'kqId' : kqId,
													'type' : type
												});
									}
									Ext.apply(this.getStore().baseParams,
											this.app.queryPanel
													.getQueryParams());
								},
								scope : this
							}
						});
				// 选择框
				this.sm = new Ext.grid.CheckboxSelectionModel({
							singleSelect : this.app.app.isSingle,
							listeners : {
								'rowselect' : function(sm, index, record) {
									var win = this.app;
									if (win.app.isSingle) {
										win.kq = new mapContainer();
									}
									win.kq.put(record.data.id, record.data);
									win.form.getForm().findField('kqChName')
											.setValue(Ext.kqEvolveSelector
													.toString(win.kq.values()));
								},
								'rowdeselect' : function(sm, index, record) {
									var win = this.app;
									win.kq.remove(record.data.id);
									win.form.getForm().findField('kqChName')
											.setValue(Ext.kqEvolveSelector
													.toString(win.kq.values()));
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
							columns : [new Ext.grid.RowNumberer(), this.sm, {
										header : 'id',
										dataIndex : 'id',
										hidden : true
									}, {
										header : 'kqId',
										dataIndex : 'kqId',
										hidden : true
									}, {
										header : 'sortId',
										dataIndex : 'sortId',
										hidden : true
									}, {
										header : '指标中文名称',
										dataIndex : 'chName'
									}, {
										header : '指标英文名称',
										dataIndex : 'enName'
									}, {
										header : '进出口',
										dataIndex : 'type',
										renderer : function(value) {
											if (value == 1) {
												return '进口';
											} else {
												return '出口';
											}
										}
									}]
						});
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.kqEvolveSelector.grid.superclass.constructor.call(this, {
							region : 'center',
							loadMask : 'loading...',
							columnLines : true,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							}
						});
			},
			getChildrenIds : function(arr, node, scope) {
				if (node.hasChildNodes()) {
					node.eachChild(function(child) {
								arr.push(child.id);
								arr.concat(scope.getChildrenIds(arr, child,
										scope));
							});
				}
				return arr;
			}
		});

Ext.kqEvolveSelector.toString = function(ary) {
	var str = '';
	for (var i = 0; i < ary.length; i++) {
		str += ary[i].chName + ',';
	}
	str = str.substring(0, str.lastIndexOf(','));
	return str;
}

Ext.kqEvolveSelector.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.kq = new mapContainer();
				this.form = new Ext.kqEvolveSelector.form(this);
				this.grid = new Ext.kqEvolveSelector.grid(this);
				this.tree = new Ext.kqEvolveSelector.tree(this);
				this.queryPanel = new Ext.kqEvolveSelector.queryPanel(this);
				Ext.kqEvolveSelector.win.superclass.constructor.call(this, {
							title : '关键指标选择器',
							width : 600,
							height : 400,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							layout : 'border',
							items : [this.form, this.grid, this.tree,
									this.queryPanel],
							buttons : [{
										text : '确定所选',
										iconCls : 'tick',
										handler : this.onSure,
										scope : this
									}, {
										text : '清空所选',
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
				this.app.callback.call(this.app.scope, this.kq.values());
				this.close();
			},
			onReset : function(btn) {
				this.form.getForm().reset();
				this.kq = new mapContainer();
			},
			onClose : function() {
				this.close();
			}
		});

var kqEvolveSelector = function(callback, isSingle, scope) {
	this.callback = callback;
	this.isSingle = isSingle;
	this.scope = scope;
	var win = new Ext.kqEvolveSelector.win(this);
	win.show();
}