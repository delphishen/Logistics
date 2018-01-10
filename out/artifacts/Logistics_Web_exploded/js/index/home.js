Ext.namespace('home');// 创建域

var home = function() {
	Ext.state.Manager.setProvider(new Ext.state.CookieProvider());
	var tools = [{
				id : 'gear',
				handler : function() {
					Ext.Msg.alert('Message', 'The Settings tool was clicked.');
				}
			}, {
				id : 'close',
				handler : function(e, target, panel) {
					panel.ownerCt.remove(panel, true);
				}
			}];

	return {
		init : function() {
			var portal = {
				id : 'Home',
				iconCls : 'house',
				title : '首页',
				xtype : 'portal',
				region : 'center',
				bodyStyle : 'background-color:#C9D9EB',
				closable : false,
				items : [{
							columnWidth : .6,
							style : 'padding:10px 0px 10px 10px',
							defaults : {
								tools : tools
							},
							items : [{
										title : '公告',
										height : 150,
										tools : tools
									}, {
										title : '邮件',
										height : 190,
										tools : tools
									}, {
										title : '消息',
										height : 190,
										tools : tools
									}]
						}, {
							columnWidth : .39,
							style : 'padding:10px 0px 10px 10px',
							defaults : {
								tools : tools
							},
							items : [{
										title : '待办',
										height : 270,
										tools : tools
									}, {
										title : '任务',
										height : 270,
										tools : tools
									}]
						}]
			};
			return portal;
		}
	}
}