package com.fgwater.frame.mapper.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.logistics.DispatchListLogWorkflow;

public interface DispatchListLogWorkflowMapper extends BaseMapper<DispatchListLogWorkflow> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);	

	public void saveTable(Map<String, String> params);
	

}
