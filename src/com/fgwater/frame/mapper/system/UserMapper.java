package com.fgwater.frame.mapper.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.system.User;

public interface UserMapper extends BaseMapper<User> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);

	public List<User> getAll(Map<String, String> params);

	public User findByEmpId(String empId);

	public User getByName(String name);

	public int checkName(Map<String, String> params);

	public void saveUser(Map<String, String> params);

	public void updateUser(Map<String, String> params);

	public void deleteUser(Map<String, String> params);
	
	public void resetPassword(Map<String, String> params);	

}
