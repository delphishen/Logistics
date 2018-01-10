Ext.namespace('Ext.ex');

/**
 * 按钮-扩展权限控制
 * 
 * @class Ext.eu.RightButton
 * @extends Ext.Button
 */
Ext.ex.RightButton = Ext.extend(Ext.Button, {
			constructor : function(cfg) {
				Ext.ex.RightButton.superclass.constructor.call(this, cfg);
				// 若此按钮未授权,隐藏
				if (!isGranted(this.id)) {
					this.hide();
				}
			},
			show : function() {
				if (!isGranted(this.id)) {
					Ext.ux.Toast.msg('信息', this.text + '按钮未授权');
				} else {
					Ext.ex.RightButton.superclass.show.call(this);
				}
			}
		});

// 注册
Ext.reg('rbtn', Ext.ex.RightButton);