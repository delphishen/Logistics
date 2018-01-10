package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.Lines;

public interface LinesService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public List<Lines> getAll();

	public boolean saveOrUpdate(Lines lines);

	public void delete(List<Lines> lines);

}
