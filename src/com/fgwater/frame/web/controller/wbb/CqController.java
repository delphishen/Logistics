package com.fgwater.frame.web.controller.wbb;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.wbb.Cq;
import com.fgwater.frame.service.wbb.CqService;

@Controller
@Scope("request")
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class CqController extends BaseController {

	@Resource
	private CqService CqService;

	@Injection
	private Cq cq;

	@Injection
	private List<Cq> cqs;

	@ResponseBody
	@RequestMapping(value = "queryCq.do")
	public String query() {
		this.responseModel.mount(this.CqService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveCq.do")
	public String save() {
		this.CqService.saveOrUpdate(this.getCq());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "deleteCq.do")
	public String delete() {
		this.CqService.delete(this.getCqs());
		return this.responseModel.serial();
	}

	public Cq getCq() {
		return cq;
	}

	public void setCq(Cq cq) {
		this.cq = cq;
	}

	public List<Cq> getCqs() {
		return cqs;
	}

	public void setCqs(List<Cq> cqs) {
		this.cqs = cqs;
	}
}
