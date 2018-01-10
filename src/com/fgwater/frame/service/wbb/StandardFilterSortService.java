package com.fgwater.frame.service.wbb;

import net.sf.json.JSONArray;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.StandardFilterSort;

public interface StandardFilterSortService extends BaseService {

	public JSONArray getAll();

	public boolean saveOrUpdate(StandardFilterSort standardFilterSort);

	public void delete(StandardFilterSort standardFilterSort);

}
