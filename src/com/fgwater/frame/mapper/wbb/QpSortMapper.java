package com.fgwater.frame.mapper.wbb;

import java.util.List;

import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.QpSort;

public interface QpSortMapper extends BaseMapper<QpSort> {

	public List<QpSort> getAll();

}
