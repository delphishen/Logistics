package com.fgwater.frame.service.wbb.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.CqEvaRateMapper;
import com.fgwater.frame.model.wbb.CqEvaRate;
import com.fgwater.frame.service.wbb.CqEvaRateService;

@Service("cqEvaRateService")
public class CqEvaRateServiceImpl extends BaseServiceImpl implements
		CqEvaRateService {

	@Resource
	private CqEvaRateMapper cqEvaRateMapper;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.cqEvaRateMapper.query(params);
	}

	public void saveOrUpdate(List<CqEvaRate> cqEvaRates) {
		this.cqEvaRateMapper.deleteAll();
		for (CqEvaRate cqEvaRate : cqEvaRates) {
			cqEvaRate.setId(UUIDUtils.getUUID());
			this.cqEvaRateMapper.insert(cqEvaRate);
		}
	}

	public void delete(List<CqEvaRate> cqEvaRates) {
		for (CqEvaRate cqEvaRate : cqEvaRates) {
			this.cqEvaRateMapper.deletePhysical(cqEvaRate);
		}
	}

}
