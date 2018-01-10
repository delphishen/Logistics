package com.fgwater.frame.mapper.wbb;

import java.util.List;

import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.StandardFilterSort;

public interface StandardFilterSortMapper extends
		BaseMapper<StandardFilterSort> {

	public List<StandardFilterSort> getAll();

}
