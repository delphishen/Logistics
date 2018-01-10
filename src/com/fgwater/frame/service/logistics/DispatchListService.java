package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.DispatchList;

public interface DispatchListService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);
	
	public List<Map<String, String>> queryDispatchListCalendar(Map<String, String> m);	
	
	public List<DispatchList> exportDispatchList(Map<String, String> m);

	public boolean saveOrUpdate(DispatchList dispatchList);
	//批量新增修改
	public int batchSaveOrUpdate(List<DispatchList> dispatchLists);	
	

	public void delete(List<DispatchList> dispatchLists);

}
