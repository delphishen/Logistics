package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.DispatchListLog;

public interface DispatchListLogService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public boolean saveOrUpdate(List<DispatchListLog> list);

	public void delete(List<DispatchListLog> dispatchListLogs);

}
