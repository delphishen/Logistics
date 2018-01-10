package com.fgwater.frame.service.wbb.impl;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.StandardFilterSortMapper;
import com.fgwater.frame.model.wbb.StandardFilterSort;
import com.fgwater.frame.service.wbb.StandardFilterSortService;

@Service("standardFilterSortService")
public class StandardFilterSortServiceImpl extends BaseServiceImpl implements
		StandardFilterSortService {

	@Resource
	private StandardFilterSortMapper standardFilterSortMapper;

	public JSONArray getAll() {
		JSONArray ja = JSONArray.fromObject(this.standardFilterSortMapper
				.getAll());
		return this.getByRoot(ja, "0", new JSONArray());
	}

	public boolean saveOrUpdate(StandardFilterSort standardFilterSort) {
		int count = this.standardFilterSortMapper.check(standardFilterSort,
				"text");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(standardFilterSort.getId())) {
				standardFilterSort.setId(UUIDUtils.getUUID());
				this.standardFilterSortMapper.insert(standardFilterSort);
			} else {
				this.standardFilterSortMapper.update(standardFilterSort);
			}
		}
		return count == 0;
	}

	public void delete(StandardFilterSort standardFilterSort) {
		this.standardFilterSortMapper.deleteLogic(standardFilterSort);
	}

	private JSONArray getByRoot(JSONArray ja, String root, JSONArray res) {
		for (int i = 0; i < ja.size(); i++) {
			JSONObject jo = ja.getJSONObject(i);
			if (root.equals(jo.getString("fatherId"))) {
				JSONArray children = new JSONArray();
				children = this.getByRoot(ja, jo.getString("id"), children);
				if (children.size() == 0) {
					jo.put("leaf", true);
				} else {
					jo.put("leaf", false);
					jo.put("expanded", true);
					jo.put("children", children);
				}
				res.add(jo);
			}
		}
		return res;
	}
}
