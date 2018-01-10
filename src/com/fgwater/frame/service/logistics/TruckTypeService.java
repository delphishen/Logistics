package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.TruckType;

public interface TruckTypeService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public List<TruckType> getAll(Map<String, String> params);

	public boolean saveOrUpdate(TruckType truckType);

	public void delete(List<TruckType> truckType);

}
