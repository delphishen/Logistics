package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.Truck;

public interface TruckService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public List<Truck> getAll(Map<String, String> params);

	public boolean saveOrUpdate(Truck truck);

	public void delete(List<Truck> truck);

}
