package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.Kq;

public interface KqService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public List<Map<String, String>> queryKqEvolve(Map<String, String> params);

	public boolean saveOrUpdate(Kq kq);

	public void delete(List<Kq> kqs);

}
