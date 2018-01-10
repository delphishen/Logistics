package com.fgwater.core.utils;

import java.util.UUID;

/**
 * 
 * description : UUID工具
 * 
 * creator : 刘必文
 * 
 * createTime : Oct 10, 2012 10:16:52 AM
 * 
 * version : 1.0
 * 
 * remark :
 * 
 */
public class UUIDUtils {

	/**
	 * 
	 * description : 获得一个UUID
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 10, 2012 10:17:07 AM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @return
	 * 
	 */
	public static String getUUID() {
		String s = UUID.randomUUID().toString();
		// 去掉“-”符号
		return s.substring(0, 8) + s.substring(9, 13) + s.substring(14, 18)
				+ s.substring(19, 23) + s.substring(24);
	}

	/**
	 * 
	 * description : 获得指定数目的UUID
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : Oct 10, 2012 10:17:16 AM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param number
	 * @return
	 * 
	 */
	public static String[] getUUID(int number) {
		if (number < 1) {
			return null;
		}
		String[] ss = new String[number];
		for (int i = 0; i < number; i++) {
			ss[i] = getUUID();
		}
		return ss;
	}
}
