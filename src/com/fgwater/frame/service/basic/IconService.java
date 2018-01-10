package com.fgwater.frame.service.basic;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.basic.Icon;

public interface IconService extends BaseService {

	public List<Map<String, String>> query(Map<String, String> params);

	public boolean saveOrUpdate(Icon icon);

	public void delete(List<Icon> icons);

	public void defaultIcon(Icon icon);

}
