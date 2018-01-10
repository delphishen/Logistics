package com.fgwater.frame.service.info;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.info.StandardBelongSort;

public interface StandardBelongSortService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public boolean saveOrUpdate(StandardBelongSort standardBelongSort);

	public void delete(List<StandardBelongSort> standardBelongSorts);

	public List<StandardBelongSort> getAll();
}
