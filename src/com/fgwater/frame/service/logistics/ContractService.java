package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.Contract;

public interface ContractService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public List<Contract> getAll();
	
	public boolean saveOrUpdate(Contract contract);

	public void delete(List<Contract> contract);

}
