
/**
 * 获取制定表单的所有input元素，拼装成AJAX请求的参数
 * 
 * @param {}
 *            p
 */
$.formParams = function(p) {
	if (p == undefined) {
		return;
	}

	var data = new Array;

	$(p).find(":input").each(function(i, n) {
		var flag = "false";
		if ($(n).attr("param") == undefined) {
			flag = "true";
		} else {
			flag = $(n).attr("param");
		}
		if (flag == true || flag == "true") {
			if (($(n).attr('type') == "checkbox" || $(n).attr('type') == "radio")
					&& $(n).attr('checked') == true) {
				data.push({
							name : $(n).attr("name"),
							value : $(n).attr("value")
						});
			} else if ($(n).attr('type') == "text"
					|| $(n).attr('type') == "password"
					|| $(n).attr('type') == "hidden"
					|| $(n).attr('type') == "textarea") {
				data.push({
							name : $(n).attr("name"),
							value : $(n).attr("value")
						});
			}
		}
	});
	$(p).find("select").each(function(i, n) {

				var flag = "false";
				if ($(n).attr("param") == undefined) {
					flag = "true";
				} else {
					flag = $(n).attr("param");
				}
				if (flag == true || flag == "true") {
					if ($.trim($(n).attr('value')) != '') {
						data.push({
									name : $(n).attr("name"),
									value : $(n).attr("value")
								});
					} else {
						data.push({
									name : $(n).attr("name"),
									value : ''
								});
					}

				}

			});
	return data;
};

/**
 * 校验某对象的长度
 * 
 * @param o
 *            要校验的对象（必填）
 * @param name
 *            校验对象的名称（必填）
 * 
 * @param min
 *            最小长度（必填）
 * 
 * @param max
 *            最大长度
 * 
 * @param e
 *            错误提示信息（该参数可以为空）
 * 
 * @param showType
 *            出错信息提示方式：1、弹出窗口显示 2、在当前选择框上通过tooltip显示
 *            3、允许指定具体显示错误信息的页面元素id，如果不填写则统一在id为"validateTips"的地方显示（如果不填，则默认为1）
 * 
 * @param errorId
 *            如果showType选择了3，则该属性可用，用来指定具体显示错误信息的页面元素id（可为空）
 * 
 * @param nullable
 *            如果为true，该字段可空，默认是false
 * 
 * @return 失败：false，成功：true
 * 
 */
$.checkLength = function(opt) {

	var _MAX = 999999999;

	if (opt.o == "undefined") {
		return;
	}
	if (opt.showType == "undefined") {
		opt.showType = 1;
	}
	if (opt.min == "undefined") {
		return
	}
	if (opt.max == "undefined") {
		opt.max = _MAX;
	}
	if (opt.name == "undefined") {
		opt.name = '字段';
	}

	if (opt.nullable == "undefined") {
		opt.nullable = false;
	}

	if (opt.nullable == true) {// 如果设置了nullable，并且字段为空，则跳过校验
		if ($.trim(opt.o.val()) == "") {
			return true;
		}
	}

	var l = $.trim(opt.o.val()).length;
	if (l > opt.max || l < opt.min) {
		if (!opt.e) {
			if (opt.max == _MAX) {
				if (opt.min == 1) {
					opt.e = opt.name + "不能为空";
				} else {
					opt.e = opt.name + "的长度必须大于" + opt.min;
				}
			} else {
				opt.e = opt.name + "的长度必须在" + opt.min + "和" + opt.max + "之间！";
			}
		}
		$.showValidateError(opt);
		return false;
	} else {
		$.showValidateSuccess(opt);
		return true;
	}

};

$.showValidateSuccess = function(opt) {
	if (opt.showType != "undefined") {
		switch (opt.showType) {
			case 1 :
				opt.o.attr('title', '');
				opt.o.removeClass('ui-state-error');
				break;
			case 2 :
				// opt.o.qtip('hide');

				if (opt.o.qtip()) {
					opt.o.qtip('hide');
				}
				// opt.o.attr('title', '');
				// opt.o.removeClass('ui-state-error');
				break;
			case 3 :
				var show;
				if (!opt.errorId) {
					show = $('#validateTips');
				} else {
					show = $('#' + opt.errorId);
				}
				show.removeClass();
				show.text("");
				break;
			default :
				opt.o.attr('title', '');
				opt.o.removeClass('ui-state-error');
				break;
		}
	}
};

$.showValidateError = function(opt) {
	error = opt.e == "undefined" ? '校验失败' : opt.e;
	if (opt.showType != "undefined") {
		switch (opt.showType) {
			case 1 :
				$.alert(error, function() {
							opt.o.focus();
							opt.o.attr('title', error);
							opt.o.addClass('ui-state-error');
						});

				break;
			case 2 :
				opt.o.focus();
				opt.o.qtip({
							content : error,
							position : {
								corner : {
									target : 'topLeft',
									tooltip : 'bottomLeft'
								}
							},
							style : {
								name : 'red' // Inherit from preset style
							},
							show : {
								ready : true
							}
						});
				// opt.o.attr('title', error);
				// opt.o.addClass('ui-state-error');
				break;
			case 3 :
				var show;
				opt.o.focus();
				if (!opt.errorId) {
					show = $('#validateTips');
				} else {
					show = $('#' + opt.errorId);
				}
				show.addClass('ui-state-error');
				break;
			default :
				$.alert(error, function() {
							opt.o.focus();
							opt.o.attr('title', error);
							opt.o.addClass('ui-state-error');
						});
				break;
		}
	}
};