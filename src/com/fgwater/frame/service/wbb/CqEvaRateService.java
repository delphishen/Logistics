package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.CqEvaRate;

public interface CqEvaRateService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public void saveOrUpdate(List<CqEvaRate> cqEvaRates);

	public void delete(List<CqEvaRate> cqEvaRates);

}
