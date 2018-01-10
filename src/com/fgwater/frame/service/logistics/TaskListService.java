package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.TaskList;

import net.sf.json.JSONArray;

public interface TaskListService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public JSONArray getTreeAll(Map<String, String> m);
	
	public boolean saveOrUpdate(TaskList taskList);

	public void delete(List<TaskList> taskList);

}
