package com.fgwater.frame.mapper.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.Algorithm;

public interface AlgorithmMapper extends BaseMapper<Algorithm> {

	@Paging
	public List<Algorithm> query(Map<String, String> params);

}
