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
import com.fgwater.frame.mapper.logistics.TruckMapper;
import com.fgwater.frame.model.logistics.Truck;
import com.fgwater.frame.service.logistics.TruckService;

@Service("truckService")
public class TruckServiceImpl extends BaseServiceImpl implements TruckService {

	@Resource
	private TruckMapper truckMapper;

	public List<Map<String, String>> query(Map<String, String> m) {
		
		return this.truckMapper.query(m);
	}

	public List<Truck> getAll(Map<String, String> params) {
		
		//	JSONArray ja = JSONArray.fromObject(truckMapper.getAll(params));
		//	Object swap = ja;	
		//	System.out.println(swap.toString());

		return truckMapper.getAll(params);
	}

	
	public boolean saveOrUpdate(Truck truck) {
		JSONObject jo = JSONObject.fromObject(truck);
		Map<String, String> map = this.toMap(jo);
		
		int count = this.truckMapper.checkPlateNumber(map);
		if (count == 0) {		
			if (StrUtils.isNullOrEmpty(map.get("id"))) {
				map.put("id", UUIDUtils.getUUID());	
				truckMapper.saveTable(this.buildInsert(map));
			} else {
				truckMapper.updateTable(this.buildUpdate(map));
			}
		}
		return count == 0;
	}

	public void delete(List<Truck> trucks) {
		for (Truck truck : trucks) {
			JSONObject jo = JSONObject.fromObject(truck);
			Map<String, String> map = this.toMap(jo);
			truckMapper.deleteTable(map);
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
