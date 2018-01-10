package com.fgwater.core.common;

/**
 * 
 * description : 系统常量类
 * 
 * creator : 沈商民
 * 
 * createTime : Oct 26, 2012 5:19:11 PM
 * 
 * version :
 * 
 * remark :
 * 
 */
public class ConstantSys {

	/**
	 * session中存放的用户对象
	 */
	public static final String USERSESSION_USER = "user";

	/**
	 * session中存放的按钮权限
	 */
	public static final String USERSESSION_RIGHT_BTN_TABLE = "right_btn_table";

	/**
	 * 删除标志-失效-已删除
	 */
	public static final Integer SYSTEM_FLAG_INVALID = 0;

	/**
	 * 删除标志-有效-未删除
	 */
	public static final Integer SYSTEM_FLAG_VALID = 1;

	/**
	 * 默认起始页数
	 */
	public static final Integer PAGING_DEFAULT_NUM = 1;

	/**
	 * 默认每页记录数
	 */
	public static final Integer PAGING_DEFAULT_SIZE = 20;

	public static final int RESP_MOUNT_TYPE_JO = 1;

	public static final int RESP_MOUNT_TYPE_JA = 2;

	public static final int RESP_MOUNT_TYPE_MSG = 3;

	public static final int RESP_MOUNT_TYPE_FORM = 4;

	public static final int RESP_MOUNT_TYPE_PAGING = 5;

	/**
	 * 
	 * 构造函数：
	 * 
	 */
	public ConstantSys() {

	}
}
