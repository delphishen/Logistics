package com.fgwater.frame.mapper.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.logistics.DispatchListLog;

public interface DispatchListLogMapper extends BaseMapper<DispatchListLog> {

	@Paging
	public List<Map<String, String>> query(Map<String, Object> params);
	
	public List<DispatchListLog> getAll();

	public void saveTable(Map<String, String> params);

	public void updateTable(Map<String, String> params);

	public void deleteTable(Map<String, String> params);
	
	

}
