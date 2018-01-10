Ext.namespace('Ext.cqEvaRate');

Ext.cqEvaRate.grid = Ext.extend(Ext.grid.EditorGridPanel, {
			record : Ext.data.Record.create([{
						name : 'id'
					}, {
						name : 'temperature'
					}, {
						name : 'rate'
					}]),
			constructor : function(app) {
				this.app = app;
				// 数据源
				this.ds = new Ext.data.JsonStore({
							url : path + '/wbb/queryCqEvaRate.do',
							idProperty : 'id',
							fields : ['id', 'temperature', 'rate'],
							autoDestroy : true,
							autoLoad : true,
							baseParams : {}
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
							/**
							 * 'id', 'kqId', 'kqSortId', 'kqSortName', 'name',
							 * 'type', 'showFormula', 'realFormula'
							 */
							columns : [new Ext.grid.RowNumberer(), this.sm, {
										header : 'id',
										dataIndex : 'id',
										hidden : true
									}, {
										header : '温度',
										dataIndex : 'temperature',
										editor : {
											xtype : 'numberfield',
											decimalPrecision : 4,
											selectOnFocus : true
										}
									}, {
										header : '蒸发系数',
										dataIndex : 'rate',
										editor : {
											xtype : 'numberfield',
											decimalPrecision : 4,
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
						}, '->', {
							xtype : 'button',
							iconCls : 'delete',
							text : '删除',
							handler : this.onDelete,
							scope : this
						}]);
				// 构造
				Ext.cqEvaRate.grid.superclass.constructor.call(this, {
							region : 'center',
							loadMask : 'loading...',
							columnLines : true,
							clicksToEdit : 1,
							stripeRows : true,
							viewConfig : {
								forceFit : true
							}
						});
			},
			onAdd : function(btn) {
				var record = new this.record({
							id : '',
							temperature : '',
							rate : ''
						});
				this.getStore().add(record);
			},
			onDelete : function() {
				var selects = Ext.eu.getSelects(this);
				if (selects.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var cqEvaRates = Array();
				for (var i = 0; i < selects.length; i++) {
					var cqEvaRate = {
						id : selects[i].data.id
					}
					cqEvaRates.push(cqEvaRate);
				}
				Ext.Msg.confirm('删除操作', '确定要删除所选记录吗?', function(btn) {
							if (btn == 'yes') {
								Ext.eu.ajax(path + '/wbb/deleteCqEvaRate.do', {
											cqEvaRates : Ext.encode(cqEvaRates)
										}, function(resp) {
											Ext.ux.Toast.msg('信息', '删除成功');
											this.getStore().reload();
										}, this);
							}
						}, this);
			},
			onSave : function(btn) {
				btn.setDisabled(true);
				var records = this.getStore().getRange();
				var cqEvaRates = new Array();
				for (var i = 0; i < records.length; i++) {
					var id = '';
					var temperature = records[i].data.temperature;
					var rate = records[i].data.rate;
					if (temperature !== '' && rate !== '') {
						var cqEvaRate = {
							id : id,
							temperature : temperature,
							rate : rate
						};
						cqEvaRates.push(cqEvaRate);
					}
				}
				Ext.eu.ajax(path + '/wbb/saveCqEvaRate.do', {
							cqEvaRates : Ext.encode(cqEvaRates)
						}, function(resp) {
							Ext.ux.Toast.msg('信息', '保存成功');
							// 清空变更记录
							this.getStore().reload();
							btn.setDisabled(false);
						}, this);
			}
		});