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
import com.fgwater.frame.mapper.wbb.JqMapper;
import com.fgwater.frame.mapper.wbb.QpMapper;
import com.fgwater.frame.model.wbb.Cq;
import com.fgwater.frame.model.wbb.Jq;
import com.fgwater.frame.model.wbb.Qp;
import com.fgwater.frame.service.wbb.QpService;

@Service("qpService")
public class QpServiceImpl extends BaseServiceImpl implements QpService {

	@Resource
	private QpMapper qpMapper;

	@Resource
	private CqMapper cqMapper;

	@Resource
	private JqMapper jqMapper;

	/**
	 * 脏Qp对象序列
	 */
	private List<Qp> dirtyQpList;

	/**
	 * 脏Cq对象序列
	 */
	private List<Cq> dirtyCqList;

	/**
	 * 脏Jq对象序列
	 */
	private List<Jq> dirtyJqList;

	/**
	 * 脏Qp对象ID集合，用与查询级联变动的CQ与JQ
	 */
	private List<String> dirtyQpIdList;

	/**
	 * dirtyQp因子ID并集序列
	 */
	private List<String> dirtyQpElIdUnionList;

	/**
	 * dirtyCq因子ID并集序列
	 */
	private List<String> dirtyCqElIdUnionList;

	/**
	 * dirtyJq因子ID并集序列
	 */
	private List<String> dirtyJqElIdUnionList;

	/**
	 * dirtyQp序列对应的因子构成表
	 */
	private Map<String, List<String>> dirtyQpElStructureMap;

	/**
	 * dirtyCq序列对应的因子构成表
	 */
	private Map<String, List<String>> dirtyCqElStructureMap;

	/**
	 * dirtyJq序列对应的因子构成表
	 */
	private Map<String, List<String>> dirtyJqElStructureMap;

	/**
	 * 因子检索表
	 */
	private Map<String, String> elRetrievalMap;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.qpMapper.query(params);
	}

	public boolean saveOrUpdate(Qp qp) {
		this.dirtyQpList = new ArrayList<Qp>();
		this.dirtyCqList = new ArrayList<Cq>();
		this.dirtyJqList = new ArrayList<Jq>();
		this.dirtyQpIdList = new ArrayList<String>();
		this.dirtyQpElIdUnionList = new ArrayList<String>();
		this.dirtyCqElIdUnionList = new ArrayList<String>();
		this.dirtyJqElIdUnionList = new ArrayList<String>();
		this.dirtyQpElStructureMap = new HashMap<String, List<String>>();
		this.dirtyCqElStructureMap = new HashMap<String, List<String>>();
		this.dirtyJqElStructureMap = new HashMap<String, List<String>>();
		this.elRetrievalMap = new HashMap<String, String>();

		int count = this.qpMapper.check(qp, "name");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(qp.getId())) {
				qp.setId(UUIDUtils.getUUID());
				if (StrUtils.isNullOrEmpty(qp.getRealFormula())) {
					qp.setRealFormula("{qp#" + qp.getId() + "}");
				}
				this.dirtyQpList.add(qp);// 加入脏Qp对象序列
				this.analyzeDirtyQp();// 解析dirtyQpList，构造空的因子检索表、dirtyQp序列对应的因子构成表及dirtyQp因子ID并集序列
				this.buildElRetrievalMap(this.dirtyQpElIdUnionList);// 构建因子检索表
				this.rebuildDirtyQp();
				for (Qp dirtyQp : this.dirtyQpList) {
					this.qpMapper.insert(dirtyQp);
				}
			} else {
				if (StrUtils.isNullOrEmpty(qp.getRealFormula())) {
					qp.setRealFormula("{qp#" + qp.getId() + "}");
				}
				System.out.println("------------开始修正指标参数------------");
				this.cascadeQp(qp);// 寻找级联Qp，加入脏Qp对象序列
				this.analyzeDirtyQp();// 解析dirtyQpList，构造空的因子检索表、dirtyQp序列对应的因子构成表及dirtyQp因子ID并集序列
				this.buildElRetrievalMap(this.dirtyQpElIdUnionList);// 构建因子检索表
				this.rebuildDirtyQp();

				if (this.dirtyQpIdList.size() > 0) {
					System.out.println("------------开始修正计算指标------------");
					this.dirtyCqList = this.qpMapper
							.getCascadeCq(this.dirtyQpIdList);// 寻找级联Cq
					this.analyzeDirtyCq();
					this.buildElRetrievalMap(this.dirtyCqElIdUnionList);
					this.rebuildDirtyCq();

					System.out.println("------------开始修正评价指标------------");
					this.dirtyJqList = this.qpMapper
							.getCascadeJq(this.dirtyQpIdList);// 寻找级联Jq
					this.analyzeDirtyJq();
					this.buildElRetrievalMap(this.dirtyJqElIdUnionList);
					this.rebuildDirtyJq();
				}
				for (Qp dirtyQp : this.dirtyQpList) {
					this.qpMapper.update(dirtyQp);
				}
				for (Cq dirtyCq : this.dirtyCqList) {
					this.cqMapper.update(dirtyCq);
				}
				for (Jq dirtyJq : this.dirtyJqList) {
					this.jqMapper.update(dirtyJq);
				}
			}
		}
		return count == 0;
	}

	public boolean delete(Qp qp) {
		boolean flag = false;
		List<String> list = new ArrayList<String>();
		list.add(qp.getId());
		List<Qp> cascadeQpList = this.qpMapper.getCascade(qp);
		List<Cq> cascadeCpList = this.qpMapper.getCascadeCq(list);
		List<Jq> cascadeJqList = this.qpMapper.getCascadeJq(list);
		if (cascadeQpList.size() == 0 && cascadeCpList.size() == 0
				&& cascadeJqList.size() == 0) {
			this.qpMapper.deleteLogic(qp);
			flag = true;
		}
		return flag;
	}

	private void cascadeQp(Qp currentQp) {
		// 因为当前qp有可能又作为其他qp的因子，因此存入因子检索表
		if (!this.elRetrievalMap.containsKey(currentQp.getId())) {
			this.elRetrievalMap.put(currentQp.getId(), "");
			this.dirtyQpList.add(currentQp);
			this.dirtyQpIdList.add(currentQp.getId());
		}
		// 判断当前Qp是否被其他Qp引用
		List<Qp> cascadeQpList = this.qpMapper.getCascade(currentQp);
		if (cascadeQpList.size() > 0) {
			for (Qp cascadeQp : cascadeQpList) {
				this.cascadeQp(cascadeQp);
			}
		}
	}

	private void analyzeDirtyQp() {
		for (Qp dirtyQp : dirtyQpList) {
			String realFormula = dirtyQp.getRealFormula();
			List<String> elIds = new ArrayList<String>();
			Pattern pattern = Pattern.compile("\\{qp.*?\\}");
			Matcher matcher = pattern.matcher(realFormula);
			while (matcher.find()) {
				String s = matcher.group();
				String elId = s.substring(s.indexOf("#") + 1, s.indexOf("}"));
				if (!this.elRetrievalMap.containsKey(elId)) {// 将因子存入因子检索表
					this.elRetrievalMap.put(elId, "");
				}
				elIds.add(elId);
			}
			this.dirtyQpElStructureMap.put(dirtyQp.getId(), elIds);// 将对应的dirtyQp因子构造存入构造表
		}
		// 获取因子检索表中值为空的因子ID加入dirtyQp因子ID并集序列
		for (Map.Entry<String, String> entry : this.elRetrievalMap.entrySet()) {
			if (StrUtils.isNullOrEmpty(entry.getValue())) {
				this.dirtyQpElIdUnionList.add(entry.getKey());
			}
		}
	}

	private void analyzeDirtyCq() {
		for (Cq dirtyCq : this.dirtyCqList) {
			String realFormula = dirtyCq.getRealFormula();
			List<String> elIds = new ArrayList<String>();
			Pattern pattern = Pattern.compile("\\{qp.*?\\}");
			Matcher matcher = pattern.matcher(realFormula);
			while (matcher.find()) {
				String s = matcher.group();
				String elId = s.substring(s.indexOf("#") + 1, s.indexOf("}"));
				if (!this.elRetrievalMap.containsKey(elId)) {// 将因子存入因子检索表
					this.elRetrievalMap.put(elId, "");
				}
				elIds.add(elId);
			}
			this.dirtyCqElStructureMap.put(dirtyCq.getId(), elIds);// 将对应的dirtyCq因子构造存入构造表
		}
		// 获取因子检索表中值为空的因子ID加入dirtyQp因子ID并集序列
		for (Map.Entry<String, String> entry : this.elRetrievalMap.entrySet()) {
			if (StrUtils.isNullOrEmpty(entry.getValue())) {
				this.dirtyCqElIdUnionList.add(entry.getKey());
			}
		}
	}

	private void analyzeDirtyJq() {
		for (Jq dirtyJq : this.dirtyJqList) {
			String realFormula = dirtyJq.getRealFormula();
			List<String> elIds = new ArrayList<String>();
			Pattern pattern = Pattern.compile("\\{qp.*?\\}");
			Matcher matcher = pattern.matcher(realFormula);
			while (matcher.find()) {
				String s = matcher.group();
				String elId = s.substring(s.indexOf("#") + 1, s.indexOf("}"));
				if (!this.elRetrievalMap.containsKey(elId)) {// 将因子存入因子检索表
					this.elRetrievalMap.put(elId, "");
				}
				elIds.add(elId);
			}
			this.dirtyJqElStructureMap.put(dirtyJq.getId(), elIds);// 将对应的dirtyJq因子构造存入构造表
		}
		// 获取因子检索表中值为空的因子ID加入dirtyJp因子ID并集序列
		for (Map.Entry<String, String> entry : this.elRetrievalMap.entrySet()) {
			if (StrUtils.isNullOrEmpty(entry.getValue())) {
				this.dirtyJqElIdUnionList.add(entry.getKey());
			}
		}
	}

	private void rebuildDirtyQp() {
		List<String> elIds = new ArrayList<String>();
		int index = 0;
		boolean label = false;
		do {
			index++;
			label = false;
			for (Qp dirtyQp : this.dirtyQpList) {
				System.out.println("第" + index + "次迭代，目标：" + dirtyQp.getId()
						+ "/" + dirtyQp.getName());
				System.out.println("  showFormula：" + dirtyQp.getShowFormula());
				System.out.println("  realFormula：" + dirtyQp.getRealFormula());
				String realFormula = dirtyQp.getRealFormula();

				// 若ShowFormula为空，说明为输入值，realFormula与leafFormula相同，不需要替换叶子公式，否则一直自己替換自己会死循环丫~
				if (!StrUtils.isNullOrEmpty(dirtyQp.getShowFormula())) {
					elIds = this.dirtyQpElStructureMap.get(dirtyQp.getId());
					if (elIds.size() > 0) {
						for (String elId : elIds) {
							realFormula = realFormula.replaceAll("\\{qp#"
									+ elId + "\\}", "("
									+ this.elRetrievalMap.get(elId) + ")");
						}
					}
				}

				String newLeafFormula = realFormula;
				String oldLeafFormula = this.elRetrievalMap
						.get(dirtyQp.getId());
				// 如果计算得出的公式与因子检索表中不一致，则进行下次迭代，直到完全一样位置
				if (!newLeafFormula.equals(oldLeafFormula)) {
					System.out.println("  发现变更!");
					System.out.println("  变更前leafFormula：" + oldLeafFormula);
					System.out.println("  变更后leafFormula：" + newLeafFormula);
					this.elRetrievalMap.put(dirtyQp.getId(), newLeafFormula);
					label = true;
				}
				dirtyQp.setLeafFormula(newLeafFormula);
			}
		} while (label);
	}

	private void rebuildDirtyCq() {
		List<String> elIds = new ArrayList<String>();
		for (Cq dirtyCq : this.dirtyCqList) {
			System.out.println("目标：" + dirtyCq.getId());
			System.out.println("  showFormula：" + dirtyCq.getShowFormula());
			System.out.println("  realFormula：" + dirtyCq.getRealFormula());
			System.out.println("  变更前leafFormula：" + dirtyCq.getLeafFormula());
			String realFormula = dirtyCq.getRealFormula();
			elIds = this.dirtyCqElStructureMap.get(dirtyCq.getId());
			if (elIds.size() > 0) {
				for (String elId : elIds) {
					realFormula = realFormula.replaceAll("\\{qp#" + elId
							+ "\\}", "(" + this.elRetrievalMap.get(elId) + ")");
				}
			}
			System.out.println("  变更后leafFormula：" + realFormula);
			dirtyCq.setLeafFormula(realFormula);
		}
	}

	private void rebuildDirtyJq() {
		List<String> elIds = new ArrayList<String>();
		for (Jq dirtyJq : this.dirtyJqList) {
			System.out.println("目标：" + dirtyJq.getId());
			System.out.println("  showFormula：" + dirtyJq.getShowFormula());
			System.out.println("  realFormula：" + dirtyJq.getRealFormula());
			System.out.println("  变更前leafFormula：" + dirtyJq.getLeafFormula());
			String realFormula = dirtyJq.getRealFormula();
			elIds = this.dirtyJqElStructureMap.get(dirtyJq.getId());
			if (elIds.size() > 0) {
				for (String elId : elIds) {
					realFormula = realFormula.replaceAll("\\{qp#" + elId
							+ "\\}", "(" + this.elRetrievalMap.get(elId) + ")");
				}
			}
			System.out.println("  变更后leafFormula：" + realFormula);
			dirtyJq.setLeafFormula(realFormula);
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
}
