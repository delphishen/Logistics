package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.Cq;

public interface CqService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public void saveOrUpdate(Cq cq);

	public void delete(List<Cq> cqs);

}
