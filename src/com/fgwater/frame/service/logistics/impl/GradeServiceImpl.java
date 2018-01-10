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
import com.fgwater.frame.mapper.logistics.GradeMapper;
import com.fgwater.frame.model.logistics.Grade;
import com.fgwater.frame.service.logistics.GradeService;

@Service("gradeService")
public class GradeServiceImpl extends BaseServiceImpl implements GradeService {

	@Resource
	private GradeMapper gradeMapper;

	public List<Map<String, String>> query(Map<String, String> m) {
		
		return this.gradeMapper.query(m);
	}

	public List<Grade> getAll(Map<String, String> params) {
		
		//	JSONArray ja = JSONArray.fromObject(truckMapper.getAll(params));
		//	Object swap = ja;	
		//	System.out.println(swap.toString());

		return gradeMapper.getAll(params);
	}

	
	public boolean saveOrUpdate(Grade grade) {
		JSONObject jo = JSONObject.fromObject(grade);
		Map<String, String> map = this.toMap(jo);
	//	System.out.println("saveLines=map.toString==="+map.toString());
		int count = this.gradeMapper.checkName(map);
		if (count == 0) {			
			if (StrUtils.isNullOrEmpty(map.get("id"))) {
				map.put("id", UUIDUtils.getUUID());	
				gradeMapper.saveTable(this.buildInsert(map));
			} else {
				gradeMapper.updateTable(this.buildUpdate(map));
			}
		}
		return count == 0;		

	}

	public void delete(List<Grade> grades) {
		for (Grade grade : grades) {
			JSONObject jo = JSONObject.fromObject(grade);
			Map<String, String> map = this.toMap(jo);
			gradeMapper.deleteTable(map);
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
