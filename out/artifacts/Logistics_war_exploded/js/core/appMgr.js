Ext.namespace('AppMgr');

/**
 * 创建新窗口
 * 
 * @param {}
 *            viewName
 * @param {}
 *            params
 * @return {}
 */
function newView(viewName, params) {
	var str = 'new ' + viewName;
	if (params != null) {
		str += '(params);';
	} else {
		str += '();';
	}
	return eval(str);
}

/**
 * Import Js
 * 
 * @return {}
 */
function $ImportJs(viewName, callback, params) {
	if (viewName.lastIndexOf("Root") != -1) {
		return;
	}
	var b = document.getElementById(viewName + '-hiden');
	if (b != null) {
		var view = newView(viewName, params);
		callback.call(this, view);
	} else {
		var jsArr = eval('App.importJs.' + viewName);
		if (jsArr == undefined || jsArr.length == 0) {
			var view = newView(viewName, params);
			callback.call(this, view);
			return;
		}
		ScriptMgr.load({
					scripts : jsArr,
					callback : function() {
						Ext.DomHelper.append(
										document.body,
										"<div id='"
												+ viewName
												+ "-hiden' style='display:none'></div>");
						var view = newView(viewName, params);
						callback.call(this, view);
					}
				});
	}
}

/**
 * 加载js,并调用回调函数
 * 
 * @param {}
 *            jsArr JS路径数组
 * @param {}
 *            callback 回调
 * @param {}
 *            scope 作用域
 * 
 */
function $ImportSimpleJs(jsArr, callback, scope) {
	ScriptMgr.load({
				scripts : jsArr,
				callback : function() {
					callback.call(this, scope);
				}
			});
}

/**
 * 取得中间的内容面板
 * 
 * @return {}
 */
AppMgr.getContentPanel = function() {
	var tabs = Ext.getCmp('centerTabPanel');
	return tabs;
};

/**
 * 创建上传的对话框
 * 
 * @param {}
 *            config
 * @return {}
 */
AppMgr.createUploadDialog = function(config) {
	var defaultConfig = {
		url : path + '/system/uploadAttach.do',
		reset_on_hide : false,
		upload_autostart : false,
		allow_close_on_upload : false,
		permitted_extensions : ['JPG', 'jpg', 'jpeg', 'JPEG', 'GIF', 'gif',
				'png', 'PNG', 'doc', 'docx', 'txt', 'pdf'],
		modal : true
	};
	Ext.apply(defaultConfig, config);
	var dialog = new Ext.ux.UploadDialog.Dialog(defaultConfig);
	return dialog;
};

/**
 * 把数组中的重复元素去掉
 * 
 * @param {}
 *            data 传入一个数组
 * @return {} 返回一个元素唯一的数组
 */
function uniqueArray(data) {
	data = data || [];
	var a = {};
	for (var i = 0; i < data.length; i++) {
		var v = data[i];
		if (typeof(a[v]) == 'undefined') {
			a[v] = 1;
		}
	};
	data.length = 0;
	for (var i in a) {
		data[data.length] = i;
	}
	return data;
};

/**
 * This function is used to get cookies
 * 
 * @param {}
 *            name
 * @return {}
 */
function getCookie(name) {
	var prefix = name + "="
	var start = document.cookie.indexOf(prefix);

	if (start == -1) {
		return null;
	}

	var end = document.cookie.indexOf(";", start + prefix.length);
	if (end == -1) {
		end = document.cookie.length;
	}

	var value = document.cookie.substring(start + prefix.length, end);
	return unescape(value);
}

/**
 * This function is used to set cookies
 * 
 * @param {}
 *            name
 * @param {}
 *            value
 * @param {}
 *            expires
 * @param {}
 *            path
 * @param {}
 *            domain
 * @param {}
 *            secure
 */
function setCookie(name, value, expires, path, domain, secure) {
	document.cookie = name + "=" + escape(value)
			+ ((expires) ? "; expires=" + expires.toGMTString() : "")
			+ ((path) ? "; path=" + path : "")
			+ ((domain) ? "; domain=" + domain : "")
			+ ((secure) ? "; secure" : "");
}

/**
 * This function is used to delete cookies
 * 
 * @param {}
 *            name
 * @param {}
 *            path
 * @param {}
 *            domain
 */
function deleteCookie(name, path, domain) {
	if (getCookie(name)) {
		document.cookie = name + "=" + ((path) ? "; path=" + path : "")
				+ ((domain) ? "; domain=" + domain : "")
				+ "; expires=Thu, 01-Jan-70 00:00:01 GMT";
	}
}

/**
 * 删除Content中的Tab
 * 
 * @param {}
 *            tabId
 */
AppMgr.removeTab = function(tabId) {
	var contentPanel = App.getContentPanel();
	var tabItem = contentPanel.getItem(tabId);
	if (tabItem != null) {
		contentPanel.remove(tabItem, true);
	}
}

/**
 * 激活Content中的Tab
 * 
 * @param {}
 *            panel
 */
AppMgr.activateTab = function(panel) {
	var contentPanel = App.getContentPanel();
	contentPanel.activate(panel);
}

/**
 * 检查当前用户有权访问funKey对应的功能
 * 
 * @param {}
 *            funKey
 * @return {Boolean}
 */
function isGranted(btnKey) {
	return contains(btnKey, Ext.decode(right_btn_table));
}

/**
 * 判断包含
 * 
 * @param {}
 *            elem
 * @param {}
 *            array
 * @return {Boolean}
 */
function contains(elem, array) {
	for (var i = 0, length = array.length; i < length; i++) {
		if (array[i].btnKey == elem) {
			return true;
		}
	}
	return false;
}