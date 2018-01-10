package com.fgwater.frame.web.controller.wbb;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.wbb.Muw;
import com.fgwater.frame.service.wbb.MuwService;

@Controller
@Scope("request")
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class MuwController extends BaseController {

	@Resource
	private MuwService muwService;

	@Injection
	private Muw muw;

	@ResponseBody
	@RequestMapping(value = "getAllMuw.do")
	public String getAll() {
		this.responseModel.mount(this.muwService.getAll(), MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveMuw.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.muwService.saveOrUpdate(this.getMuw()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteMuw.do")
	public String delete() {
		this.muwService.delete(this.getMuw());
		return this.responseModel.serial();
	}

	public Muw getMuw() {
		return muw;
	}

	public void setMuw(Muw muw) {
		this.muw = muw;
	}
}
