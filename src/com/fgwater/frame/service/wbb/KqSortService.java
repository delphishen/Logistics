package com.fgwater.frame.service.wbb;

import net.sf.json.JSONArray;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.KqSort;

public interface KqSortService extends BaseService {

	public JSONArray getAll();

	public boolean saveOrUpdate(KqSort kqSort);

	public void delete(KqSort kqSort);

}
