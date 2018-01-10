package com.fgwater.frame.mapper.system;

import java.util.List;
import java.util.Map;

import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.system.Menu;

public interface MenuMapper extends BaseMapper<Menu> {

	public List<Map<String, Object>> getAll();

	public List<Map<String, Object>> getByUserId(String userId); //菜单权限分配，读取选择的用户的菜单权限

}
