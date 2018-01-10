package com.fgwater.frame.service.logistics.impl;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.SessionUtils;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.logistics.TaskListMapper;
import com.fgwater.frame.model.logistics.TaskList;
import com.fgwater.frame.service.logistics.TaskListService;

@Service("taskListService")
public class TaskListServiceImpl extends BaseServiceImpl implements TaskListService {

	@Resource
	private TaskListMapper taskListMapper;

	public List<Map<String, String>> query(Map<String, String> m) {
		
		return this.taskListMapper.query(m);
	}


	public JSONArray getTreeAll(Map<String, String> m) {
		JSONArray ja = JSONArray.fromObject(this.taskListMapper.getTreeAll(m));
		return this.getByRoot(ja, "0", new JSONArray());
	//	return ja;
	}	

	public boolean saveOrUpdate(TaskList taskList) {
		JSONObject jo = JSONObject.fromObject(taskList);
		Map<String, String> map = this.toMap(jo);

			if (StrUtils.isNullOrEmpty(map.get("id"))) {
				map.put("id", UUIDUtils.getUUID());	
				taskListMapper.saveTable(this.buildInsert(map));
			} else {
				taskListMapper.updateTable(this.buildUpdate(map));
			}
		
		return true;
	}

	public void delete(List<TaskList> taskLists) {
		for (TaskList taskList : taskLists) {
			JSONObject jo = JSONObject.fromObject(taskList);
			Map<String, String> map = this.toMap(jo);
			taskListMapper.deleteTable(map);
		}
	}

	private JSONArray getByRoot(JSONArray ja, String root, JSONArray res) {
		for (int i = 0; i < ja.size(); i++) {
			JSONObject jo = ja.getJSONObject(i);
			if (root.equals(jo.getString("fatherId"))) {
				JSONArray children = new JSONArray();
				children = this.getByRoot(ja, jo.getString("id"), children);
				if (children.size() == 0) {
					jo.put("leaf", true);
				} else {
					jo.put("leaf", false);
					jo.put("expanded", true);
					jo.put("children", children);
				}
				res.add(jo);
			}
		}
		return res;
	}	
	

	@SuppressWarnings("unchecked")
	private Map<String, String> toMap(JSONObject jo) {
		Map<String, String> map = new HashMap<String, String>();
		Iterator<String> iterator = jo.keys();
		while (iterator.hasNext()) {
			String key = iterator.next();
			map.put(key, jo.getString(key));
		}
		return map;
	}

	public Map<String, String> buildInsert(Map<String, String> map) {
		map.put("creator", SessionUtils.getCurrUserId());
		map.put("crTime", StrUtils.getCurrFormatTime());
		map.put("modifier", SessionUtils.getCurrUserId());
		map.put("moTime", StrUtils.getCurrFormatTime());
		map.put("flag", "1");
		return map;
	}

	public Map<String, String> buildUpdate(Map<String, String> map) {
		map.put("modifier", SessionUtils.getCurrUserId());
		map.put("moTime", StrUtils.getCurrFormatTime());
		return map;
	}
}
