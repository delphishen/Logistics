package com.fgwater.frame.web.controller.wbb;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.wbb.Algorithm;
import com.fgwater.frame.service.wbb.AlgorithmService;

@Controller
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class AlgorithmController extends BaseController {

	@Resource
	private AlgorithmService algorithmService;

	@Injection
	private Algorithm algorithm;

	@ResponseBody
	@RequestMapping(value = "queryAlgorithm.do")
	public String query() {
		this.responseModel.mount(this.algorithmService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "updateAlgorithm.do")
	public String update() {
		this.algorithmService.update(this.getAlgorithm());
		return this.responseModel.serial();
	}

	public Algorithm getAlgorithm() {
		return algorithm;
	}

	public void setAlgorithm(Algorithm algorithm) {
		this.algorithm = algorithm;
	}

}
