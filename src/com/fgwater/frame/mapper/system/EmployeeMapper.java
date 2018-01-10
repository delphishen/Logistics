package com.fgwater.frame.mapper.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.system.Employee;

public interface EmployeeMapper extends BaseMapper<Employee> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);
	
	public List<Employee> getAll(Map<String, String> params);

	public void saveEmployee(Map<String, String> params);

	public void updateEmployee(Map<String, String> params);

	public void deleteEmployee(Map<String, String> params);

	public int checkName(Map<String, String> params);

}
