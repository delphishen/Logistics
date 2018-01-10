package com.fgwater.frame.service.wbb;

import net.sf.json.JSONArray;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.QpSort;

public interface QpSortService extends BaseService {

	public JSONArray getAll();

	public boolean saveOrUpdate(QpSort qpSort);

	public void delete(QpSort qpSort);

}
