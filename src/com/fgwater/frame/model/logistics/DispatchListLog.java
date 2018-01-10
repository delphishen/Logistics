package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("DispatchListLog")
@Table(name = "t_logistics_dispatchList_log")
public class DispatchListLog extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String dispatchListID;	
	@Column
	private String logType;
	@Column
	private String taskID;
	@Column
	private String plateNumber;
	@Column
	private String payFreight;
	@Column
	private String totalLoading;
	@Column
	private String loadingDate;	
	@Column
	private String totalUnloading;
	@Column
	private String unloadingDate;	
	@Column
	private String payFreightNew;
	@Column
	private String totalLoadingNew;	
	@Column
	private String loadingDateNew;	
	@Column
	private String totalUnloadingNew;
	@Column
	private String unloadingDateNew;		
	@Column
	private String remark;
	@Column
	private String moTime;	
	@Column
	private String modifier;
	@Column
	private String auditor;	
	@Column
	private String auditorTime;	
	@Column
	private String status;	
	@Column
	private String creator;	
	@Column
	private String dispatchersID;		
	
	
	

	
	
	
	
//	public User() {

//	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getDispatchListID() {
		return dispatchListID;
	}
	public void setDispatchListID(String dispatchListID) {
		this.dispatchListID = dispatchListID;
	}

	
	public String getLogType() {
		return logType;
	}
	public void setLogType(String logType) {
		this.logType = logType;
	}

	public String getTaskID() {
		return taskID;
	}
	public void setTaskID(String taskID) {
		this.taskID = taskID;
	}
	
	public String getPlateNumber() {
		return plateNumber;
	}
	public void setPlateNumber(String plateNumber) {
		this.plateNumber = plateNumber;
	}


	public String getPayFreight() {
		return payFreight;
	}
	public void setPayFreight(String payFreight) {
		this.payFreight = payFreight;
	}
	
	public String getTotalLoading() {
		return totalLoading;
	}
	public void setTotalLoading(String totalLoading) {
		this.totalLoading = totalLoading;
	}	
	
	
	public String getLoadingDate() {
		return loadingDate;
	}
	public void setLoadingDate(String loadingDate) {
		this.loadingDate = loadingDate;
	}	

	public String getTotalUnloading() {
		return totalUnloading;
	}
	public void setTotalUnloading(String totalUnloading) {
		this.totalUnloading = totalUnloading;
	}
	
	
	public String getUnloadingDate() {
		return unloadingDate;
	}
	public void setUnloadingDate(String unloadingDate) {
		this.unloadingDate = unloadingDate;
	}	
	

	public String getPayFreightNew() {
		return payFreightNew;
	}
	public void setPayFreightNew(String payFreightNew) {
		this.payFreightNew = payFreightNew;
	}
	
	public String getTotalLoadingNew() {
		return totalLoadingNew;
	}
	public void setTotalLoadingNew(String totalLoadingNew) {
		this.totalLoadingNew = totalLoadingNew;
	}	

	public String getLoadingDateNew() {
		return loadingDateNew;
	}
	public void setLoadingDateNew(String loadingDateNew) {
		this.loadingDateNew = loadingDateNew;
	}			
	
	public String getTotalUnloadingNew() {
		return totalUnloadingNew;
	}
	public void setTotalUnloadingNew(String totalUnloadingNew) {
		this.totalUnloadingNew = totalUnloadingNew;
	}		
	
	public String getUnloadingDateNew() {
		return unloadingDateNew;
	}
	public void setUnloadingDateNew(String unloadingDateNew) {
		this.unloadingDateNew = unloadingDateNew;
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
	
	public String getAuditor() {
		return auditor;
	}
	public void setAuditor(String auditor) {
		this.auditor = auditor;
	}
	
	public String getAuditorTime() {
		return auditorTime;
	}
	public void setAuditorTime(String auditorTime) {
		this.auditorTime = auditorTime;
	}
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}	
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}	
	public String getDispatchersID() {
		return dispatchersID;
	}
	public void setDispatchersID(String dispatchersID) {
		this.dispatchersID = dispatchersID;
	}	
	
	
	
	
}
