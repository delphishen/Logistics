package com.fgwater.frame.model.wbb;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("StandardCfg")
@Table(name = "t_wbb_standard_cfg")
public class StandardCfg extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column
	private String standardId;

	@Column
	private String kqId;

	@Column
	private int limitType;

	@Column
	private String value;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getStandardId() {
		return standardId;
	}

	public void setStandardId(String standardId) {
		this.standardId = standardId;
	}

	public String getKqId() {
		return kqId;
	}

	public void setKqId(String kqId) {
		this.kqId = kqId;
	}

	public int getLimitType() {
		return limitType;
	}

	public void setLimitType(int limitType) {
		this.limitType = limitType;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
