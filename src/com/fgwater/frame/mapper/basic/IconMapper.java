package com.fgwater.frame.mapper.basic;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.basic.Icon;

public interface IconMapper extends BaseMapper<Icon> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);

	public void defaultIcon(int type);

}
