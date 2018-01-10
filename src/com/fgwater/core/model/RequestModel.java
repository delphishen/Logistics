package com.fgwater.core.model;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class RequestModel implements Serializable {

	private static final long serialVersionUID = 1L;

	private Map<String, String> params = new HashMap<String, String>();

	private HttpServletRequest request;

	private HttpSession session;

	public boolean has(String k) {
		return this.params.containsKey(k);
	}

	public Map<String, String> getParams() {
		return params;
	}

	public void set(String k, String v) {
		this.params.put(k, v);
	}

	public String getString(String k) {
		return this.params.get(k);
	}

	public Integer getInteger(String k) {
		return Integer.parseInt(this.params.get(k));
	}

	public Boolean getBoolean(String k) {
		return Boolean.parseBoolean(this.params.get(k));
	}

	public <T extends BaseModel> T getModel(String k, Class<T> c) {
		JSONObject jo = JSONObject.fromObject(this.params.get(k));
		return c.cast(JSONObject.toBean(jo, c));
	}

	public <T extends BaseModel> List<T> getModelList(String k, Class<T> c) {
		JSONArray ja = JSONArray.fromObject(this.params.get(k));
		List<T> list = new ArrayList<T>();
		for (int i = 0; i < ja.size(); i++) {
			JSONObject jo = ja.getJSONObject(i);
			list.add(c.cast(JSONObject.toBean(jo, c)));
		}
		return list;
	}

	public HttpSession getSession() {
		return session;
	}

	public void setSession(HttpSession session) {
		this.session = session;
	}

	public HttpServletRequest getRequest() {
		return request;
	}

	public void setRequest(HttpServletRequest request) {
		this.request = request;
	}

}
