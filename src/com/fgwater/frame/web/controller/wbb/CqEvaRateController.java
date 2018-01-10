package com.fgwater.frame.web.controller.wbb;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.wbb.CqEvaRate;
import com.fgwater.frame.service.wbb.CqEvaRateService;

@Controller
@Scope("request")
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class CqEvaRateController extends BaseController {

	@Resource
	private CqEvaRateService cqEvaRateService;

	@Injection
	private List<CqEvaRate> cqEvaRates;

	@ResponseBody
	@RequestMapping(value = "queryCqEvaRate.do")
	public String query() {
		this.responseModel.mount(this.cqEvaRateService.query(this.requestModel
				.getParams()), MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveCqEvaRate.do")
	public String save() {
		this.cqEvaRateService.saveOrUpdate(this.getCqEvaRates());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "deleteCqEvaRate.do")
	public String delete() {
		this.cqEvaRateService.delete(this.getCqEvaRates());
		return this.responseModel.serial();
	}

	public List<CqEvaRate> getCqEvaRates() {
		return cqEvaRates;
	}

	public void setCqEvaRates(List<CqEvaRate> cqEvaRates) {
		this.cqEvaRates = cqEvaRates;
	}
}
