Ext.namespace('Ext.eu'); // 命名空间

/**
 * Ext.form.BasicForm追加clearDirty方法
 */
Ext.override(Ext.form.BasicForm, {
			clearDirty : function() {
				var i, it = this.items.items, l = it.length, c;
				for (i = 0; i < l; i++) {
					c = it[i];
					c.originalValue = String(c.getValue());
				}
			}
		});

/**
 * 获取全部当前选择行对象
 * 
 * @param {}
 *            grid
 * @return {}
 */
Ext.eu.getSelects = function(grid) {
	return grid.getSelectionModel().getSelections();
};

/**
 * 获取当前选择行对象，只获取第一条
 * 
 * @param {}
 *            grid
 * @return {}
 */
Ext.eu.getSelect = function(grid) {
	var selectRecords = grid.getSelectionModel().getSelections();
	if (selectRecords.length != 0) {
		return selectRecords[0];
	} else {
		return null;
	}
};

/**
 * 获取当前选择行对象ID
 * 
 * @param {}
 *            grid
 * @return {}
 */
Ext.eu.getSelectId = function(grid) {
	var selectRecords = grid.getSelectionModel().getSelections();
	if (selectRecords.length != 0) {
		return selectRecords[0].data.id;
	} else {
		return '';
	}
};

Ext.eu.formatFloat = function(src, pos) {
	return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

/**
 * 通用Ajax
 * 
 * @param {}
 *            url 地址
 * @param {}
 *            params 参数
 * @param {}
 *            callback 回调
 * @param {}
 *            scope 回调this指针范围
 * 
 */
Ext.eu.ajax = function(url, params, callback, scope) {
	var myMask = new Ext.LoadMask(Ext.getBody(), {
				msg : '正在提交！',
				removeMask : true
			});
	myMask.show();
	Ext.Ajax.request({
				url : url,
				params : params == null ? {} : params,
				method : 'POST',
				success : function(resp, opt) {
					myMask.hide()
					callback.call(this, resp);
				},
				failure : function(resp, opt) {
					Ext.MessageBox.show({
								title : '错误',
								msg : '连接失败请与管理员联系',
								icon : Ext.Msg.ERROR,
								buttons : Ext.Msg.CANCEL
							});
					myMask.hide()
				},
				scope : scope
			});
}

/**
 * <0:beginTime>endTime >0:beginTime<endTime =0:beginTime=endTime
 * 
 * @param {}
 *            beginTime
 * @param {}
 *            endTime
 * @return {}
 */
Ext.eu.compareTime = function(beginTime, endTime) {
	var beginTimes = beginTime.substring(0, 10).split('-');
	var endTimes = endTime.substring(0, 10).split('-');
	beginTime = beginTimes[0] + '/' + beginTimes[1] + '/' + beginTimes[2]
			+ beginTime.substring(10, 19);
	endTime = endTimes[0] + '/' + endTimes[1] + '/' + endTimes[2]
			+ endTime.substring(10, 19);
	var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
	if (a < 0) {
		return -1;
	} else if (a > 0) {
		return 1;
	} else if (a == 0) {
		return 0;
	} else {
		return 'exception'
	}
}

/**
 * 转换浮点
 * 
 * @param {}
 *            num
 * @return {Number}
 */
Ext.eu.convertFloat = function(num) {
	if (isNaN(parseFloat(num))) {
		return 0;
	} else {
		return parseFloat(num);
	}
}

/**
 * 格式化浮点
 * 
 * @param {}
 *            src 源数值
 * @param {}
 *            pos 小数点位数
 * @return {}
 */
Ext.eu.formatFloat = function(src, pos) {
	return Math.round(src * Math.pow(10, pos)) / Math.pow(10, pos);
}

/**
 * 求商
 * 
 * @param {}
 *            numerator 分子
 * @param {}
 *            denominator 分母
 * @return {String}
 */
Ext.eu.div = function(numerator, denominator) {
	var res = Ext.eu.convertFloat(numerator) / Ext.eu.convertFloat(denominator);
	if (isNaN(res)) {
		return 0;
	} else {
		return Ext.eu.formatFloat(res, 2);
	}
}
