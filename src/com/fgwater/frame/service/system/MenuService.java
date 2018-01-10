package com.fgwater.frame.service.system;

import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import com.fgwater.core.service.BaseService;
import com.fgwater.frame.model.system.Menu;

public interface MenuService extends BaseService {

	public JSONArray getAllMenus();  //菜单权限分配读取所有菜单

	public List<Map<String, Object>> getByUserId(String userId);  //菜单权限分配，读取选择的用户的菜单权限

	public JSONArray getMenusByUserId(String userId);   //系统登录根据用户权限读取菜单

	public boolean saveOrUpdate(Menu menu);

	public void delete(Menu menu);
}
