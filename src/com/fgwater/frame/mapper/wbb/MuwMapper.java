package com.fgwater.frame.mapper.wbb;

import java.util.List;

import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.Muw;

public interface MuwMapper extends BaseMapper<Muw> {

	public List<Muw> getAll();
	
}
