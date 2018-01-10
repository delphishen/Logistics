Ext.namespace('Ext.standard');

Ext.standard.settingGrid = Ext.extend(Ext.grid.GridPanel, {
			record : Ext.data.Record.create([{
						name : 'id'
					}, {
						name : 'kqId'
					}, {
						name : 'standardId'
					}, {
						name : 'kqChName'
					}, {
						name : 'kqEnName'
					}, {
						name : 'limitType'
					}, {
						name : 'unit'
					}, {
						name : 'value'
					}]),
			constructor : function(app) {
				this.app = app;
				this.standard = this.app.app.standard;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryStandardCfg.do',
							idProperty : 'id',
							root : 'rows',
							totalProperty : 'results',
							fields : ['id', 'standardId', 'kqId', 'kqEnName',
									'kqChName', 'limitType', 'unit', 'value'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {
								start : 0,
								limit : 20
							},
							listeners : {
								'beforeload' : function() {
									Ext.apply(this.getStore().baseParams, {
												standardId : this.standard.id
											});
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
										header : 'standardId',
										dataIndex : 'standardId',
										hidden : true
									}, {
										header : 'kqId',
										dataIndex : 'kqId',
										hidden : true
									}, {
										header : '指标中文名称',
										dataIndex : 'kqChName'
									}, {
										header : '指标英文名称',
										dataIndex : 'kqEnName'
									}, {
										header : '单位',
										dataIndex : 'unit'
									}, {
										header : '限值类型',
										dataIndex : 'limitType',
										renderer : function(val) {
											if (val == 1) {
												return '限值';
											} else if (val == 2) {
												return '范围';
											}
										}
									}, {
										header : '值',
										dataIndex : 'value'
									}]
						});
				// 菜单条
				this.tbar = new Ext.Toolbar(['&nbsp;所选标准:', {
							xtype : 'textfield',
							width : 100,
							value : this.standard.name,
							disabled : true
						}, '->', {
							xtype : 'button',
							iconCls : 'add',
							text : '新增',
							handler : this.onAdd,
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
				Ext.standard.settingGrid.superclass.constructor.call(this, {
							region : 'center',
							loadMask : 'loading...',
							columnLines : true,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							}
						});
			},
			onAdd : function(btn) {
				var records = this.getStore().getRange();
				var str = '';
				for (var i = 0; i < records.length; i++) {
					str += "'" + records[i].data.kqId + "',";
				}
				this.filter = str.substring(0, str.lastIndexOf(','));
				new standardKqSelector(function(obj) {
							var record = new this.record({
										id : '',
										standardId : this.standard.id,
										kqId : obj.id,
										kqChName : obj.chName,
										kqEnName : obj.enName,
										unit : obj.unit,
										limitType : obj.limitType,
										value : obj.value
									});
							this.getStore().add(record);
						}, true, this);
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var standardCfgs = Array();
				for (var i = 0; i < selects.length; i++) {
					var standardCfg = {
						id : selects[i].data.id
					}
					standardCfgs.push(standardCfg);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/wbb/deleteStandardCfg.do',
										{
											standardCfgs : Ext
													.encode(standardCfgs)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			}
		});

Ext.standard.settingWin = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.grid = new Ext.standard.settingGrid(this);
				Ext.standard.settingWin.superclass.constructor.call(this, {
							width : 600,
							height : 400,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							layout : 'border',
							items : this.grid,
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
				var records = this.grid.getStore().getRange();
				var standardCfgs = new Array();
				for (var i = 0; i < records.length; i++) {
					if (records[i].data.value && records[i].data.value != '') {
						var standardCfg = {
							id : records[i].data.id,
							standardId : records[i].data.standardId,
							kqId : records[i].data.kqId,
							limitType : records[i].data.limitType,
							value : records[i].data.value
						}
						standardCfgs.push(standardCfg);
					}
				}
				Ext.eu.ajax(path + '/wbb/saveStandardCfg.do', {
							standardCfgs : Ext.encode(standardCfgs)
						}, function(resp) {
							Ext.ux.Toast.msg('信息', '保存成功');
							this.app.getStore().reload();
							this.close();
						}, this);
			},
			onClose : function() {
				this.close();
			}
		});