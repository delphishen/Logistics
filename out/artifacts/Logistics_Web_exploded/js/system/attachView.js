Ext.namespace('Ext.attach');

Ext.attach.grid = Ext.extend(Ext.grid.GridPanel, {
	
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/system/queryAttach.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'realName', 'sysName', 'filePath',
									'category', 'uploadTime','link'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								isPaging : true,
								start : 0,
								limit : 20
							},
							listeners : {
								'beforeload' : function() {
									var params = this.app.queryPanel
											.getQueryParams();
									if (params != '') {
										Ext.apply(this.getStore().baseParams,
												params);																
										
										
									} else {
										Ext.ux.Toast.msg("提示", "开始时间不能大于结束时间");
										return false;
									}
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
										header : '原始名称',
										dataIndex : 'realName'
									}, {
										header : '系统名称',
										hidden : true,
										dataIndex : 'sysName'
									}, 
									{
										header : '上传时间',
										dataIndex : 'uploadTime'
									}, {
										header : '路径',
										dataIndex : 'filePath'
									}
									]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar([{
							xtype : 'button',
							iconCls : 'submit',
							text : '上传',
							handler : this.onUpload,
							scope : this
						}, {
							xtype : 'button',
							iconCls : 'arrow_down',
							text : '下载',
							handler : this.onDownload,
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
							pageSize : 40,
							displayInfo : true,
							store : this.ds
						});
				// 构造
				Ext.attach.grid.superclass.constructor.call(this, {
						//	region : 'center',
					       id:'attachGrid',
					        region : 'east',
					width : 500,
					height : '100%',
							loadMask : 'loading...',
							columnLines : true,
							clicksToEdit : 1,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							}
						});
			},
			onUpload : function(btn) {
				
				var selects = Ext.getCmp('contractGrid').getSelectionModel().getSelections();
			//	获得当前选择行信息
				// alert(selects[0].data.id);
				// Ext.apply(this.params,{link:selects[0].data.id});
				 
				
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择合同信息！");
					return false;
				}else if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条合同信息！");
					return false;
				}else{
						var dialog = AppMgr.createUploadDialog({
							callback : function(data, grid) {
								grid.getStore().load();
							},
							link:selects[0].data.id,
							scope : this
						});
							dialog.show();					
				}				
				

			},
			onDownload : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要下载的记录！");
					return;
				}
				if (selects.length > 1) {
					Ext.ux.Toast.msg("信息", "只能选择一条记录！");
					return;
				}
				var filePath = selects[0].data.filePath;
				var params = {
					filePath : filePath,
					sysName : selects[0].data.sysName,
					realName : selects[0].data.realName
				}

				window.location.href = encodeURI(path
						+ '/system/downloadAttach.do?filePath=' + filePath
						+ '&realName=' + selects[0].data.realName);
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var attachs = Array();
				for (var i = 0; i < selects.length; i++) {
					var o = {
						id : selects[i].data.id,
						filePath : selects[i].data.filePath
					};
					attachs.push(o);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/system/deleteAttach.do', {
											attachs : Ext.encode(attachs)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			}
		});

Ext.attach.queryPanel = Ext.extend(Ext.FormPanel, {
			constructor : function(app) {
				this.app = app;
				// 在column布局的制约下，从左至右每个元素依次进行form布局
				this.items = [{
							width : 200,
							labelWidth : 70,
							items : [{
										xtype : 'textfield',
										fieldLabel : '原始名称',
										id : 'realName',
										anchor : '90%'
									}]
						}, {
							width : 200,
							labelWidth : 70,
							items : [{
										xtype : 'datefield',
										fieldLabel : '开始时间',
										id : 'uploadTimeB',
										format : 'Y-m-d',
										editable : false,
										anchor : '90%'
									}]
						}, {
							width : 200,
							labelWidth : 70,
							items : [{
										xtype : 'datefield',
										fieldLabel : '结束时间',
										id : 'uploadTimeE',
										format : 'Y-m-d',
										editable : false,
										anchor : '90%',
										vtype : 'dateRange',
										dateRange : {
											begin : 'uploadTimeB',
											end : 'uploadTimeE'
										}
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
				Ext.attach.queryPanel.superclass.constructor.call(this, {
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
				var form = this.getForm();
				if (form.isValid()) {
					return form.getValues();
				} else {
					return '';
				}
			}
		});

Ext.apply(Ext.form.VTypes, {
			dateRange : function(val, field) {
				if (field.dateRange) {
					var beginId = field.dateRange.begin;
					var endId = field.dateRange.end;
					this.beginField = Ext.getCmp(beginId);
					this.endField = Ext.getCmp(endId);
					var beginDate = this.beginField.getValue();
					var endDate = this.endField.getValue();
				}
				if (beginDate <= endDate) {
					return true;
				} else {
					return false;
				}
			},
			dateRangeText : '开始时间不能大于结束时间'
		});

/**
 * 入口方法，用于定位动态加载文件
 * 
 * @return {}
 */
var attachView = function() {
	this.queryPanel = new Ext.attach.queryPanel(this);
	this.grid = new Ext.attach.grid(this);
	return new Ext.Panel({
				id : 'attachView',
				title : '附件管理',
				layout : 'border',
				items : [this.queryPanel, this.grid]
			})
}