package com.fgwater.frame.service.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.system.Employee;

public interface EmployeeService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);
	
	public List<Employee> getAll(Map<String, String> params);

	public boolean saveOrUpdate(Employee employee);

	public void delete(List<Employee> employees);
}
