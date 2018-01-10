package com.fgwater.frame.model.wbb;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Standard")
@Table(name = "t_wbb_standard")
public class Standard extends BaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column
	private String belongSortId;

	@Column
	private String filterSortId;

	@Column
	private String name;

	@Column
	private String number;

	@Column
	private String remark;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getBelongSortId() {
		return belongSortId;
	}

	public void setBelongSortId(String belongSortId) {
		this.belongSortId = belongSortId;
	}

	public String getFilterSortId() {
		return filterSortId;
	}

	public void setFilterSortId(String filterSortId) {
		this.filterSortId = filterSortId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

}
