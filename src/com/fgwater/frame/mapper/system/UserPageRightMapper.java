package com.fgwater.frame.mapper.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.system.UserPageRight;

public interface UserPageRightMapper extends BaseMapper<UserPageRight> {

	public List<Map<String, Object>> getByUserId(String roleId);

}
