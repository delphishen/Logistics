package com.fgwater.frame.web.controller.wbb;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.service.wbb.AssistService;

@Controller
@RequestMapping(value = "/wbb", produces = "text/plain;charset=UTF-8;")
public class AssistController extends BaseController {

	@Resource
	private AssistService assistService;

	@ResponseBody
	@RequestMapping(value = "queryAssist.do")
	public String query() {
		this.responseModel.mount(this.assistService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

}
