package com.fgwater.core.utils;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 * 
 * description : 字符串工具
 * 
 * creator : 刘必文
 * 
 * createTime : Oct 10, 2012 10:23:32 AM
 * 
 * version : 1.0
 * 
 * remark :
 * 
 */
public class StrUtils {

	/**
	 * 
	 * description : 美国编码转换成中文编码（ISO8859_1 to GB2312）
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 10, 2012 10:33:36 AM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param ustr
	 * @return
	 * @throws Exception
	 * 
	 */
	public static String toU2C(String ustr) throws Exception {

		if (ustr == null) {
			return null;
		}
		return new String(ustr.getBytes("ISO8859_1"), "GB2312");
	}

	/**
	 * 
	 * description : 中文编码转换成美国编码（GB2312 to ISO8859_1）
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 10, 2012 10:33:45 AM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param cstr
	 * @return
	 * @throws Exception
	 * 
	 */
	public static String toC2U(String cstr) throws Exception {

		if (cstr == null) {
			return null;
		}
		return new String(cstr.getBytes("GB2312"), "ISO8859_1");
	}

	/**
	 * 
	 * description : 判断Object是否为null
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 26, 2012 5:18:08 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param obj
	 * @return
	 * 
	 */
	public static boolean isNull(Object obj) {

		return obj == null ? true : false;
	}

	/**
	 * 
	 * description : 判断字符串是否为空或null
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 10, 2012 10:37:41 AM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param str
	 * @return true：为空 false：非空
	 * 
	 */
	public static boolean isNullOrEmpty(String str) {

		boolean flag = false;
		if (null == str || str.length() == 0) {
			flag = true;
		}
		return flag;
	}

	/**
	 * 
	 * description : 获取javavm的当前时间，并以yyyy-MM-dd HH:mm:ss格式化字符串返回
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 10, 2012 10:41:28 AM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @return
	 * 
	 */
	public static String getCurrFormatTime() {

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return sdf.format(new Date());
	}

	/**
	 * 
	 * description : 判断一个字符是否为中文
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 10, 2012 10:43:26 AM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param c
	 * @return
	 * 
	 */
	public static boolean isChinese(char c) {

		Character.UnicodeBlock ub = Character.UnicodeBlock.of(c);

		if (ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS

		|| ub == Character.UnicodeBlock.CJK_COMPATIBILITY_IDEOGRAPHS

		|| ub == Character.UnicodeBlock.CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A

		|| ub == Character.UnicodeBlock.GENERAL_PUNCTUATION // 判断中文的“号

				|| ub == Character.UnicodeBlock.CJK_SYMBOLS_AND_PUNCTUATION // 判断中文的。号

				|| ub == Character.UnicodeBlock.HALFWIDTH_AND_FULLWIDTH_FORMS) {// 判断中文的，号

			return true;

		}

		return false;

	}

	/**
	 * 
	 * description : 判断字符串是否含中文
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 10, 2012 10:45:02 AM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param strName
	 * @return
	 * 
	 */
	public static boolean hasChinese(String strName) {

		boolean ret = false;

		char[] ch = strName.toCharArray();
		for (int i = 0; i < ch.length; i++) {
			char c = ch[i];
			if (isChinese(c) == true) {
				ret = true;
				break;
			}
		}
		return ret;
	}

	/**
	 * 
	 * 功能描述:转换月份
	 * 
	 * @author: Lbw 创建时间：Mar 20, 2012 5:32:05 PM
	 * 
	 * @param key
	 * @return
	 * 
	 * 修改历史 ：(修改人，修改时间，修改原因/内容)
	 */
	public static String codeMonth(int key) {
		String s = "";
		switch (key) {
		case 1:
			s = "一月";
			break;
		case 2:
			s = "二月";
			break;
		case 3:
			s = "三月";
			break;
		case 4:
			s = "四月";
			break;
		case 5:
			s = "五月";
			break;
		case 6:
			s = "六月";
			break;
		case 7:
			s = "七月";
			break;
		case 8:
			s = "八月";
			break;
		case 9:
			s = "九月";
			break;
		case 10:
			s = "十月";
			break;
		case 11:
			s = "十一月";
			break;
		case 12:
			s = "十二月";
			break;
		default:
			s = "合计";
		}
		return s;
	}

	/**
	 * 
	 * description : 字符串数组元素删除
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Nov 7, 2012 5:14:22 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param arr
	 *            字符串
	 * @param exList
	 *            例外元素list
	 * @return
	 * 
	 */
	public static String[] arrMinus(String[] arr, List<String> exList) {
		List<String> list = new LinkedList<String>();
		for (String str : arr) {
			if (!exList.contains(str)) {
				list.add(str);
			}
		}
		String[] result = {}; // 创建空数组
		return list.toArray(result);
	}

	/**
	 * 
	 * description : 字符串数组元素追加
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Nov 7, 2012 4:33:34 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param arr
	 *            数组
	 * @param el
	 *            元素
	 * @return
	 * 
	 */
	public static String[] arrConcat(String[] arr, String el) {
		arr = Arrays.copyOf(arr, arr.length + 1);
		arr[arr.length - 1] = el;
		return arr;
	}

	/**
	 * 
	 * description : 删除字符串数组指定元素
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2012-12-10 上午10:58:31
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param arr
	 * @param el
	 * @return
	 * 
	 */
	public static String[] arrRemove(String[] arr, String el) {
		List<String> list = new LinkedList<String>();
		for (String str : arr) {
			if (!el.equals(str)) {
				list.add(str);
			}
		}
		String[] result = {}; // 创建空数组
		return list.toArray(result);
	}

	/**
	 * 
	 * description :转换字符数组为字符串
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2013-10-11 下午03:30:27
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param arr
	 *            数组
	 * @param link
	 *            连接符
	 * @return
	 * 
	 */
	public static String con2Str(String[] arr, String link) {
		StringBuffer sb = new StringBuffer();
		for (String s : arr) {
			sb.append(s);
			sb.append(link);
		}
		if (sb.lastIndexOf(link) == sb.length() - 1) {
			sb.deleteCharAt(sb.length() - 1);
		}
		return sb.toString();
	}
}
