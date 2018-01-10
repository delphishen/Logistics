package com.fgwater.frame.model.wbb;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Qp")
@Table(name = "t_wbb_qp")
public class Qp extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column
	private String sortId;

	@Column
	private String name;

	@Column
	private String showFormula;

	@Column
	private String realFormula;
	
	@Column
	private String leafFormula;

	@Column
	private String remark;

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

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getShowFormula() {
		return showFormula;
	}

	public void setShowFormula(String showFormula) {
		this.showFormula = showFormula;
	}

	public String getRealFormula() {
		return realFormula;
	}

	public void setRealFormula(String realFormula) {
		this.realFormula = realFormula;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getLeafFormula() {
		return leafFormula;
	}

	public void setLeafFormula(String leafFormula) {
		this.leafFormula = leafFormula;
	}
}
