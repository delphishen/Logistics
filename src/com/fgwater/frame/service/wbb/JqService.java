package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.Jq;

public interface JqService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public List<Map<String, String>> queryRp(Map<String, String> params);

	public boolean saveOrUpdate(Jq jq);

	public void delete(List<Jq> jqs);

}
