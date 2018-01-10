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
import com.fgwater.frame.model.wbb.Standard;
import com.fgwater.frame.model.wbb.StandardCfg;
import com.fgwater.frame.model.wbb.StandardFilterSort;
import com.fgwater.frame.service.wbb.StandardCfgService;
import com.fgwater.frame.service.wbb.StandardFilterSortService;
import com.fgwater.frame.service.wbb.StandardService;

@Controller
@Scope("request")
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class StandardController extends BaseController {

	@Resource
	private StandardService standardService;

	@Resource
	private StandardFilterSortService standardFilterSortService;

	@Resource
	private StandardCfgService standardCfgService;

	@Injection
	private Standard standard;

	@Injection
	private List<Standard> standards;

	@Injection
	private StandardFilterSort standardFilterSort;

	@Injection
	private List<StandardCfg> standardCfgs;

	@ResponseBody
	@RequestMapping(value = "queryStandard.do")
	public String queryStandard() {
		this.responseModel.mount(this.standardService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveStandard.do")
	public String saveStandard() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.standardService.saveOrUpdate(this
				.getStandard()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteStandard.do")
	public String deleteStandard() {
		this.standardService.delete(this.getStandards());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "buildTreeStandardFilterSort.do")
	public String buildTree() {
		this.responseModel.mount(this.standardFilterSortService.getAll(),
				MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveStandardFilterSort.do")
	public String saveStandardFilterSort() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.standardFilterSortService.saveOrUpdate(this
				.getStandardFilterSort()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteStandardFilterSort.do")
	public String deleteStandardFilterSort() {
		this.standardFilterSortService.delete(this.getStandardFilterSort());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "queryStandardCfg.do")
	public String queryStandardCfg() {
		this.responseModel.mount(this.standardCfgService
				.query(this.requestModel.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveStandardCfg.do")
	public String saveStandardCfg() {
		this.standardCfgService.saveOrUpdate(this.getStandardCfgs());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "deleteStandardCfg.do")
	public String deleteStandardCfg() {
		this.standardCfgService.delete(this.getStandardCfgs());
		return this.responseModel.serial();
	}

	public StandardFilterSort getStandardFilterSort() {
		return standardFilterSort;
	}

	public void setStandardFilterSort(StandardFilterSort standardFilterSort) {
		this.standardFilterSort = standardFilterSort;
	}

	public Standard getStandard() {
		return standard;
	}

	public void setStandard(Standard standard) {
		this.standard = standard;
	}

	public List<Standard> getStandards() {
		return standards;
	}

	public void setStandards(List<Standard> standards) {
		this.standards = standards;
	}

	public List<StandardCfg> getStandardCfgs() {
		return standardCfgs;
	}

	public void setStandardCfgs(List<StandardCfg> standardCfgs) {
		this.standardCfgs = standardCfgs;
	}

}
