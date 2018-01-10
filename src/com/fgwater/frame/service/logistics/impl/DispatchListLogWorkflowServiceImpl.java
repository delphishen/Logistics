package com.fgwater.frame.service.logistics.impl;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.SessionUtils;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.logistics.DispatchListLogWorkflowMapper;
import com.fgwater.frame.model.logistics.DispatchListLogWorkflow;
import com.fgwater.frame.service.logistics.DispatchListLogWorkflowService;

@Service("dispatchListLogWorkflowService")
public class DispatchListLogWorkflowServiceImpl extends BaseServiceImpl implements DispatchListLogWorkflowService {

	@Resource
	private DispatchListLogWorkflowMapper dispatchListLogWorkflowMapper;

	public List<Map<String, String>> query(Map<String, String> m) {
		
		return this.dispatchListLogWorkflowMapper.query(m);
	}

	
	
	
	public boolean saveOrUpdate(List<DispatchListLogWorkflow> dispatchListLogWorkflow) {
	
		for (DispatchListLogWorkflow pageRight : dispatchListLogWorkflow) {
			
			JSONObject jo = JSONObject.fromObject(pageRight);
			Map<String, String> map = this.toMap(jo);				
			
			System.out.println("DispatchListLogWorkflow============="+map.toString());
				//pageRight.setId(UUIDUtils.getUUID());
			    map.put("id", UUIDUtils.getUUID());
				this.dispatchListLogWorkflowMapper.saveTable(this.buildInsert(map));
						
		}

		
		return true;
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
		//map.put("dispatchersID", SessionUtils.getCurrUserId());		
		
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
