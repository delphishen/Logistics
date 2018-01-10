package com.fgwater.frame.model.wbb;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Cq")
@Table(name = "t_wbb_cq")
public class Cq extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column
	private String kqSortId;

	@Column
	private String kqId;

	@Column
	private String type;

	@Column
	private String kqEvolveId;

	@Column
	private String showFormula;

	@Column
	private String realFormula;

	@Column
	private String leafFormula;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getKqSortId() {
		return kqSortId;
	}

	public void setKqSortId(String kqSortId) {
		this.kqSortId = kqSortId;
	}

	public String getKqId() {
		return kqId;
	}

	public void setKqId(String kqId) {
		this.kqId = kqId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getKqEvolveId() {
		return kqEvolveId;
	}

	public void setKqEvolveId(String kqEvolveId) {
		this.kqEvolveId = kqEvolveId;
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

	public String getLeafFormula() {
		return leafFormula;
	}

	public void setLeafFormula(String leafFormula) {
		this.leafFormula = leafFormula;
	}
}
