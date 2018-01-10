package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("DispatchList")
@Table(name = "t_logistics_dispatchList")
public class DispatchList extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String taskID;	
	@Column
	private String dispatchID;
	@Column
	private String plateNumber;
	@Column
	private String dispatchLines;
	@Column
	private String sendCarDate;
	@Column
	private String payFreight;
	@Column
	private String picture;	
	@Column
	private String totalLoading;
	@Column
	private String loadingDate;	
	@Column
	private String totalUnloading;
	@Column
	private String unloadingDate;	
	@Column
	private String difference;	
	@Column
	private String dispatchersID;
	@Column
	private String dispatchersName;		
	@Column
	private String paymentMethod;
	@Column
	private String taxYN;	
	@Column
	private String netReceiptsYN;	
	@Column
	private String moTime;	

	
	
	@Column
	private String cid;		
	@Column
	private String title;		
	@Column
	private String start;		
	@Column
	private String end;		
	
	@Column
	private String creator;		
	
	
	
	
//	public User() {

//	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getTaskID() {
		return taskID;
	}
	public void setTaskID(String taskID) {
		this.taskID = taskID;
	}

	
	public String getDispatchID() {
		return dispatchID;
	}
	public void setDispatchID(String dispatchID) {
		this.dispatchID = dispatchID;
	}

	public String getPlateNumber() {
		return plateNumber;
	}
	public void setPlateNumber(String plateNumber) {
		this.plateNumber = plateNumber;
	}

	public String getDispatchLines() {
		return dispatchLines;
	}
	public void setDispatchLines(String dispatchLines) {
		this.dispatchLines = dispatchLines;
	}
	
	public String getSendCarDate() {
		return sendCarDate;
	}
	public void setSendCarDate(String sendCarDate) {
		this.sendCarDate = sendCarDate;
	}	

	public String getPayFreight() {
		return payFreight;
	}
	public void setPayFreight(String payFreight) {
		this.payFreight = payFreight;
	}
	
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
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
	

	public String getDifference() {
		return difference;
	}
	public void setDifference(String difference) {
		this.difference = difference;
	}
	
	public String getDispatchersID() {
		return dispatchersID;
	}
	public void setDispatchersID(String dispatchersID) {
		this.dispatchersID = dispatchersID;
	}	

	public String getDispatchersName() {
		return dispatchersName;
	}
	public void setDispatchersName(String dispatchersName) {
		this.dispatchersName = dispatchersName;
	}			
	
	public String getPaymentMethod() {
		return paymentMethod;
	}
	public void setPaymentMethod(String paymentMethod) {
		this.paymentMethod = paymentMethod;
	}		
	
	public String getTaxYN() {
		return taxYN;
	}
	public void setTaxYN(String taxYN) {
		this.taxYN = taxYN;
	}		

	public String getNetReceiptsYN() {
		return netReceiptsYN;
	}
	public void setNetReceiptsYN(String netReceiptsYN) {
		this.netReceiptsYN = netReceiptsYN;
	}	
	
	public String getMoTime() {
		return moTime;
	}
	public void setMoTime(String moTime) {
		this.moTime = moTime;
	}
	
	
	
	
	
	public String getCid() {
		return cid;
	}
	public void setCid(String cid) {
		this.cid = cid;
	}
	
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getStart() {
		return start;
	}
	public void setStart(String start) {
		this.start = start;
	}
	
	public String getEnd() {
		return end;
	}
	public void setEnd(String end) {
		this.end = end;
	}	
	
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}	
	
	
}
