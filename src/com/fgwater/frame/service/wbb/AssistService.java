package com.fgwater.frame.service.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.wbb.Assist;

public interface AssistService extends BaseService {

	public List<Assist> query(Map<String, String> params);

}
