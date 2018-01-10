package com.fgwater.frame.service.wbb;

import net.sf.json.JSONArray;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.Muw;

public interface MuwService extends BaseService {

	public JSONArray getAll();

	public boolean saveOrUpdate(Muw muw);

	public void delete(Muw muw);

}
