Ext.namespace("Ext.right");

Ext.right.roleGrid = Ext.extend(Ext.grid.GridPanel, {
			constructor : function(app) {
				this.app = app;
				this.ds = new Ext.data.JsonStore({
							url : path + '/system/queryRole.do',
							root : 'rows',
							totalProperty : 'results',
							idProperty : 'id',
							fields : ['id', 'name', 'remark'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								start : 0,
								limit : 20
							}
						});
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				this.cm = new Ext.grid.ColumnModel({
							defaults : {
								sortable : true
							},
							columns : [new Ext.grid.RowNumberer(), {
										header : 'id',
										dataIndex : 'id',
										hidden : true
									}, {
										header : '姓名',
										dataIndex : 'name'
									}, {
										header : '备注',
										dataIndex : 'remark'
									}]
						});
				Ext.right.roleGrid.superclass.constructor.call(this, {
							title : '角色列表',
							// iconCls : iconCls,
							region : 'west',
							clicksToEdit : 1,
							viewConfig : {
								forceFit : true
							},
							loadMask : true,
							columnLines : true,
							width : 500
						});
				this.on('rowclick', function(grid, rowIndex) {
							var record = grid.getStore().getAt(rowIndex);
							this.setTitle('授权对象:[' + record.get('name') + ']');
							this.app.rightTree.setRoleId(record.get('id'));
							Ext.eu.ajax(path + '/system/findRight.do', {
										roleId : record.get('id')
									}, function(resp) {
										var arr = Ext.decode(resp.responseText);
										this.app.rightTree.onChecked(arr);
									}, this);

						}, this);
			}
		});
Ext.right.rightTree = Ext.extend(Ext.tree.TreePanel, {
			constructor : function(app) {
				this.roleId = '';
				this.app = app;
				// 菜单根节点
				this.root = new Ext.tree.AsyncTreeNode({
							text : '所有菜单',
							draggable : false,
							id : '0'
						});
				this.tbar = new Ext.Toolbar(['-', {
							text : '保存',
							iconCls : 'save',
							id : 'rightSave',
							handler : this.onSave,
							scope : this
						}, '-', {
							text : '刷新',
							iconCls : 'refresh',
							id : 'refresh',
							handler : this.onRefresh,
							scope : this
						}]);

				Ext.right.rightTree.superclass.constructor.call(this, {
							region : 'center',
							id : 'rightTree',
							title : '功能列表',
							iconCls : 'vcard',
							checkModel : 'cascade',
							animate : true,
							autoScroll : true,
							enableDD : false,// 是否支持拖拽效果
							containerScroll : true,// 是否支持滚动条
							rootVisible : false,// 是否显示根节点
							loader : new Ext.tree.TreeLoader({
										dataUrl : path
												+ '/system/buildRight.do',
										baseParams : {},
										baseAttrs : {
											uiProvider : Ext.ux.tree.TreeCheckNodeUI
										}
									})
						});
				this.expandAll();
			},
			onSave : function() {
				if (this.roleId == '') {
					Ext.ux.Toast.msg('信息', '请先选择授权对象');
					return;
				}
				var nodes = this.getChecked();
				if (nodes.length == 0) {
					Ext.ux.Toast.msg('信息', '请选择权限');
					return;
				}
				var array = new Array();
				for (var i = 0; i < nodes.length; i++) {
					var object = new Object();
					object.roleId = this.roleId;
					object.menuId = nodes[i].id;
					array.push(object);
				}
				var params = {
					rights : Ext.encode(array)
				};
				Ext.eu.ajax(path + '/system/saveRight.do', params, function(
								resp) {
							Ext.ux.Toast.msg('信息', '保存成功');
						}, this);
			},
			onRefresh : function() {
				this.setTitle('请选择授权对象');
				this.setRoleId('');
				this.root.reload();
				this.expandAll();
			},
			onUnChecked : function() {
				var nodes = this.getChecked();
				for (var i = 0; i < nodes.length; i++) {
					// 设置UI状态为未选中状态
					nodes[i].getUI().toggleCheck(false);
				}
			},
			onChecked : function(tr) {
				this.onUnChecked();
				for (var i = 0; i < tr.length; i++) {
					var nodeId = '';
					if (tr[i].menuId != '') {
						nodeId = tr[i].menuId;
					} else {
						nodeId = tr[i].btnId;
					}
					var node = this.getNodeById(nodeId);
					if (node.isLeaf())
						node.getUI().toggleCheck(true);
				}
			},
			setRoleId : function(id) {
				this.roleId = id;
			}
		});

/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var rightView = function() {
	this.roleGrid = new Ext.right.roleGrid(this);
	this.rightTree = new Ext.right.rightTree(this);
	return new Ext.Panel({
				id : 'rightView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '权限管理',
				layout : 'border',
				items : [this.roleGrid, this.rightTree]
			})
}
