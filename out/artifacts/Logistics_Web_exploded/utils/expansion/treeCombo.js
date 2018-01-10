Ext.namespace('Ext.ex');

/**
 * 下拉树控件
 * 
 * 包含一切ComboBox属性之外，其他额外属性如下：
 * 
 * @config url : TreeLoader请求url
 * @config rootVisible : 是否显示根节点，默认为false
 * @config rootId : 根节点id
 * @config rootText : 根节点text
 * @config singleExpand : 是否一次只展开一棵树 默认为false
 * @config selectMode : 选择模式 可设置leaf或all 默认为all全部节点可选
 * @method callback : 回调方法 function(node) 入参为当前选择的node
 * @method 支持在外围提供combo的listener监听select事件，监听方法function(combo,
 *         node)，入参为combo本身和当前选中node,若配置中不提供此监听，则使用默认监听，
 *         之后可在callback方法中获取选中的node并进行所需的后期处理
 * 
 * @class Ext.ex.TreeCombo
 * @extends Ext.form.ComboBox
 */
Ext.ex.TreeCombo = Ext.extend(Ext.form.ComboBox, {
	constructor : function(cfg) {
		this.cfg = cfg || {};
		this.store = new Ext.data.SimpleStore({
					fields : [],
					data : [[]]
				});
		Ext.ex.TreeCombo.superclass.constructor.call(this, Ext.apply({
							maxHeight : 300,
							editable : false,
							mode : 'local',
							triggerAction : 'all',
							rootVisible : false,
							selectMode : 'all',
							listeners : {
								'expand' : function(combo) {
									combo.renderTree();
								},
								'select' : function(combo, node) {
									combo.setValue(node.text);
									combo.collapse();
									combo.callback.call(this, node);
								}
							}
						}, this.cfg));
	},
	initComponent : function() {
		Ext.eu.ajax(this.url, null, function(resp) {
			this.treeData = Ext.util.JSON.decode(resp.responseText);
			this.tplId = 'innerTree_' + Math.floor(Math.random() * 1000);
			this.tpl = String
					.format(
							'<tpl for="."><div id="{0}" style="height:{1}px"></div></tpl>',
							this.tplId, this.maxHeight);
			this.tree = new Ext.ex.TreeComboInner(this);
			Ext.ex.TreeCombo.superclass.initComponent.call(this);
		}, this);
	},
	renderTree : function() {
		this.tree.render(this.tplId);
	},
	selectNode : function(value) {
		if (!this.tree.rendered) {
			this.tree.on('afterRender', function(tree) {
						var node = tree.getNodeById(value);
						node.select();
						tree.removeListener('afterRender');
					});
			this.renderTree();
		} else {
			var node = this.tree.getNodeById(value);
			node.select();
		}
	},
	onViewClick : function(doFocus) {// 重写onViewClick，使展开树结点是不关闭下拉框
		var index = this.view.getSelectedIndexes()[0], s = this.store, r = s
				.getAt(index);
		if (r) {
			this.onSelect(r, index);
		}
		if (doFocus !== false) {
			this.el.focus();
		}
	},
	callback : Ext.emptyFn
});

/**
 * 内嵌树形结构
 * 
 * @class Ext.ex.TreeComboInner
 * @extends Ext.tree.TreePanel
 */
Ext.ex.TreeComboInner = Ext.extend(Ext.tree.TreePanel, {
			constructor : function(app) {
				this.app = app;
				this.loader = new Ext.tree.TreeLoader({
						// nodeParameter : 'ID',
						// requestMethod : 'POST',
						// dataUrl : this.app.url
						});
				this.root = new Ext.tree.AsyncTreeNode({
							id : app.rootId,
							text : app.rootText,
							iconCls : 'ico-root',
							expanded : true,
							leaf : false,
							border : false,
							draggable : false,
							singleClickExpand : false,
							hide : true,
							children : this.app.treeData
						});
				Ext.ex.TreeComboInner.superclass.constructor.call(this, {
							// applyTo : this.app.innerList,
							// renderTo : this.app.tplId,
							animate : true,
							border : false,
							enableDD : false,
							enableDrag : false,
							rootVisible : app.rootVisible || false,
							autoScroll : true,
							trackMouseOver : true,
							height : app.maxHeight,
							lines : true,
							singleExpand : app.singleExpand || false,
							listeners : {
								'click' : function(node) {
									if ((app.selectMode == 'leaf' && node.leaf == true)
											|| app.selectMode == 'all') {
										if (app.fireEvent('beforeselect', app,
												node)) {
											app.fireEvent('select', app, node);
										}
									}
								}
							}
						});
			}
		});
// 注册
Ext.reg('treecombo', Ext.ex.TreeCombo);