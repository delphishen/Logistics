package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.Standard;

public interface StandardService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public boolean saveOrUpdate(Standard standard);

	public void delete(List<Standard> standards);

}
