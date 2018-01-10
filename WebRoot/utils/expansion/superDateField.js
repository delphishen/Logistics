Ext.namespace('Ext.ex');

/**
 * 超级时间选择控件：在原有时间控件功能上，新增了单独选择年/月，年，月的功能，清空时间功能 Ext-3.0.0 用法： <br>
 * <input type="text" name="dateField" id="dateField" /> new
 * Ext.ex.SuperDateField({ applyTo : 'dateField', format:'Y' }); <br>
 * 重要参数说明： format <br>
 * 1：当时间格式参数中不含'd'，则只显示年月选择面板。如：'Y-m','Y年m月' <br>
 * 2：当时间格式参数中不含'd','m'，并以'Y'开头，则只显示年份选择面板。如：'Y','Y年' <br>
 * 3：当时间格式参数中不含'd','Y'，并以'm'开头，则只显示月份选择面板。如：'m','m月' <br>
 * 4：当时间格式参数中包含'd'，则和普通时间控件一样
 * 
 * @class Ext.ex.SuperDateField
 * @extends Ext.form.DateField
 */
Ext.ex.SuperDateField = Ext.extend(Ext.form.DateField, {
			format : 'Y',
			onTriggerClick : function() {
				Ext.ex.SuperDateField.superclass.onTriggerClick.call(this);
				Ext.apply(this.menu.picker, {
							input : this
						});
				// 当显示时间格式不含'd'时，直接调用showMonthPicker()显示年月选择面板
				if (this.format.indexOf('d') == -1) {
					this.menu.picker.showMonthPicker();
				}
			}
		});

/**
 * 注册xtype
 */
Ext.reg('superdatefield', Ext.ex.SuperDateField);

/**
 * 覆盖Ext.DatePicker部分方法，新增只显示年月，年，月选择面板功能 注意：修改方法时需注意不要影响正常时间控件功能
 */
Ext.override(Ext.DatePicker, {
	clearText : '清空',
	onRender : function(container, position) {
		var m = [
				'<table cellspacing="0">',
				'<tr><td class="x-date-left"><a href="#" title="',
				this.prevText,
				'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="',
				this.nextText, '">&#160;</a></td></tr>',
				'<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'], dn = this.dayNames, i;
		for (i = 0; i < 7; i++) {
			var d = this.startDay + i;
			if (d > 6) {
				d = d - 7;
			}
			m.push('<th><span>', dn[d].substr(0, 1), '</span></th>');
		}
		m[m.length] = '</tr></thead><tbody><tr>';
		for (i = 0; i < 42; i++) {
			if (i % 7 === 0 && i !== 0) {
				m[m.length] = '</tr><tr>';
			}
			m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
		}
		m
				.push(
						'</tr></tbody></table></td></tr>',
						'<tr><td colspan="3" class="x-date-bottom" align="center"><table><tr>',
						this.showToday ? '<td class="x-date-today"></td>' : '',
						'<td class="x-date-clear"></td></tr></table></td></tr>',
						'</table><div class="x-date-mp"></div>');

		var el = document.createElement('div');
		el.className = 'x-date-picker';
		el.innerHTML = m.join('');

		container.dom.insertBefore(el, position);

		this.el = Ext.get(el);
		this.eventEl = Ext.get(el.firstChild);

		this.prevRepeater = new Ext.util.ClickRepeater(this.el
						.child('td.x-date-left a'), {
					handler : this.showPrevMonth,
					scope : this,
					preventDefault : true,
					stopDefault : true
				});

		this.nextRepeater = new Ext.util.ClickRepeater(this.el
						.child('td.x-date-right a'), {
					handler : this.showNextMonth,
					scope : this,
					preventDefault : true,
					stopDefault : true
				});

		this.monthPicker = this.el.down('div.x-date-mp');
		this.monthPicker.enableDisplayMode('block');

		this.keyNav = new Ext.KeyNav(this.eventEl, {
					'left' : function(e) {
						if (e.ctrlKey) {
							this.showPrevMonth();
						} else {
							this.update(this.activeDate.add('d', -1));
						}
					},

					'right' : function(e) {
						if (e.ctrlKey) {
							this.showNextMonth();
						} else {
							this.update(this.activeDate.add('d', 1));
						}
					},

					'up' : function(e) {
						if (e.ctrlKey) {
							this.showNextYear();
						} else {
							this.update(this.activeDate.add('d', -7));
						}
					},

					'down' : function(e) {
						if (e.ctrlKey) {
							this.showPrevYear();
						} else {
							this.update(this.activeDate.add('d', 7));
						}
					},

					'pageUp' : function(e) {
						this.showNextMonth();
					},

					'pageDown' : function(e) {
						this.showPrevMonth();
					},

					'enter' : function(e) {
						e.stopPropagation();
						return true;
					},

					scope : this
				});

		this.el.unselectable();

		this.cells = this.el.select('table.x-date-inner tbody td');
		this.textNodes = this.el.query('table.x-date-inner tbody span');

		this.mbtn = new Ext.Button({
					text : '&#160;',
					tooltip : this.monthYearText,
					renderTo : this.el.child('td.x-date-middle', true)
				});
		this.mbtn.el.child('em').addClass('x-btn-arrow');

		if (this.showToday) {
			this.todayKeyListener = this.eventEl.addKeyListener(
					Ext.EventObject.SPACE, this.selectToday, this);
			var today = (new Date()).dateFormat(this.format);
			this.todayBtn = new Ext.Button({
						renderTo : this.el.child('td.x-date-today', true),
						text : String.format(this.todayText, today),
						tooltip : String.format(this.todayTip, today),
						handler : this.selectToday,
						scope : this
					});
			// 增加清空按钮事件
			this.clearDate = function() {
				this.setValue(new Date().clearTime());
				this.fireEvent('select', this, null);
			};
		}
		// 增加清空按钮事件
		this.clearBtn = new Ext.Button({
					renderTo : this.el.child('td.x-date-clear', true),
					text : this.clearText,
					handler : this.clearDate,
					scope : this
				});

		this.mon(this.eventEl, 'mousewheel', this.handleMouseWheel, this);
		this.mon(this.eventEl, 'click', this.handleDateClick, this, {
					delegate : 'a.x-date-date'
				});
		this.mon(this.mbtn, 'click', this.showMonthPicker, this);
		this.onEnable(true);
		// 当显示时间格式只为'Y'时， 隐藏日期选择面板及按钮
		if (this.format.indexOf('d') == -1) {
			this.el.select("table.x-date-inner").hide();
			this.el.child("td.x-date-bottom").hide();
		}

	},
	// private
	createMonthPicker : function() {
		if (!this.monthPicker.dom.firstChild) {
			var buf = ['<table border="0" cellspacing="0">'];
			// 只保留选择年份面板
			if (this.format.indexOf('d') == -1 && this.format.indexOf('Y') == 0
					&& this.format.indexOf('m') == -1) {
				for (var i = 0; i < 6; i++) {
					buf
							.push(i === 0
									? '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>'
									: '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>');
				}
			} else if (this.format.indexOf('d') == -1
					&& this.format.indexOf('m') == 0
					&& this.format.indexOf('Y') == -1) {// 只保留选择月份面板
				for (var i = 0; i < 6; i++) {
					buf
							.push(
									'<tr><td class="x-date-mp-month"><a href="#">',
									Date.getShortMonthName(i),
									'</a></td>',
									'<td class="x-date-mp-month x-date-mp-sep"><a href="#">',
									Date.getShortMonthName(i + 6),
									'</a></td></tr>');
				}
			} else {
				for (var i = 0; i < 6; i++) {
					buf
							.push(
									'<td class="x-date-mp-month"><a href="#">',
									Date.getShortMonthName(i),
									'</a></td>',
									'<td class="x-date-mp-month x-date-mp-sep"><a href="#">',
									Date.getShortMonthName(i + 6),
									'</a></td>',
									i === 0
											? '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>'
											: '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>');
				}
			}

			buf
					.push(
							'<tr class="x-date-mp-btns"><td colspan="4">',
							'<button type="button" class="x-date-mp-ok">'
									+ this.okText + '</button>',
							'<button type="button" class="x-date-mp-cancel">'
									+ this.cancelText + '</button>',
							this.format.indexOf('d') == -1
									? '&nbsp;<button type="button" class="x-data-mp-clear">'
											+ this.clearText + '</button>'
									: '', '</td></tr>', '</table>');
			this.monthPicker.update(buf.join(''));

			this.mon(this.monthPicker, 'click', this.onMonthClick, this);
			// 当显示时间格式只为'Y'时， 取消双击事件
			if (this.format.indexOf('d') != -1) {
				this.mon(this.monthPicker, 'dblclick', this.onMonthDblClick,
						this);
			}

			this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
			this.mpYears = this.monthPicker.select('td.x-date-mp-year');

			this.mpMonths.each(function(m, a, i) {
						i += 1;
						if ((i % 2) === 0) {
							m.dom.xmonth = 5 + Math.round(i * 0.5);
						} else {
							m.dom.xmonth = Math.round((i - 1) * 0.5);
						}
					});
		}
	},

	// private
	showMonthPicker : function() {
		if (!this.disabled) {
			this.createMonthPicker();
			var size = this.el.getSize();
			this.monthPicker.setSize(size);
			this.monthPicker.child('table').setSize(size);

			// 只更新年份面板
			if (this.format.indexOf('d') == -1 && this.format.indexOf('Y') == 0
					&& this.format.indexOf('m') == -1) {
				this.mpSelYear = (this.activeDate || this.value).getFullYear();
				this.updateMPYear(this.mpSelYear);
			} else if (this.format.indexOf('d') == -1
					&& this.format.indexOf('m') == 0
					&& this.format.indexOf('Y') == -1) {// 只更新月份面板
				this.mpSelMonth = (this.activeDate || this.value).getMonth();
				this.updateMPMonth(this.mpSelMonth);
			} else {
				this.mpSelYear = (this.activeDate || this.value).getFullYear();
				this.updateMPYear(this.mpSelYear);
				this.mpSelMonth = (this.activeDate || this.value).getMonth();
				this.updateMPMonth(this.mpSelMonth);
			}

			this.monthPicker.slideIn('t', {
						duration : 0.2
					});
		}
	},
	// private
	onMonthClick : function(e, t) {
		e.stopEvent();
		var el = new Ext.Element(t), pn;
		if (el.is('button.x-date-mp-cancel')) {
			this.hideMonthPicker();
			if (this.format.indexOf('d') == -1) {
				this.fireEvent("select", this, this.value);
			}
		} else if (el.is('button.x-data-mp-clear')) {
			this.hideMonthPicker();
			// 清空值
			this.setValue(new Date().clearTime());
			this.fireEvent('select', this, null);
		} else if (el.is('button.x-date-mp-ok')) {
			var d;
			// 只显示月份时，默认年是系统当前年份
			if (this.format.indexOf('d') == -1 && this.format.indexOf('m') == 0
					&& this.format.indexOf('Y') == -1) {
				this.mpSelYear = (this.activeDate || this.value).getFullYear();
			} else if (this.format.indexOf('d') == -1
					&& this.format.indexOf('Y') == 0
					&& this.format.indexOf('m') == -1) {// 只显示年份时，默认年是系统当前月份
				this.mpSelMonth = (this.activeDate || this.value).getMonth();
			}
			d = new Date(this.mpSelYear, this.mpSelMonth,
					(this.activeDate || this.value).getDate());
			if (d.getMonth() != this.mpSelMonth) {
				// 'fix' the JS rolling date conversion if needed
				d = new Date(this.mpSelYear, this.mpSelMonth, 1)
						.getLastDateOfMonth();
			}
			this.update(d);
			this.hideMonthPicker();
			// 当显示时间格式只为'Y'时，设置值,并激发select事件
			if (this.format.indexOf('d') == -1) {
				this.setValue(d);
				this.fireEvent("select", this, this.value);
			}

		} else if ((pn = el.up('td.x-date-mp-month', 2))) {
			this.mpMonths.removeClass('x-date-mp-sel');
			pn.addClass('x-date-mp-sel');
			this.mpSelMonth = pn.dom.xmonth;
		} else if ((pn = el.up('td.x-date-mp-year', 2))) {
			this.mpYears.removeClass('x-date-mp-sel');
			pn.addClass('x-date-mp-sel');
			this.mpSelYear = pn.dom.xyear;
		} else if (el.is('a.x-date-mp-prev')) {
			this.updateMPYear(this.mpyear - 10);
		} else if (el.is('a.x-date-mp-next')) {
			this.updateMPYear(this.mpyear + 10);
		}
	},

	// private
	onMonthDblClick : function(e, t) {
		e.stopEvent();
		var el = new Ext.Element(t), pn;
		if ((pn = el.up('td.x-date-mp-month', 2))) {
			this.update(new Date(this.mpSelYear, pn.dom.xmonth,
					(this.activeDate || this.value).getDate()));
			this.hideMonthPicker();
			// 当显示时间格式只为'Y'时，设置值,并激发select事件
			if (this.format.indexOf('d') == -1) {
				this.setValue(new Date(this.mpSelYear, pn.dom.xmonth,
						(this.activeDate || this.value).getDate()));
				this.fireEvent("select", this, this.value);
			}

		} else if ((pn = el.up('td.x-date-mp-year', 2))) {
			this.update(new Date(pn.dom.xyear, this.mpSelMonth,
					(this.activeDate || this.value).getDate()));
			this.hideMonthPicker();
			// 当显示时间格式只为'Y'时，设置值,并激发select事件
			if (this.format.indexOf('d') == -1) {
				this.setValue(new Date(this.mpSelYear, pn.dom.xmonth,
						(this.activeDate || this.value).getDate()));
				this.fireEvent("select", this, this.value);
			}
		}
	}
});