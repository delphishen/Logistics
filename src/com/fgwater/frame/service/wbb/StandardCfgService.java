package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.StandardCfg;

public interface StandardCfgService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public void saveOrUpdate(List<StandardCfg> standardCfgs);

	public void delete(List<StandardCfg> standardCfgs);

}
