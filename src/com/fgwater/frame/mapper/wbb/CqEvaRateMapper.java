package com.fgwater.frame.mapper.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.CqEvaRate;

public interface CqEvaRateMapper extends BaseMapper<CqEvaRate> {

	public List<Map<String, String>> query(Map<String, String> params);

	public void deleteAll();

}
