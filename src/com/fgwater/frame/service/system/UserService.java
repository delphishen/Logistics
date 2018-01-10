package com.fgwater.frame.service.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.system.User;

public interface UserService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public List<User> getAll(Map<String, String> params);

	public User findByEmpId(String empId);

	public User getByName(String name);

	public boolean saveOrUpdate(User user);

	public void delete(List<User> users);
	
	public boolean resetPassword(User user);
	
		

}
