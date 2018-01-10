package com.fgwater.frame.model.logistics;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.ibatis.type.Alias;

import com.fgwater.core.model.BaseModel;

@Alias("Lines")
@Table(name = "t_logistics_dossier_lines")
public class Lines extends BaseModel {

	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	@Column
	private String linesName;
	@Column
	private String lng;
	@Column
	private String lat;
	
 	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	public String getLinesName() {
		return linesName;
	}
	public void setLinesName(String linesName) {
		this.linesName = linesName;
	}

	public String getLng() {
		return lng;
	}
	public void setLng(String lng) {
		this.lng = lng;
	}

	public String getLat() {
		return lat;
	}
	public void setLat(String lat) {
		this.lat = lat;
	}
	
	
}
