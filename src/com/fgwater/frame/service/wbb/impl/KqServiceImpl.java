package com.fgwater.frame.service.wbb.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.KqEvolveMapper;
import com.fgwater.frame.mapper.wbb.KqMapper;
import com.fgwater.frame.model.wbb.Kq;
import com.fgwater.frame.model.wbb.KqEvolve;
import com.fgwater.frame.service.wbb.KqService;

@Service("kqService")
public class KqServiceImpl extends BaseServiceImpl implements KqService {

	@Resource
	private KqMapper kqMapper;

	@Resource
	private KqEvolveMapper kqEvolveMapper;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.kqMapper.query(params);
	}

	public List<Map<String, String>> queryKqEvolve(Map<String, String> params) {
		return this.kqEvolveMapper.query(params);
	}

	public boolean saveOrUpdate(Kq kq) {
		int countCh = this.kqMapper.check(kq, "chName");
		int countEn = this.kqMapper.check(kq, "enName");
		if (countCh + countEn == 0) {
			if (StrUtils.isNullOrEmpty(kq.getId())) {
				kq.setId(UUIDUtils.getUUID());
				this.kqMapper.insert(kq);
			} else {
				this.kqMapper.update(kq);
			}
			this.buildKqEvolve(kq);
		}
		return countCh + countEn == 0;
	}

	public void delete(List<Kq> kqs) {
		for (Kq kq : kqs) {
			this.kqMapper.deleteLogic(kq);
			this.kqEvolveMapper.deleteByKqId(kq.getId());
		}
	}

	private void buildKqEvolve(Kq kq) {
		List<KqEvolve> list = this.kqEvolveMapper.getByKqId(kq.getId());
		if (list.size() == 0) {
			list = new ArrayList<KqEvolve>();
			for (int i = 1; i < 3; i++) {
				KqEvolve kqEvolve = new KqEvolve();
				kqEvolve.setId(UUIDUtils.getUUID());
				kqEvolve.setKqId(kq.getId());
				if (i == 1) {
					kqEvolve.setChName(kq.getChName() + "(进口)");
					kqEvolve.setEnName(kq.getEnName() + "(进口)");
					kqEvolve.setEnNameCs(kq.getEnNameCs() + "<Run>(进口)</Run>");
					kqEvolve.setType(1);
				} else {
					kqEvolve.setChName(kq.getChName() + "(出口)");
					kqEvolve.setEnName(kq.getEnName() + "(出口)");
					kqEvolve.setEnNameCs(kq.getEnNameCs() + "<Run>(出口)</Run>");
					kqEvolve.setType(2);
				}
				this.kqEvolveMapper.insert(kqEvolve);
			}
		} else {
			for (int i = 0; i < list.size(); i++) {
				KqEvolve kqEvolve = list.get(i);
				if (kqEvolve.getType() == 1) {
					kqEvolve.setChName(kq.getChName() + "(进口)");
					kqEvolve.setEnName(kq.getEnName() + "(进口)");
				} else {
					kqEvolve.setChName(kq.getChName() + "(出口)");
					kqEvolve.setEnName(kq.getEnName() + "(出口)");
				}
				this.kqEvolveMapper.update(kqEvolve);
			}
		}
	}

}
