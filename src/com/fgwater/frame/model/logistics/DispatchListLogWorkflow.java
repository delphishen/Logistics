package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("DispatchListLogWorkflow")
@Table(name = "t_logistics_dispatchList_log_workflow")
public class DispatchListLogWorkflow extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String dispatchListLogID;		
	@Column
	private String status;
	@Column
	private String logType;		
	@Column
	private String remark;
	@Column
	private String moTime;	
	@Column
	private String modifier;
		
	
//	public User() {

//	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getDispatchListLogID() {
		return dispatchListLogID;
	}
	public void setDispatchListLogID(String dispatchListLogID) {
		this.dispatchListLogID = dispatchListLogID;
	}
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getLogType() {
		return logType;
	}
	public void setLogType(String logType) {
		this.logType = logType;
	}		
	
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}	
	
	public String getMoTime() {
		return moTime;
	}
	public void setMoTime(String moTime) {
		this.moTime = moTime;
	}	
	
	public String getModifier() {
		return modifier;
	}
	public void setModifier(String modifier) {
		this.modifier = modifier;
	}
	

	
	
	
	
	
}
