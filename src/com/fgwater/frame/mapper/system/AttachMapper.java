package com.fgwater.frame.mapper.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.system.Attach;

public interface AttachMapper extends BaseMapper<Attach> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);

	public Attach getById(String id);

}
