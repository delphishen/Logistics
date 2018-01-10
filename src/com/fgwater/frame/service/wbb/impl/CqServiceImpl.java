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
import com.fgwater.frame.mapper.wbb.CqMapper;
import com.fgwater.frame.mapper.wbb.KqEvolveMapper;
import com.fgwater.frame.mapper.wbb.QpMapper;
import com.fgwater.frame.model.wbb.Cq;
import com.fgwater.frame.model.wbb.KqEvolve;
import com.fgwater.frame.model.wbb.Qp;
import com.fgwater.frame.service.wbb.CqService;

@Service("cqService")
public class CqServiceImpl extends BaseServiceImpl implements CqService {

	@Resource
	private CqMapper cqMapper;

	@Resource
	private KqEvolveMapper kqEvolveMapper;

	@Resource
	private QpMapper qpMapper;

	/**
	 * dirtyCq因子ID并集序列
	 */
	private List<String> dirtyCqElIdUnionList;

	/**
	 * dirtyCq序列对应的因子构成表
	 */
	private Map<String, List<String>> dirtyCqElStructureMap;

	/**
	 * 因子检索表
	 */
	private Map<String, String> elRetrievalMap;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.cqMapper.query(params);
	}

	public void saveOrUpdate(Cq cq) {
		this.dirtyCqElIdUnionList = new ArrayList<String>();
		this.dirtyCqElStructureMap = new HashMap<String, List<String>>();
		this.elRetrievalMap = new HashMap<String, String>();

		Map<String, String> params = new HashMap<String, String>();
		params.put("kqId", cq.getKqId());
		params.put("type", cq.getType());
		KqEvolve kqEvolve = this.kqEvolveMapper.getByKqIdAndType(params);
		if (StrUtils.isNullOrEmpty(cq.getId())) {
			cq.setId(UUIDUtils.getUUID());
			cq.setKqEvolveId(kqEvolve.getId());
			this.analyzeCq(cq);
			this.buildElRetrievalMap(this.dirtyCqElIdUnionList);
			this.cqMapper.insert(this.rebuildDirtyCq(cq));
		} else {
			cq.setKqEvolveId(kqEvolve.getId());
			this.analyzeCq(cq);
			this.buildElRetrievalMap(this.dirtyCqElIdUnionList);
			this.cqMapper.update(this.rebuildDirtyCq(cq));
		}
	}

	public void delete(List<Cq> cqs) {
		for (Cq cq : cqs) {
			this.cqMapper.deleteLogic(cq);
		}
	}

	private void analyzeCq(Cq cq) {
		String realFormula = cq.getRealFormula();
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
		this.dirtyCqElStructureMap.put(cq.getId(), elIds);
		for (Map.Entry<String, String> entry : this.elRetrievalMap.entrySet()) {
			if (StrUtils.isNullOrEmpty(entry.getValue())) {
				this.dirtyCqElIdUnionList.add(entry.getKey());
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

	private Cq rebuildDirtyCq(Cq cq) {
		List<String> elIds = new ArrayList<String>();

		String realFormula = cq.getRealFormula();
		elIds = this.dirtyCqElStructureMap.get(cq.getId());
		if (elIds.size() > 0) {
			for (String elId : elIds) {
				realFormula = realFormula.replaceAll("\\{qp#" + elId + "\\}",
						"(" + this.elRetrievalMap.get(elId) + ")");
			}
		}
		cq.setLeafFormula(realFormula);
		return cq;
	}

}
