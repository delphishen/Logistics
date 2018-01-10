package com.fgwater.frame.service.wbb.impl;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.KqSortMapper;
import com.fgwater.frame.model.wbb.KqSort;
import com.fgwater.frame.service.wbb.KqSortService;

@Service("kqSortService")
public class KqSortServiceImpl extends BaseServiceImpl implements KqSortService {

	@Resource
	private KqSortMapper kqSortMapper;

	public JSONArray getAll() {
		JSONArray ja = JSONArray.fromObject(this.kqSortMapper.getAll());
		return this.getByRoot(ja, "0", new JSONArray());
	}

	public boolean saveOrUpdate(KqSort kqSort) {
		int count = this.kqSortMapper.check(kqSort, "text");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(kqSort.getId())) {
				kqSort.setId(UUIDUtils.getUUID());
				this.kqSortMapper.insert(kqSort);
			} else {
				this.kqSortMapper.update(kqSort);
			}
		}
		return count == 0;
	}

	public void delete(KqSort kqSort) {
		this.kqSortMapper.deleteLogic(kqSort);
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
