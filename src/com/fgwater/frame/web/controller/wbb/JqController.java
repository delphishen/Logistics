package com.fgwater.frame.web.controller.wbb;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.wbb.Jq;
import com.fgwater.frame.service.wbb.JqService;

@Controller
@Scope("request")
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class JqController extends BaseController {

	@Resource
	private JqService JqService;

	@Injection
	private Jq jq;

	@Injection
	private List<Jq> jqs;

	@ResponseBody
	@RequestMapping(value = "queryJq.do")
	public String query() {
		this.responseModel.mount(this.JqService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "queryJqRp.do")
	public String queryRp() {
		this.responseModel.mount(this.JqService.queryRp(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveJq.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.JqService.saveOrUpdate(this.getJq()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteJq.do")
	public String delete() {
		this.JqService.delete(this.getJqs());
		return this.responseModel.serial();
	}

	public Jq getJq() {
		return jq;
	}

	public void setJq(Jq jq) {
		this.jq = jq;
	}

	public List<Jq> getJqs() {
		return jqs;
	}

	public void setJqs(List<Jq> jqs) {
		this.jqs = jqs;
	}
}
