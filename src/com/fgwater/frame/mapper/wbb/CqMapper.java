package com.fgwater.frame.mapper.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.Cq;

public interface CqMapper extends BaseMapper<Cq> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);

}
