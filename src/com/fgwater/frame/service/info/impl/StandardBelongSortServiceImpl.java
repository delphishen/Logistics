package com.fgwater.frame.service.info.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.info.StandardBelongSortMapper;
import com.fgwater.frame.model.info.StandardBelongSort;
import com.fgwater.frame.service.info.StandardBelongSortService;

@Service("standardBelongSortService")
public class StandardBelongSortServiceImpl extends BaseServiceImpl implements
		StandardBelongSortService {

	@Resource
	private StandardBelongSortMapper standardBelongSortMapper;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.standardBelongSortMapper.query(params);
	}

	public List<StandardBelongSort> getAll() {
		return this.standardBelongSortMapper.getAll();
	}

	public boolean saveOrUpdate(StandardBelongSort standardBelongSort) {
		int count = this.standardBelongSortMapper.check(standardBelongSort,
				"name");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(standardBelongSort.getId())) {
				standardBelongSort.setId(UUIDUtils.getUUID());
				this.standardBelongSortMapper.insert(standardBelongSort);
			} else {
				this.standardBelongSortMapper.update(standardBelongSort);
			}
		}
		return count == 0;

	}

	public void delete(List<StandardBelongSort> standardBelongSorts) {
		for (StandardBelongSort standardBelongSort : standardBelongSorts) {
			this.standardBelongSortMapper.deleteLogic(standardBelongSort);
		}
	}

}
