package com.fgwater.frame.service.logistics.impl;

import java.util.ArrayList;
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
import com.fgwater.frame.mapper.logistics.DispatchListLogMapper;
import com.fgwater.frame.mapper.logistics.DispatchListLogWorkflowMapper;
import com.fgwater.frame.model.logistics.DispatchListLog;
import com.fgwater.frame.service.logistics.DispatchListLogService;

@Service("dispatchListLogService")
public class DispatchListLogServiceImpl extends BaseServiceImpl implements DispatchListLogService {

	@Resource
	private DispatchListLogMapper dispatchListLogMapper;
	
	@Resource
	private DispatchListLogWorkflowMapper dispatchListLogWorkflowMapper;	

	public List<Map<String, String>> query(Map<String, String> m) {
		
	//	HashMap<String,Object> param = new HashMap<String,Object>();
		List<String> status = new ArrayList<String>();
		
		HashMap<String,Object> queryParam = new HashMap<String,Object>();
		String param=m.get("status");
		
	//	System.out.println("status============="+param);
		
		String[] strArray = null;   
	    strArray = param.split(","); 
	    for(int i=0;i<strArray.length;i++){
	    	status.add(strArray[i]);
	 //   	System.out.println("status============="+strArray[i]);
	    }		

		queryParam.put("status",status);
		queryParam.put("dispatchersID",m.get("dispatchersID"));	
		
		System.out.println("dispatchListLogWorkflowMapper============="+m.toString());
		return this.dispatchListLogMapper.query(queryParam);
	}

	
	
	public boolean saveOrUpdate(List<DispatchListLog> dispatchListLog) {
	
		for (DispatchListLog pageRight : dispatchListLog) {
			
			JSONObject jo = JSONObject.fromObject(pageRight);
			Map<String, String> map = this.toMap(jo);				
			

		//	System.out.println("DispatchListLog============="+map.toString());		

				
				if (StrUtils.isNullOrEmpty(map.get("id"))) {
				    map.put("id", UUIDUtils.getUUID());
					this.dispatchListLogMapper.saveTable(this.buildInsert(map));

				} else {
					this.dispatchListLogMapper.updateTable(this.buildUpdate(map));
				}		
				
				//记录到审批流程日志表,字段需要与 t_logistics_dispatchList_log 表一致
				map.put("dispatchListLogID",map.get("id"));
			//	System.out.println("DispatchListLog============="+map.toString());		
				this.dispatchListLogWorkflowMapper.saveTable(this.buildInsert(map));				
						
		}

		
		return true;
	}
	

	public void delete(List<DispatchListLog> dispatchListLogs) {
		for (DispatchListLog dispatchListLog : dispatchListLogs) {
			JSONObject jo = JSONObject.fromObject(dispatchListLog);
			Map<String, String> map = this.toMap(jo);
			dispatchListLogMapper.deleteTable(map);
		}
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
