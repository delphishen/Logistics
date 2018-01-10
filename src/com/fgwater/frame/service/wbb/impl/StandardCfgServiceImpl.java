package com.fgwater.frame.service.wbb.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.StandardCfgMapper;
import com.fgwater.frame.model.wbb.StandardCfg;
import com.fgwater.frame.service.wbb.StandardCfgService;

@Service("standardCfgService")
public class StandardCfgServiceImpl extends BaseServiceImpl implements
		StandardCfgService {

	@Resource
	private StandardCfgMapper standardCfgMapper;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.standardCfgMapper.query(params);
	}

	public void saveOrUpdate(List<StandardCfg> standardCfgs) {
		for (StandardCfg standardCfg : standardCfgs) {
			if (StrUtils.isNullOrEmpty(standardCfg.getId())) {
				standardCfg.setId(UUIDUtils.getUUID());
				this.standardCfgMapper.insert(standardCfg);
			} else {
				this.standardCfgMapper.update(standardCfg);
			}
		}
	}

	public void delete(List<StandardCfg> standardCfgs) {
		for (StandardCfg standardCfg : standardCfgs) {
			this.standardCfgMapper.deletePhysical(standardCfg);
		}
	}

}
