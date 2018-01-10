package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Grade")
@Table(name = "t_logistics_dossier_grade")
public class Grade extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String grade;
	@Column
	private String unloadingStart;
	@Column
	private String unloadingEnd;
	
 	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getGrade() {
		return grade;
	}
	public void setGrade(String grade) {
		this.grade = grade;
	}

	public String getUnloadingStart() {
		return unloadingStart;
	}
	public void setUnloadingStart(String unloadingStart) {
		this.unloadingStart = unloadingStart;
	}

	public String getUnloadingEnd() {
		return unloadingEnd;
	}
	public void setUnloadingEnd(String unloadingEnd) {
		this.unloadingEnd = unloadingEnd;
	}
	
	
}
