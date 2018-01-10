package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("TaskList")
@Table(name = "t_logistics_taskList")
public class TaskList extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String taskID;
	@Column
	private String dateBegin;
	@Column
	private String dateEnd;
	@Column
	private String customerID;
	@Column
	private String customerName;
	@Column
	private String loadingPoint;
	@Column
	private String loadingPointID;	
	@Column
	private String unloadingPoint;
	@Column
	private String unloadingPointID;	
	@Column
	private String cargoType;
	@Column
	private String shipName;	
	@Column
	private String contract;	
	@Column
	private String trafficVolume;	
	@Column
	private String residualQuantity;
	@Column
	private String freight;	
	@Column
	private String payFreight;		
	

	@Column
	private String isYN;	
	@Column
	private String receivablesMethod;	
	@Column
	private String salesman;	
	@Column
	private String salesmanID;	
	@Column
	private String taskCondition;		
	@Column
	private String text;	
	@Column
	private String fatherId;	
	
	@Column
	private String contractID;	
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

	public String getDateBegin() {
		return dateBegin;
	}
	public void setDateBegin(String dateBegin) {
		this.dateBegin = dateBegin;
	}

	public String getDateEnd() {
		return dateEnd;
	}
	public void setDateEnd(String dateEnd) {
		this.dateEnd = dateEnd;
	}

	public String getCustomerID() {
		return customerID;
	}
	public void setCustomerID(String customerID) {
		this.customerID = customerID;
	}
	
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}	

	public String getLoadingPoint() {
		return loadingPoint;
	}
	public void setLoadingPoint(String loadingPoint) {
		this.loadingPoint = loadingPoint;
	}
	
	public String getLoadingPointID() {
		return loadingPointID;
	}
	public void setLoadingPointID(String loadingPointID) {
		this.loadingPointID = loadingPointID;
	}	

	public String getUnloadingPoint() {
		return unloadingPoint;
	}
	public void setUnloadingPoint(String unloadingPoint) {
		this.unloadingPoint = unloadingPoint;
	}
	
	public String getUnloadingPointID() {
		return unloadingPointID;
	}
	public void setUnloadingPointID(String unloadingPointID) {
		this.unloadingPointID = unloadingPointID;
	}	

	public String getCargoType() {
		return cargoType;
	}
	public void setCargoType(String cargoType) {
		this.cargoType = cargoType;
	}
	
	
	public String getShipName() {
		return shipName;
	}
	public void setShipName(String shipName) {
		this.shipName = shipName;
	}	
	

	public String getContract() {
		return contract;
	}
	public void setContract(String contract) {
		this.contract = contract;
	}
	
	public String getTrafficVolume() {
		return trafficVolume;
	}
	public void setTrafficVolume(String trafficVolume) {
		this.trafficVolume = trafficVolume;
	}	
	
	public String getResidualQuantity() {
		return residualQuantity;
	}
	public void setResidualQuantity(String residualQuantity) {
		this.residualQuantity = residualQuantity;
	}		
	
	public String getFreight() {
		return freight;
	}
	public void setFreight(String freight) {
		this.freight = freight;
	}		
	
	public String getPayFreight() {
		return payFreight;
	}
	public void setPayFreight(String payFreight) {
		this.payFreight = payFreight;
	}		
	
	
	
	public String getIsYN() {
		return isYN;
	}
	public void setIsYN(String isYN) {
		this.isYN = isYN;
	}		

	public String getReceivablesMethod() {
		return receivablesMethod;
	}
	public void setReceivablesMethod(String receivablesMethod) {
		this.receivablesMethod = receivablesMethod;
	}	
	
	public String getSalesman() {
		return salesman;
	}
	public void setSalesman(String salesman) {
		this.salesman = salesman;
	}
	
	public String getSalesmanID() {
		return salesmanID;
	}
	public void setSalesmanID(String salesmanID) {
		this.salesmanID = salesmanID;
	}	
	
	public String getTaskCondition() {
		return taskCondition;
	}
	public void setTaskCondition(String taskCondition) {
		this.taskCondition = taskCondition;
	}		
	
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}	
	
	
	public String getFatherId() {
		return fatherId;
	}
	public void setFatherId(String fatherId) {
		this.fatherId = fatherId;
	}		
	public String getContractID() {
		return contractID;
	}
	public void setContractID(String contractID) {
		this.contractID = contractID;
	}		
	
	
	
}
