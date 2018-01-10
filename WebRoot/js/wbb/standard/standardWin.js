Ext.namespace('Ext.standard');

Ext.standard.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;

		// 种类下拉树
		this.sortCombo = new Ext.ex.TreeCombo({
			fieldLabel : '筛选类型',
			name : 'filterSortName',
			submitValue : false,
			allowBlank : false,
			anchor : '98%',
			url : path + '/wbb/buildTreeStandardFilterSort.do',
			listeners : {
				'expand' : function(combo) {
					var filterSortId = this.getForm().findField('filterSortId').value;
					if (typeof(filterSortId) != 'undefined') {
						combo.selectNode(filterSortId);
					}
					combo.renderTree();
				},
				'select' : function(combo, node) {
					if (node.attributes.type == 0 || !node.leaf) {
						return false;
					} else {
						this.getForm().findField('filterSortId')
								.setValue(node.id);
						this.getForm().findField('filterSortName')
								.setValue(node.text);
						combo.collapse();
					}
				},
				scope : this
			}
		});
		this.belongCombo = new Ext.form.ComboBox({
					fieldLabel : '标准类别22',
					name : 'belongSortName',
					xtype : 'combo',
					anchor : '100%',
					submitValue : false,
					editable : false,
					mode : 'local',
					triggerAction : 'all',
					lazyRender : true,
					selectOnFocus : true,
					allowBlank : false,
					store : Ext.getCmp('standardQueryPanel').getForm()
							.findField('belongName').getStore(),
					displayField : 'name',
					valueField : 'id',
					listeners : {
						'select' : function(combo, record) {
							this.getForm().findField('belongSortId')
									.setValue(record.data.id);
						},
						scope : this
					},
					scope : this
				});

		this.items = [{
					xtype : 'hidden',
					id : 'id'
				}, {
					xtype : 'hidden',
					id : 'filterSortId'
				}, {
					xtype : 'hidden',
					id : 'belongSortId'
				}, {
					columnWidth : .5,
					labelWidth : 60,
					items : [{
								fieldLabel : '标准名称',
								xtype : 'textfield',
								name : 'name',
								anchor : '98%',
								allowBlank : false
							}, this.sortCombo]
				}, {
					columnWidth : .5,
					labelWidth : 60,
					items : [{
								fieldLabel : '标准号',
								xtype : 'textfield',
								name : 'number',
								anchor : '100%'
							}, this.belongCombo]
				}, {
					columnWidth : 1,
					labelWidth : 60,
					items : [{
								fieldLabel : '备注',
								xtype : 'textarea',
								name : 'remark',
								anchor : '100%'
							}]
				}];

		Ext.standard.form.superclass.constructor.call(this, {
					region : 'center',
					labelWidth : 60,
					baseCls : 'x-plain',
					autoScroll : true,
					layout : 'column',
					style : 'padding : 5',
					defaults : {
						baseCls : 'x-plain',
						layout : 'form'
					}
				});
	}
});

Ext.standard.win = Ext.extend(Ext.Window, {
			constructor : function(app) {
				this.app = app;
				this.form = new Ext.standard.form(this);
				Ext.standard.win.superclass.constructor.call(this, {
							width : 500,
							plain : true,
							showLock : true,
							modal : true,
							resizable : false,
							buttonAlign : 'center',
							items : this.form,
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
				var form = this.form.getForm();
				if (form.isValid()) {
					btn.setDisabled(true);
					var standard = form.getValues();
					Ext.eu.ajax(path + '/wbb/saveStandard.do', {
								standard : Ext.encode(standard)
							}, function(resp) {
								var res = Ext.decode(resp.responseText);
								if (res.label) {
									Ext.ux.Toast.msg('信息', '保存成功');
									this.app.getStore().reload();
									this.close();
								} else {
									Ext.ux.Toast.msg('提示', '保存的记录存在重名');
									btn.setDisabled(false);
								}
							}, this);
				}
			},
			onClose : function() {
				this.close();
			}
		});