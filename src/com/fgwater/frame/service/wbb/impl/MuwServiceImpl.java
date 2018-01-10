package com.fgwater.frame.service.wbb.impl;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.wbb.MuwMapper;
import com.fgwater.frame.model.wbb.Muw;
import com.fgwater.frame.service.wbb.MuwService;

@Service("muwService")
public class MuwServiceImpl extends BaseServiceImpl implements MuwService {

	@Resource
	private MuwMapper muwMapper;

	public JSONArray getAll() {
		JSONArray ja = JSONArray.fromObject(this.muwMapper.getAll());
		return this.getByRoot(ja, "0", new JSONArray());
	}

	public boolean saveOrUpdate(Muw muw) {
		int count = this.muwMapper.check(muw, "text");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(muw.getId())) {
				muw.setId(UUIDUtils.getUUID());
				this.muwMapper.insert(muw);
			} else {
				this.muwMapper.update(muw);
			}
		}
		return count == 0;
	}

	public void delete(Muw muw) {
		this.muwMapper.deleteLogic(muw);
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
