package com.fgwater.frame.service.wbb.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.StandardMapper;
import com.fgwater.frame.model.wbb.Standard;
import com.fgwater.frame.service.wbb.StandardService;

@Service("standardService")
public class StandardServiceImpl extends BaseServiceImpl implements
		StandardService {

	@Resource
	private StandardMapper standardMapper;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.standardMapper.query(params);
	}

	public boolean saveOrUpdate(Standard standard) {
		int count = this.standardMapper.check(standard, "name");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(standard.getId())) {
				standard.setId(UUIDUtils.getUUID());
				this.standardMapper.insert(standard);
			} else {
				this.standardMapper.update(standard);
			}
		}
		return count == 0;
	}

	public void delete(List<Standard> standards) {
		for (Standard standard : standards) {
			this.standardMapper.deleteLogic(standard);
		}
	}

}
