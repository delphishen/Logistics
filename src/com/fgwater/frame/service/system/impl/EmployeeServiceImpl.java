package com.fgwater.frame.service.system.impl;

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
import com.fgwater.frame.mapper.system.EmployeeMapper;
import com.fgwater.frame.model.system.Employee;
import com.fgwater.frame.model.system.User;
import com.fgwater.frame.service.system.EmployeeService;

@Service("employeeService")
public class EmployeeServiceImpl extends BaseServiceImpl implements
		EmployeeService {

	@Resource
	private EmployeeMapper employeeMapper;

	public List<Map<String, String>> query(Map<String, String> params) {
		User user = SessionUtils.getCurrUser();
		if (user.getIsAdmin() != 1) {
			params.put("isAdmin", "0");
		}
		return this.employeeMapper.query(params);
	}
	
	public List<Employee> getAll(Map<String, String> params) {
		
		//	JSONArray ja = JSONArray.fromObject(truckMapper.getAll(params));
		//	Object swap = ja;	
		//	System.out.println(swap.toString());

		return employeeMapper.getAll(params);
	}	

	public boolean saveOrUpdate(Employee employee) {
		JSONObject jo = JSONObject.fromObject(employee);
		Map<String, String> map = this.toMap(jo);
		int count = this.employeeMapper.checkName(map);
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(map.get("id"))) {
				map.put("id", UUIDUtils.getUUID());
				this.employeeMapper.saveEmployee(this.buildInsert(map));
			} else {
				this.employeeMapper.updateEmployee(this.buildUpdate(map));
			}
		}
		return count == 0;
	}

	public void delete(List<Employee> employees) {
		for (Employee employee : employees) {
			JSONObject jo = JSONObject.fromObject(employee);
			Map<String, String> map = this.toMap(jo);
			this.employeeMapper.deleteEmployee(map);
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
