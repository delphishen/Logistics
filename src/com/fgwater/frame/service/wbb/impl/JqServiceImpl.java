package com.fgwater.frame.service.wbb.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.JqMapper;
import com.fgwater.frame.mapper.wbb.QpMapper;
import com.fgwater.frame.mapper.wbb.RpMapper;
import com.fgwater.frame.model.wbb.Jq;
import com.fgwater.frame.model.wbb.Qp;
import com.fgwater.frame.service.wbb.JqService;

@Service("jqService")
public class JqServiceImpl extends BaseServiceImpl implements JqService {

	@Resource
	private JqMapper jqMapper;

	@Resource
	private RpMapper rpMapper;

	@Resource
	private QpMapper qpMapper;

	/**
	 * dirtyJq因子ID并集序列
	 */
	private List<String> dirtyJqElIdUnionList;

	/**
	 * dirtyJq序列对应的因子构成表
	 */
	private Map<String, List<String>> dirtyJqElStructureMap;

	/**
	 * 因子检索表
	 */
	private Map<String, String> elRetrievalMap;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.jqMapper.query(params);
	}

	public List<Map<String, String>> queryRp(Map<String, String> params) {
		return this.rpMapper.query(params);
	}

	public boolean saveOrUpdate(Jq jq) {
		this.dirtyJqElIdUnionList = new ArrayList<String>();
		this.dirtyJqElStructureMap = new HashMap<String, List<String>>();
		this.elRetrievalMap = new HashMap<String, String>();

		int count = this.jqMapper.check(jq, "name");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(jq.getId())) {
				jq.setId(UUIDUtils.getUUID());
				this.analyzeJq(jq);
				this.buildElRetrievalMap(this.dirtyJqElIdUnionList);
				this.jqMapper.insert(this.rebuildDirtyJq(jq));
			} else {
				this.analyzeJq(jq);
				this.buildElRetrievalMap(this.dirtyJqElIdUnionList);
				this.jqMapper.update(this.rebuildDirtyJq(jq));
			}
		}
		return count == 0;
	}

	public void delete(List<Jq> jqs) {
		for (Jq jq : jqs) {
			this.jqMapper.deleteLogic(jq);
		}
	}

	private void analyzeJq(Jq jq) {
		String realFormula = jq.getRealFormula();
		List<String> elIds = new ArrayList<String>();
		Pattern pattern = Pattern.compile("\\{qp.*?\\}");
		Matcher matcher = pattern.matcher(realFormula);
		while (matcher.find()) {
			String s = matcher.group();
			String elId = s.substring(s.indexOf("#") + 1, s.indexOf("}"));
			if (!this.elRetrievalMap.containsKey(elId)) {
				this.elRetrievalMap.put(elId, "");
			}
			elIds.add(elId);
		}
		this.dirtyJqElStructureMap.put(jq.getId(), elIds);
		for (Map.Entry<String, String> entry : this.elRetrievalMap.entrySet()) {
			if (StrUtils.isNullOrEmpty(entry.getValue())) {
				this.dirtyJqElIdUnionList.add(entry.getKey());
			}
		}
	}

	private void buildElRetrievalMap(List<String> elIdUnionList) {
		if (elIdUnionList.size() > 0) {
			List<Qp> els = this.qpMapper.getCascadeEl(elIdUnionList);
			for (Qp qp : els) {
				this.elRetrievalMap.put(qp.getId(), qp.getLeafFormula());
			}
		}
	}

	private Jq rebuildDirtyJq(Jq jq) {
		List<String> elIds = new ArrayList<String>();

		String realFormula = jq.getRealFormula();
		elIds = this.dirtyJqElStructureMap.get(jq.getId());
		if (elIds.size() > 0) {
			for (String elId : elIds) {
				realFormula = realFormula.replaceAll("\\{qp#" + elId + "\\}",
						"(" + this.elRetrievalMap.get(elId) + ")");
			}
		}
		jq.setLeafFormula(realFormula);
		return jq;
	}

}
