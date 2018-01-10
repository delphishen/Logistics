package com.fgwater.core.model;

import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import com.fgwater.core.common.ConstantSys;
import com.fgwater.core.utils.UUIDUtils;
import com.github.pagehelper.PageInfo;

public class ResponseModel implements Serializable {

	private static final long serialVersionUID = 1L;

	private Map<String, Object> swaps;

	private Object swap;
	
	private HttpServletResponse response;

	public ResponseModel() {

	}

	@SuppressWarnings("unchecked")
	public void mount(String key, Object obj, int type) {
		this.swaps = new HashMap<String, Object>();
		JSONObject jo;
		JSONArray ja;
		switch (type) {
		case ConstantSys.RESP_MOUNT_TYPE_JO:
			jo = JSONObject.fromObject(obj);
			this.swaps.put(key, jo);
			break;
		case ConstantSys.RESP_MOUNT_TYPE_JA:
			ja = JSONArray.fromObject(obj);
			this.swaps.put(key, ja);
			break;
		case ConstantSys.RESP_MOUNT_TYPE_MSG:
			jo = new JSONObject();
			jo.put("success", true);
			jo.put("msg", obj.toString());
			this.swaps.put(key, jo);
			break;
		case ConstantSys.RESP_MOUNT_TYPE_FORM:
			jo = new JSONObject();
			jo.put("success", true);
			jo.put("data", JSONObject.fromObject(obj));
			this.swaps.put(key, jo);
			break;
		case ConstantSys.RESP_MOUNT_TYPE_PAGING:
			PageInfo pi = new PageInfo((List<Map<String, String>>) obj);
			jo = new JSONObject();
			jo.put("success", true);
			jo.put("results", pi.getTotal());
			jo.put("rows", JSONArray.fromObject(pi.getList()));
			this.swaps.put(key, jo);
			break;
		default:
			break;
		}
	}

	@SuppressWarnings("unchecked")
	public void mount(Object obj, int type) {
		this.swap = new Object();
		JSONObject jo;
		JSONArray ja;
		switch (type) {
		case ConstantSys.RESP_MOUNT_TYPE_JO:
			jo = JSONObject.fromObject(obj);
			this.swap = jo;
			break;
		case ConstantSys.RESP_MOUNT_TYPE_JA:
			ja = JSONArray.fromObject(obj);
			this.swap = ja;
			break;
		case ConstantSys.RESP_MOUNT_TYPE_MSG:
			jo = new JSONObject();
			jo.put("success", true);
			jo.put("msg", obj.toString());
			this.swap = jo;
			break;
		case ConstantSys.RESP_MOUNT_TYPE_FORM:
			jo = new JSONObject();
			jo.put("success", true);
			jo.put("data", JSONObject.fromObject(obj));
			this.swap = jo;
			break;
		case ConstantSys.RESP_MOUNT_TYPE_PAGING:
			PageInfo pi = new PageInfo((List<Map<String, String>>) obj);
			jo = new JSONObject();
			jo.put("success", true);
			jo.put("results", pi.getTotal());
			jo.put("rows", JSONArray.fromObject(pi.getList()));
			this.swap = jo;
			break;
		default:
			break;
		}
	}

	public String serial() {
		if (swap == null) {
			if (swaps == null) {
				JSONObject jo = new JSONObject();
				jo.put("success", true);
				jo.put("msg", "ok");
				return jo.toString();
			} else {
				return this.swaps.toString();
			}
		} else {
			if (swaps == null) {
				return this.swap.toString();
			} else {
				swaps.put(UUIDUtils.getUUID(), swap);
				return this.swaps.toString();
			}
		}
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}
}
