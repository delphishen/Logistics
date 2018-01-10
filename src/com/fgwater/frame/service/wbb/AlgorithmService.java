package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.Algorithm;

public interface AlgorithmService extends BaseService {

	public List<Algorithm> query(Map<String, String> params);

	public void update(Algorithm algorithm);

}
