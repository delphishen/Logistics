package com.fgwater.frame.service.result;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.info.StandardBelongSort;

import java.util.List;
import java.util.Map;

public interface ResultService extends BaseService {

	public List<Map<String, String>> getAll(String ids);

}
