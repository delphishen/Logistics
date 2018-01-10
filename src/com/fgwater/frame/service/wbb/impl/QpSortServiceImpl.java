package com.fgwater.frame.service.wbb.impl;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.QpSortMapper;
import com.fgwater.frame.model.wbb.QpSort;
import com.fgwater.frame.service.wbb.QpSortService;

@Service("qpSortService")
public class QpSortServiceImpl extends BaseServiceImpl implements QpSortService {

	@Resource
	private QpSortMapper qpSortMapper;

	public JSONArray getAll() {
		JSONArray ja = JSONArray.fromObject(this.qpSortMapper.getAll());
		return this.getByRoot(ja, "0", new JSONArray());
	}

	public boolean saveOrUpdate(QpSort qpSort) {
		int count = this.qpSortMapper.check(qpSort, "text");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(qpSort.getId())) {
				qpSort.setId(UUIDUtils.getUUID());
				this.qpSortMapper.insert(qpSort);
			} else {
				this.qpSortMapper.update(qpSort);
			}
		}
		return count == 0;
	}

	public void delete(QpSort qpSort) {
		this.qpSortMapper.deleteLogic(qpSort);
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
