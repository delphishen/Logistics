package com.fgwater.frame.service.wbb.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.frame.mapper.wbb.AlgorithmMapper;
import com.fgwater.frame.model.wbb.Algorithm;
import com.fgwater.frame.service.wbb.AlgorithmService;

@Service("algorithmService")
public class AlgorithmServiceImpl extends BaseServiceImpl implements
		AlgorithmService {

	@Resource
	private AlgorithmMapper algorithmMapper;

	public List<Algorithm> query(Map<String, String> params) {
		return this.algorithmMapper.query(params);
	}

	public void update(Algorithm algorithm) {
		this.algorithmMapper.update(algorithm);
	}

}
