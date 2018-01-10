Ext.namespace('Ext.cqTree');

Ext.cqTree.tree = Ext.extend(Ext.tree.TreePanel, {
			constructor : function(app) {
				this.app = app;
				// 菜单根节点
				this.root = new Ext.tree.AsyncTreeNode({
							id : '0',
							text : '指标种类',
							draggable : false
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							text : '刷新',
							iconCls : 'refresh',
							handler : this.onRefresh,
							scope : this
						}]);

				Ext.cqTree.tree.superclass.constructor.call(this, {
							region : 'west',
							width : '15%',
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
								click : function(node, event) {
									if (node.id == 0) {
										Ext.getCmp('addCq').disable();
									} else {
										Ext.getCmp('addCq').enable();
									}
									this.app.grid.sortNode = node;
									this.app.grid.getStore().load();
								},
								scope : this
							}
						});
				this.expandAll();
			},
			onRefresh : function() {
				this.getRootNode().reload();
				this.expandAll();
			}
		});