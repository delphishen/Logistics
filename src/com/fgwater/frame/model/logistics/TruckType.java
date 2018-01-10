package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("TruckType")
@Table(name = "t_logistics_dossier_truckType")
public class TruckType extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String truckTypeName;
	@Column
	private int warnDay;
	@Column
	private int delTime;
	@Column
	private int modifyTime;	
	
	

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getTruckTypeName() {
		return truckTypeName;
	}
	public void setTruckTypeName(String truckTypeName) {
		this.truckTypeName = truckTypeName;
	}


	public int getWarnDay() {
		return warnDay;
	}
	public void setWarnDay(int warnDay) {
		this.warnDay = warnDay;
	}
		
	public int getDelTime() {
		return delTime;
	}
	public void setDelTime(int delTime) {
		this.delTime = delTime;
	}	
	public int getModifyTime() {
		return modifyTime;
	}
	public void setModifyTime(int modifyTime) {
		this.modifyTime = modifyTime;
	}	
	
	
	
	
}
