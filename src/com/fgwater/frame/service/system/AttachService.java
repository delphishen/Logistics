package com.fgwater.frame.service.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.system.Attach;

public interface AttachService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public void save(Attach attach);

	public void delete(List<Attach> attachs);
}
