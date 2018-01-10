package com.fgwater.frame.service.logistics;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.logistics.Grade;

public interface GradeService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> m);

	public List<Grade> getAll(Map<String, String> params);

	public boolean saveOrUpdate(Grade grade);

	public void delete(List<Grade> grade);

}
