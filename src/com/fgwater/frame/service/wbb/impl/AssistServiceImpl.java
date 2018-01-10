package com.fgwater.frame.service.wbb.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.frame.mapper.wbb.AssistMapper;
import com.fgwater.frame.model.wbb.Assist;
import com.fgwater.frame.service.wbb.AssistService;

@Service("assistService")
public class AssistServiceImpl extends BaseServiceImpl implements AssistService {

	@Resource
	private AssistMapper assistMapper;

	public List<Assist> query(Map<String, String> params) {
		return this.assistMapper.query(params);
	}

}
