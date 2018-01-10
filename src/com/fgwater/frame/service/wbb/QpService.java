package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.Qp;

public interface QpService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public boolean saveOrUpdate(Qp qp);

	public boolean delete(Qp qp);

}
