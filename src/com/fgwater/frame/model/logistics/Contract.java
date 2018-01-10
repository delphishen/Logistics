package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Contract")
@Table(name = "t_logistics_contract")
public class Contract extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String contractNO;
	@Column
	private String customerID;
	@Column
	private String loadingPointID;
	@Column
	private String unloadingPointID;
	@Column
	private String freight;
	@Column
	private String taxYN;	

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getContractNO() {
		return contractNO;
	}
	public void setContractNO(String contractNO) {
		this.contractNO = contractNO;
	}

	public String getCustomerID() {
		return customerID;
	}
	public void setCustomerID(String customerID) {
		this.customerID = customerID;
	}

	public String getLoadingPointID() {
		return loadingPointID;
	}
	public void setLoadingPointID(String loadingPointID) {
		this.loadingPointID = loadingPointID;
	}

	public String getUnloadingPointID() {
		return unloadingPointID;
	}
	public void setUnloadingPointID(String unloadingPointID) {
		this.unloadingPointID = unloadingPointID;
	}

	public String getFreight() {
		return freight;
	}
	public void setFreight(String freight) {
		this.freight = freight;
	}

	public String getTaxYN() {
		return taxYN;
	}
	public void setTaxYN(String taxYN) {
		this.taxYN = taxYN;
	}	
	
}
