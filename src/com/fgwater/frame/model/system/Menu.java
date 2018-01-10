package com.fgwater.frame.model.system;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Menu")
@Table(name = "t_system_menu")
public class Menu extends BaseModel {

	private static final long serialVersionUID = 1L;

	// @Relations( { @Relation(table = "1", field = "a")
	// ,@Relation(table = "2", field = "b") }) 多关联
	// @Relation(table = "t_system_menu", field = "fatherId")
	@Id
	private String id;

	@Column
	private String text;

	@Column
	private String fatherId;

	@Column
	private String iconCls;

	@Column
	private int leaf;

	@Column
	private String link;

	@Column
	private int seq;
	
	@Column
	private boolean isModify;	
	
	@Column
	private boolean isAdd;
	
	@Column
	private boolean isDel;	
	
	@Column
	private boolean isSee;		
	

	

	public Menu() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

	public int getLeaf() {
		return leaf;
	}

	public void setLeaf(int leaf) {
		this.leaf = leaf;
	}

	public String getLink() {
		return link;
	}

	public void setLink(String link) {
		this.link = link;
	}

	public int getSeq() {
		return seq;
	}

	public void setSeq(int seq) {
		this.seq = seq;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
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
