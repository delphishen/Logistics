package com.fgwater.frame.service.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.system.UserPageRight;

public interface UserPageRightService extends BaseService {

	public List<Map<String, Object>> getByUserId(String userId);

	public void save(List<UserPageRight> list);   //菜单权限保存

}
