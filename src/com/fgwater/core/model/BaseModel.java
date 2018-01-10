package com.fgwater.core.model;

import java.io.Serializable;
import java.lang.reflect.Field;

import javax.persistence.Id;
import javax.persistence.Table;

public class BaseModel implements Serializable {

	private static final long serialVersionUID = 1L;

	private String creator;

	private String crTime;

	private String modifier;

	private String moTime;

	private int flag;

	public BaseModel() {

	}

	/**
	 * 
	 * description : 获取model对应的表名 需要model中的属性定义@Table(name)
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2015 八月 7 14:46:45
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @return
	 * 
	 */
	public String table() {
		Table table = this.getClass().getAnnotation(Table.class);
		if (table != null) {
			return table.name();
		} else {
			throw new RuntimeException("undefine model @Table");
		}
	}

	/**
	 * 
	 * description : 获取model对应的主键名称 需要model中的属性定义@Id
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2015 八月 7 14:47:14
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @return
	 * 
	 */
	public String id() {
		return idField().getName();
	}

	public Field idField() {
		for (Field field : this.getClass().getDeclaredFields()) {
			if (field.isAnnotationPresent(Id.class))
				return field;
		}
		throw new RuntimeException("undefine model @Id");
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public String getCrTime() {
		return crTime;
	}

	public void setCrTime(String crTime) {
		this.crTime = crTime;
	}

	public String getModifier() {
		return modifier;
	}

	public void setModifier(String modifier) {
		this.modifier = modifier;
	}

	public String getMoTime() {
		return moTime;
	}

	public void setMoTime(String moTime) {
		this.moTime = moTime;
	}

	public int getFlag() {
		return flag;
	}

	public void setFlag(int flag) {
		this.flag = flag;
	}

}
