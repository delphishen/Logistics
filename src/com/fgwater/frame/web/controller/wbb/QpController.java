package com.fgwater.frame.web.controller.wbb;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.wbb.Qp;
import com.fgwater.frame.model.wbb.QpSort;
import com.fgwater.frame.service.wbb.QpService;
import com.fgwater.frame.service.wbb.QpSortService;

@Controller
@Scope("request")
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class QpController extends BaseController {

	@Resource
	private QpSortService qpSortService;

	@Resource
	private QpService qpService;

	@Injection
	private QpSort qpSort;

	@Injection
	private Qp qp;

	@ResponseBody
	@RequestMapping(value = "queryQp.do")
	public String query() {
		this.responseModel.mount(this.qpService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveQp.do")
	public String saveQp() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.qpService.saveOrUpdate(this.getQp()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteQp.do")
	public String deleteQp() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.qpService.delete(this.getQp()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "buildTreeQpSort.do")
	public String buildTree() {
		this.responseModel.mount(this.qpSortService.getAll(), MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveQpSort.do")
	public String saveQpSort() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.qpSortService.saveOrUpdate(this.getQpSort()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteQpSort.do")
	public String deleteQpSort() {
		this.qpSortService.delete(this.getQpSort());
		return this.responseModel.serial();
	}

	public QpSort getQpSort() {
		return qpSort;
	}

	public void setQpSort(QpSort QpSort) {
		this.qpSort = QpSort;
	}

	public Qp getQp() {
		return qp;
	}

	public void setQp(Qp qp) {
		this.qp = qp;
	}

}
