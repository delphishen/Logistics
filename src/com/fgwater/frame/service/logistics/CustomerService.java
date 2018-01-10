package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.Customer;

public interface CustomerService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public List<Customer> getAll();

	public boolean saveOrUpdate(Customer customer);

	public void delete(List<Customer> customer);

}
