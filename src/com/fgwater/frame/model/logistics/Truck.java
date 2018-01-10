package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Truck")
@Table(name = "t_logistics_dossier_truck")
public class Truck extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String vehicleManager;
	@Column
	private String driver;
	@Column
	private String tel;
	@Column
	private String plateNumber;
	@Column
	private String truckModel;
	@Column
	private int DWT;
	@Column
	private String truckCargoType;
	@Column
	private String buyingTime;	
	@Column
	private String truckType;	
	@Column
	private String gradeID;	
	@Column
	private String dispatchers;
	@Column
	private String vehicleCondition;	

 
//	public User() {

//	}

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getVehicleManager() {
		return vehicleManager;
	}
	public void setVehicleManager(String vehicleManager) {
		this.vehicleManager = vehicleManager;
	}

	public String getDriver() {
		return driver;
	}
	public void setDriver(String driver) {
		this.driver = driver;
	}

	public String getTel() {
		return tel;
	}
	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getPlateNumber() {
		return plateNumber;
	}
	public void setPlateNumber(String plateNumber) {
		this.plateNumber = plateNumber;
	}

	public String getTruckModel() {
		return truckModel;
	}
	public void setTruckModel(String truckModel) {
		this.truckModel = truckModel;
	}

	public int getDWT() {
		return DWT;
	}
	public void setDWT(int DWT) {
		this.DWT = DWT;
	}

	public String getTruckCargoType() {
		return truckCargoType;
	}
	public void setTruckCargoType(String truckCargoType) {
		this.truckCargoType = truckCargoType;
	}
	
	
	public String getBuyingTime() {
		return buyingTime;
	}
	public void setBuyingTime(String buyingTime) {
		this.buyingTime = buyingTime;
	}	
	

	public String getTruckType() {
		return truckType;
	}
	public void setTruckType(String truckType) {
		this.truckType = truckType;
	}
	
	public String getGradeID() {
		return gradeID;
	}
	public void setGradeID(String gradeID) {
		this.gradeID = gradeID;
	}	
	
	public String getDispatchers() {
		return dispatchers;
	}
	public void setDispatchers(String dispatchers) {
		this.dispatchers = dispatchers;
	}		
	
	public String getVehicleCondition() {
		return vehicleCondition;
	}
	public void setVehicleCondition(String vehicleCondition) {
		this.vehicleCondition = vehicleCondition;
	}		
	
}
