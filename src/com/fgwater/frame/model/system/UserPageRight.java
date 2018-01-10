package com.fgwater.frame.model.system;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("UserPageRight")
@Table(name = "t_system_user_page_right")
public class UserPageRight extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;

	@Column
	private String userId;

	@Column
	private String menuId;
	
	@Column
	private boolean isModify;	
	
	@Column
	private boolean isAdd;
	
	@Column
	private boolean isDel;	
	
	@Column
	private boolean isSee;		
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getMenuId() {
		return menuId;
	}

	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}
	
	
	public boolean getIsModify() {
		return isModify;
	}

	public void setIsModify(boolean isModify) {
		this.isModify = isModify;
	}	
		
	public boolean getIsAdd() {
		return isAdd;
	}

	public void setIsAdd(boolean isAdd) {
		this.isAdd = isAdd;
	}	
	
	
	public boolean getIsDel() {
		return isDel;
	}

	public void setIsDel(boolean isDel) {
		this.isDel = isDel;
	}	
		
	public boolean getIsSee() {
		return isSee;
	}

	public void setIsSee(boolean isSee) {
		this.isSee = isSee;
	}	
	
}
