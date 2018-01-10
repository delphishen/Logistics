package com.fgwater.frame.model.wbb;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Kq")
@Table(name = "t_wbb_kq")
public class Kq extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column
	private String sortId;

	@Column
	private String chName;

	@Column
	private String enName;

	@Column
	private String enNameCs;

	@Column
	private String unit;

	@Column
	private int type;

	@Column
	private String remark;

	@Column
	private String errorRate;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSortId() {
		return sortId;
	}

	public void setSortId(String sortId) {
		this.sortId = sortId;
	}

	public String getChName() {
		return chName;
	}

	public void setChName(String chName) {
		this.chName = chName;
	}

	public String getEnName() {
		return enName;
	}

	public void setEnName(String enName) {
		this.enName = enName;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getEnNameCs() {
		return enNameCs;
	}

	public void setEnNameCs(String enNameCs) {
		this.enNameCs = enNameCs;
	}

	public String getErrorRate() {
		return errorRate;
	}

	public void setErrorRate(String errorRate) {
		this.errorRate = errorRate;
	}
}
