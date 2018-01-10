package com.fgwater.frame.model.wbb;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("KqEvolve")
@Table(name = "t_wbb_kq_evolve")
public class KqEvolve extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column
	private String kqId;

	@Column
	private String chName;

	@Column
	private String enName;
	
	@Column
	private String enNameCs;

	@Column
	private int type;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getKqId() {
		return kqId;
	}

	public void setKqId(String kqId) {
		this.kqId = kqId;
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

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getEnNameCs() {
		return enNameCs;
	}

	public void setEnNameCs(String enNameCs) {
		this.enNameCs = enNameCs;
	}
}
