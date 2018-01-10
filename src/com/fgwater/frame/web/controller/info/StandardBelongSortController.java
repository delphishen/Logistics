package com.fgwater.frame.web.controller.info;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.info.StandardBelongSort;
import com.fgwater.frame.service.info.StandardBelongSortService;

@Controller
@Scope("request")
@RequestMapping(value = "/info", produces = "text/plain;charset=UTF-8;")
public class StandardBelongSortController extends BaseController {

	@Resource
	private StandardBelongSortService standardBelongSortService;

	@Injection
	private StandardBelongSort standardBelongSort;

	@Injection
	private List<StandardBelongSort> standardBelongSorts;

	@ResponseBody
	@RequestMapping(value = "queryStandardBelongSort.do")
	public String query() {
		this.responseModel.mount(this.standardBelongSortService
				.query(this.requestModel.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "getAllStandardBelongSort.do")
	public String getAll() {
		this.responseModel.mount(this.standardBelongSortService.getAll(),
				MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveStandardBelongSort.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.standardBelongSortService.saveOrUpdate(this
				.getStandardBelongSort()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteStandardBelongSort.do")
	public String delete() {
		this.standardBelongSortService.delete(this.getStandardBelongSorts());
		return this.responseModel.serial();
	}

	public StandardBelongSort getStandardBelongSort() {
		return standardBelongSort;
	}

	public void setStandardBelongSort(StandardBelongSort standardBelongSort) {
		this.standardBelongSort = standardBelongSort;
	}

	public List<StandardBelongSort> getStandardBelongSorts() {
		return standardBelongSorts;
	}

	public void setStandardBelongSorts(
			List<StandardBelongSort> standardBelongSorts) {
		this.standardBelongSorts = standardBelongSorts;
	}

}
