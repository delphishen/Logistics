package com.fgwater.core.utils;

import java.util.HashMap;
import java.util.Map;

import com.fgwater.core.common.ConstantSys;
import com.fgwater.frame.model.system.User;

/**
 * 
 * description : 用户session工具
 * 
 * creator : 沈商民
 * 
 * createTime : Nov 2, 2012 4:06:22 PM
 * 
 * version : 1.0
 * 
 * remark :
 * 
 */
@SuppressWarnings("unchecked")
public class SessionUtils {
	/**
	 * 保存变量的ThreadLocal，保持在同一线程中同步数据
	 */
	private static final ThreadLocal SESSION_MAP = new ThreadLocal() {

		public Map initialValue() {

			return new HashMap();
		}
	};

	/**
	 * 构造方法
	 */
	protected SessionUtils() {

	}

	/**
	 * 
	 * description : 获取map
	 * 
	 * creator : 沈商民
	 * 
	 * createTime : Nov 8, 2012 12:56:55 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @return
	 * 
	 */
	public static Map getMapVar() {
		Map map = (Map) SESSION_MAP.get();
		return map;
	}

	/**
	 * 
	 * description : 获得线程中保存的属性.目前保存如下信息
	 * 
	 * creator : 沈商民
	 * 
	 * createTime : Nov 2, 2012 4:06:36 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param attribute
	 * @return
	 * 
	 */
	public static Object get(String attribute) {
		Map map = (Map) SESSION_MAP.get();
		return map.get(attribute);
	}

	/**
	 * 
	 * description : 获得线程中保存的属性，使用指定类型进行转型
	 * 
	 * creator : 沈商民
	 * 
	 * createTime : Nov 2, 2012 4:07:02 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param <T>
	 * @param attribute
	 *            属性名称
	 * @param clazz
	 *            类型
	 * @return
	 * 
	 */
	public static <T> T get(String attribute, Class<T> clazz) {
		return (T) get(attribute);
	}

	/**
	 * 
	 * description : 设置制定属性名的值
	 * 
	 * creator : 沈商民
	 * 
	 * createTime : Nov 2, 2012 4:07:48 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param attribute
	 *            属性名称
	 * @param value
	 *            属性值
	 * 
	 */
	public static void set(String attribute, Object value) {
		Map map = (Map) SESSION_MAP.get();
		if (map == null) {
			map = new HashMap();
			SESSION_MAP.set(map);
		}
		map.put(attribute, value);
	}

	/**
	 * 
	 * description : 清除map中的所有变量信息
	 * 
	 * creator : 沈商民
	 * 
	 * createTime : Nov 2, 2012 4:08:23 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * 
	 */
	public static void clear() {
		Map map = (Map) SESSION_MAP.get();
		if (null != map) {
			map.clear();
		}
	}

	/**
	 * 
	 * description : 从session中删除指定的key
	 * 
	 * creator : 沈商民
	 * 
	 * createTime : Nov 2, 2012 4:08:39 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param key
	 * 
	 */
	public static void remove(Object key) {
		Map map = (Map) SESSION_MAP.get();
		if (null != map) {
			map.remove(key);
		}
	}

	/**
	 * 
	 * description : 获取当前登陆用户ID
	 * 
	 * creator : 沈商民
	 * 
	 * createTime : Nov 8, 2012 1:07:14 PM
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @return
	 * 
	 */
	public static String getCurrUserId() {
		Map map = (Map) SESSION_MAP.get();
		User user = (User) map.get(ConstantSys.USERSESSION_USER);
		if (user != null) {
		//	return user.getEmpId();
			return user.getId();
		} else {
			return null;
		}
	}

	/**
	 * 
	 * description : 获取当前登陆用户
	 * 
	 * creator : 沈商民
	 * 
	 * createTime : 2012-12-25 下午04:14:47
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @return
	 * 
	 */
	public static User getCurrUser() {
		Map map = (Map) SESSION_MAP.get();
		return (User) map.get(ConstantSys.USERSESSION_USER);
	}
}
