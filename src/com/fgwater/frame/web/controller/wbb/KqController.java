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
import com.fgwater.frame.model.wbb.Kq;
import com.fgwater.frame.model.wbb.KqSort;
import com.fgwater.frame.service.wbb.KqService;
import com.fgwater.frame.service.wbb.KqSortService;

@Controller
@Scope("request")
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class KqController extends BaseController {

	@Resource
	private KqSortService kqSortService;

	@Resource
	private KqService kqService;

	@Injection
	private KqSort kqSort;

	@Injection
	private Kq kq;

	@Injection
	private List<Kq> kqs;

	@ResponseBody
	@RequestMapping(value = "queryKq.do")
	public String query() {
		this.responseModel.mount(this.kqService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "queryKqEvolve.do")
	public String queryKqEvolve() {
		this.responseModel.mount(this.kqService.queryKqEvolve(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveKq.do")
	public String saveKq() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.kqService.saveOrUpdate(this.getKq()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteKq.do")
	public String deleteKq() {
		this.kqService.delete(this.getKqs());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "buildTreeKqSort.do")
	public String buildTree() {
		this.responseModel.mount(this.kqSortService.getAll(), MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveKqSort.do")
	public String saveKqSort() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.kqSortService.saveOrUpdate(this.getKqSort()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteKqSort.do")
	public String deleteKqSort() {
		this.kqSortService.delete(this.getKqSort());
		return this.responseModel.serial();
	}

	public KqSort getKqSort() {
		return kqSort;
	}

	public void setKqSort(KqSort kqSort) {
		this.kqSort = kqSort;
	}

	public Kq getKq() {
		return kq;
	}

	public void setKq(Kq kq) {
		this.kq = kq;
	}

	public List<Kq> getKqs() {
		return kqs;
	}

	public void setKqs(List<Kq> kqs) {
		this.kqs = kqs;
	}
}
