Ext.namespace('Ext.dispatchListTree');


Ext.dispatchListTree.tree = Ext.extend(Ext.tree.TreePanel, {
	constructor : function(app) {
		this.app = app;
		// 菜单根节点
		this.root = new Ext.tree.AsyncTreeNode({
					id : '0',
					text : '任务单号',
					draggable : false,
					listeners : {
						beforechildrenrendered : function(node) {
							node.select();
							Ext.getCmp('buttonAddDispatchListView').disable();
							Ext.getCmp('buttonModifyDispatchListView').disable();
							Ext.getCmp('buttonDelDispatchListView').disable();
						}
					}
				});
		// 菜单条
		this.tbar = new Ext.Toolbar([{
					text : '刷新',
					iconCls : 'refresh',
					id : 'refreshTaskList',
					handler : this.onRefresh,
					scope : this
				}]);

		Ext.dispatchListTree.tree.superclass.constructor.call(this, {
					region : 'west',
					width : '16%',
					animate : true,
					autoScroll : true,
					enableDD : false,// 是否支持拖拽效果
					containerScroll : true,// 是否支持滚动条
					rootVisible : true,// 是否显示根节点
					loader : new Ext.tree.TreeLoader({
								dataUrl : path + '/logistics/getTreeAllTaskList.do',
								baseParams : {dispatchersID:isAdmin == 1 ? '' : loginEmpID}
							}),
					listeners : {
						click : function(node, event) {
							if (node.id == 0) {
								Ext.getCmp('buttonAdd').disable();
							} else if (node.id == 'systemnode') {
								Ext.getCmp('buttonAddDispatchListView').disable();
								Ext.getCmp('buttonModifyDispatchListView').disable();
								Ext.getCmp('buttonDelDispatchListView').disable();
							} else {
								Ext.getCmp('buttonAddDispatchListView').enable();
							}
							Ext.getCmp('buttonModifyDispatchListView').disable();
							Ext.getCmp('buttonDelDispatchListView').disable();
						//	alert(node.attributes.taskID);
							this.app.grid.treeTaskID = node.attributes.taskID;
							this.app.grid.getStore().load();
						},
						scope : this
					}
				});
		this.expandAll();
	},
	
	
	onRefresh : function() {
		this.getRootNode().reload();
		
	}
});