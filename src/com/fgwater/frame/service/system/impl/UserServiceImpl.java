package com.fgwater.frame.service.system.impl;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.SessionUtils;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.system.UserMapper;
import com.fgwater.frame.model.system.User;
import com.fgwater.frame.service.system.UserService;

@Service("userService")
public class UserServiceImpl extends BaseServiceImpl implements UserService {

	@Resource
	private UserMapper userMapper;

	public List<Map<String, String>> query(Map<String, String> m) {
		User user = SessionUtils.getCurrUser();
		if (user.getIsAdmin() != 1) {
			m.put("isAdmin", "0");
		}
		return this.userMapper.query(m);
	}

	public User findByEmpId(String empId) {
		return this.userMapper.findByEmpId(empId);
	}

	public List<User> getAll(Map<String, String> params) {
		return userMapper.getAll(params);
	}

	public User getByName(String name) {
		return this.userMapper.getByName(name);
	}

	public boolean saveOrUpdate(User user) {
		JSONObject jo = JSONObject.fromObject(user);
		Map<String, String> map = this.toMap(jo);
		int count = this.userMapper.checkName(map);
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(map.get("id"))) {
				map.put("id", UUIDUtils.getUUID());
				String num = "";
				Random random = new Random();
				for (int i = 0; i < 6; i++) {
					num += random.nextInt(10);
				}			
				map.put("password", num);
				userMapper.saveUser(this.buildInsert(map));
			} else {
				userMapper.updateUser(this.buildUpdate(map));
			}
		}
		return count == 0;
	}
	
	
	
	public boolean resetPassword(User user) {
		JSONObject jo = JSONObject.fromObject(user);
		Map<String, String> map = this.toMap(jo);		
	//	System.out.println("resetPassword==="+jo.toString());
//				String num = "";
//				Random random = new Random();
//				for (int i = 0; i < 6; i++) {
//					num += random.nextInt(10);
//				}
//				map.put("password", num);		
				userMapper.resetPassword(this.buildUpdate(map));
			
		
		return true;
	}	
	

	public void delete(List<User> users) {
		for (User user : users) {
			JSONObject jo = JSONObject.fromObject(user);
			Map<String, String> map = this.toMap(jo);
			userMapper.deleteUser(map);
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
