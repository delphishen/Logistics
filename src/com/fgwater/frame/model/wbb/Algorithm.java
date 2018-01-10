package com.fgwater.frame.model.wbb;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Algorithm")
@Table(name = "t_wbb_algorithm")
public class Algorithm extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column
	private String name;

	@Column
	private String statement;

	@Column
	private String iterator;

	@Column
	private String wuMinValue;

	@Column
	private String hucMaxTimes;

	@Column
	private String remark;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getStatement() {
		return statement;
	}

	public void setStatement(String statement) {
		this.statement = statement;
	}

	public String getIterator() {
		return iterator;
	}

	public void setIterator(String iterator) {
		this.iterator = iterator;
	}

	public String getWuMinValue() {
		return wuMinValue;
	}

	public void setWuMinValue(String wuMinValue) {
		this.wuMinValue = wuMinValue;
	}

	public String getHucMaxTimes() {
		return hucMaxTimes;
	}

	public void setHucMaxTimes(String hucMaxTimes) {
		this.hucMaxTimes = hucMaxTimes;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

}
