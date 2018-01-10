package com.fgwater.frame.mapper.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.Assist;

public interface AssistMapper extends BaseMapper<Assist> {

	@Paging
	public List<Assist> query(Map<String, String> params);

}
