package com.fgwater.frame.mapper.wbb;

import java.util.List;

import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.KqSort;

public interface KqSortMapper extends BaseMapper<KqSort> {

	public List<KqSort> getAll();
	
}
