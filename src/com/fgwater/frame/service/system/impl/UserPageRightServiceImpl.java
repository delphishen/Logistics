package com.fgwater.frame.service.system.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.system.UserPageRightMapper;
import com.fgwater.frame.model.system.UserPageRight;
import com.fgwater.frame.service.system.UserPageRightService;

@Service("rightService")
public class UserPageRightServiceImpl extends BaseServiceImpl implements
		UserPageRightService {

	@Resource
	private UserPageRightMapper userPageRightMapper;

	public List<Map<String, Object>> getByUserId(String userId) {
		return this.userPageRightMapper.getByUserId(userId);
	}
	 //菜单权限保存
	public void save(List<UserPageRight> list) {
		this.userPageRightMapper.deleteByField(UserPageRight.class, "userId",
				list.get(0).getUserId());
		for (UserPageRight pageRight : list) {
			pageRight.setId(UUIDUtils.getUUID());
			this.userPageRightMapper.insert(pageRight);
		}
	}

}
