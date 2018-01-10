Ext.namespace("Ext.role");

Ext.role.grid = Ext.extend(Ext.grid.EditorGridPanel, {
			record : Ext.data.Record.create([{
						name : 'id'
					}, {
						name : 'name'
					}, {
						name : 'remark'
					}, {
						name : 'isAdmin'
					}]),
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/system/queryRole.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'name', 'isAdmin', 'remark'],
							autoDestroy : true,
							autoLoad : true,
							pruneModifiedRecords : true,
							baseParams : {
								start : 0,
								limit : 20
							},
							listeners : {
								'beforeload' : function() {
									Ext.apply(this.getStore().baseParams,
											this.app.queryPanel
													.getQueryParams());
								},
								scope : this
							}
						});
				// 选择框
				this.sm = new Ext.grid.CheckboxSelectionModel({
							singleSelect : false
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
										header : 'isAdmin',
										dataIndex : 'isAdmin',
										hidden : true
									}, {
										header : '角色名称',
										dataIndex : 'name',
										editor : {
											xtype : 'textfield',
											allowBlank : false,
											maxLength : 10,
											maxLengthText : '姓名不能大于10个字符',
											selectOnFocus : true
										}
									}, {
										header : '备注',
										dataIndex : 'remark',
										editor : {
											xtype : 'textarea',
											selectOnFocus : true
										}
									}]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							xtype : 'button',
							iconCls : 'add',
							text : '新增',
							handler : this.onAdd,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'save',
							text : '保存',
							handler : this.onSave,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'delete',
							text : '删除',
							handler : this.onDelete,
							scope : this
						}]);
				// 页码条
				this.bbar = new Ext.PagingToolbar({
							pageSize : 20,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.role.grid.superclass.constructor.call(this, {
							region : 'center',
							loadMask : 'loading...',
							columnLines : true,
							clicksToEdit : 1,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							},
							listeners : {
								'render' : function() {
									// 强制同步,comboStore加载完毕之后回调时,才加载gridStore,否则将出现第一次显示ID问题
								},
								scope : this
							}
						});
			},
			onAdd : function(btn) {
				var record = new this.record({
							id : '',
							name : '',
							remark : '',
							isAdmin : 0
						});
				this.getStore().add(record);
			},
			onSave : function(btn) {
				btn.setDisabled(true);
				var records = this.getStore().getModifiedRecords();
				var array = new Array();
				for (var i = 0; i < records.length; i++) {
					var id = records[i].data.id;
					var name = records[i].data.name;
					var isAdmin = records[i].data.isAdmin;
					var remark = records[i].data.remark;
					if (name != '') {
						var role = {
							id : id,
							name : name,
							isAdmin : isAdmin,
							remark : remark
						};
						array.push(role);
					}
				}
				Ext.eu.ajax(path + '/system/saveRole.do', {
							roles : Ext.encode(array)
						}, function(resp) {
							Ext.ux.Toast.msg('信息', '保存成功');
							// 清空变更记录
							this.getStore().rejectChanges();
							this.getStore().reload();
							btn.setDisabled(false);
						}, this);
				btn.setDisabled(false);

			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ary = Array();
				for (var i = 0; i < selects.length; i++) {
					var role = {
						id : selects[i].data.id
					};
					ary.push(role);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/system/deleteRole.do', {
											roles : Ext.encode(ary)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			}
		});

Ext.role.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							items : [{
										xtype : 'textfield',
										fieldLabel : '名称',
										id : 'roleName',
										anchor : '90%'
									}]
						}, {
							width : 65,
							items : [{
										xtype : 'button',
										id : 'roleQuery',
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
										id : 'roleReset',
										text : '清空',
										iconCls : 'reset',
										handler : function() {
											this.getForm().reset();
										},
										scope : this
									}]
						}];
				// panel定义
				Ext.role.queryPanel.superclass.constructor.call(this, {
							id : 'roleQueryPanel',
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

/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var roleView = function() {
	this.queryPanel = new Ext.role.queryPanel(this);
	this.grid = new Ext.role.grid(this);
	return new Ext.Panel({
				id : 'roleView',// 标签页ID，必须与入口方法一致，用于判断标签页是否已经打开
				title : '角色管理',
				layout : 'border',
				items : [this.queryPanel, this.grid]
			})
}
