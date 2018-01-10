package com.fgwater.frame.mapper.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.logistics.TruckType;

public interface TruckTypeMapper extends BaseMapper<TruckType> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);

	public List<TruckType> getAll(Map<String, String> params);

	public void saveTable(Map<String, String> params);

	public void updateTable(Map<String, String> params);

	public void deleteTable(Map<String, String> params);

	public int checkTruckTypeName(Map<String, String> params);	

}
