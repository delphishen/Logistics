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
import com.fgwater.frame.mapper.logistics.DispatchListMapper;
import com.fgwater.frame.model.logistics.DispatchList;
import com.fgwater.frame.service.logistics.DispatchListService;

@Service("dispatchListService")
public class DispatchListServiceImpl extends BaseServiceImpl implements DispatchListService {

	@Resource
	private DispatchListMapper dispatchListMapper;

	public List<Map<String, String>> query(Map<String, String> m) {
		
		return this.dispatchListMapper.query(m);
	}

	public List<Map<String, String>> queryDispatchListCalendar(Map<String, String> m) {
		
		return this.dispatchListMapper.queryDispatchListCalendar(m);
	}	
	
	public List<DispatchList> exportDispatchList(Map<String, String> m) {
		
		return this.dispatchListMapper.exportDispatchList(m);
	}	

	public boolean saveOrUpdate(DispatchList dispatchList) {
		JSONObject jo = JSONObject.fromObject(dispatchList);
		Map<String, String> map = this.toMap(jo);

			if (StrUtils.isNullOrEmpty(map.get("id"))) {
				map.put("id", UUIDUtils.getUUID());	
				map.put("dispatchersID", UUIDUtils.getUUID());
				dispatchListMapper.saveTable(this.buildInsert(map));
			} else {
				//判断修改的数据是否超过设置的时间
				int count = this.dispatchListMapper.checkUpdateSystemTime(map);
				if (count >= 1) {
					//在规定的时间内可以修改
					dispatchListMapper.updateTable(this.buildUpdate(map));
				}
				
			}
		
		return true;
	}
	
	//任务单派车，批量新增或删除，无修改	
	public int batchSaveOrUpdate(List<DispatchList> dispatchLists) {
		int insertTotal=0;
		List<String> delPlateNumberList = new ArrayList<String>();
		HashMap<String,Object> delParam = new HashMap<String,Object>();
		String taskID="";
		String sendCarDate="";
		String dispatchersID="";
		
		for (DispatchList dispatchList : dispatchLists) {
			//取任务单号，日期，调度员，车牌			
			taskID= dispatchList.getTaskID();
			sendCarDate = dispatchList.getSendCarDate();
			dispatchersID = dispatchList.getDispatchersID();
			
			
			JSONObject jo = JSONObject.fromObject(dispatchList);
			Map<String, String> map = this.toMap(jo);	
			
//			//判断修改的数据是否超过设置的时间
//			int delCount = this.dispatchListMapper.checkUpdateSystemTime(map);
//			if (delCount >= 1) {
//				//在规定的时间内可以删除,添加到批量删除数组
//				
//			}
			delPlateNumberList.add(dispatchList.getPlateNumber());

		   //车牌不空 
			if (!dispatchList.getPlateNumber().trim().equals(""))
			{
				//同一任务单同一天只能有一个车牌，判断是否存在
				int count = this.dispatchListMapper.checkTaskIDplateNumber(map);
				if (count == 0) {	
					//dispatchList.setId(UUIDUtils.getUUID());
					// insert  已经封装. 需要 model 里面的字段跟数据库字段一致 
					//this.dispatchListMapper.insert(dispatchList);	
					map.put("id", UUIDUtils.getUUID());	
					dispatchListMapper.saveTable(this.buildInsert(map));			
					
					insertTotal++;
				}else{
					//已经存在判断是否要update
				}				
			}
			

		}
		//任务单号，日期，车牌  这些是从后端传到前端，判断是否有没删除的车牌
		//是根据前端处理后传到后端的list,根据任务单号，日期，车牌 把不包含在list里面的车牌信息删除
		//前端上传的都是以一个任务单同一日期 下的 车辆信息  
//		if (delPlateNumberList.size()==0)
//		{
//			delPlateNumberList.add("''");
//			delParam.put("plateNumber",delPlateNumberList);
//		}else
//		{
//			delParam.put("plateNumber",delPlateNumberList);
//		}	
		delParam.put("plateNumber",delPlateNumberList);
		delParam.put("taskID",taskID);
		delParam.put("sendCarDate",sendCarDate);	
		delParam.put("dispatchersID",dispatchersID);		
	   System.out.println("delete dispatchList======="+delParam.toString());
		 dispatchListMapper.batchDelete(delParam);
		 
		return insertTotal;
	}
	

	public void delete(List<DispatchList> dispatchLists) {
		for (DispatchList dispatchList : dispatchLists) {
			JSONObject jo = JSONObject.fromObject(dispatchList);
			Map<String, String> map = this.toMap(jo);
			
			//判断修改的数据是否超过设置的时间
			int count = this.dispatchListMapper.checkUpdateSystemTime(map);
			if (count >= 1) {
				//在规定的时间内可以删除
				dispatchListMapper.deleteTable(map);
			}			
			
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
		map.put("creator", SessionUtils.getCurrUserId());
	//	map.put("crTime", StrUtils.getCurrFormatTime());
		map.put("modifier", SessionUtils.getCurrUserId());
	//	map.put("moTime", StrUtils.getCurrFormatTime());
		map.put("flag", "1");
		return map;
	}

	public Map<String, String> buildUpdate(Map<String, String> map) {
		map.put("modifier", SessionUtils.getCurrUserId());
		map.put("moTime", StrUtils.getCurrFormatTime());
		return map;
	}
}
