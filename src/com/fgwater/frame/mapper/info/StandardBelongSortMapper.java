package com.fgwater.frame.mapper.info;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.info.StandardBelongSort;

public interface StandardBelongSortMapper extends
		BaseMapper<StandardBelongSort> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);

	public List<StandardBelongSort> getAll();

}
