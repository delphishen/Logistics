package com.fgwater.frame.web.controller.logistics;


import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.logistics.DispatchListLogWorkflow;
import com.fgwater.frame.service.logistics.DispatchListLogWorkflowService;



@Controller
@RequestMapping(value = "/logistics", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class DispatchListLogWorkflowController extends BaseController {

	@Resource
	private DispatchListLogWorkflowService dispatchListLogWorkflowService;
	
	@Injection
	private List<DispatchListLogWorkflow> dispatchListLogWorkflows;

	@Injection
	private DispatchListLogWorkflow dispatchListLogWorkflow;

	@ResponseBody
	@RequestMapping(value = "queryDispatchListLogWorkflow.do")
	public String query() {
	//	System.out.println("queryDispatchListLogWorkflow============"+this.requestModel.getParams());
	
		this.responseModel.mount(this.dispatchListLogWorkflowService.query(this.requestModel.getParams()), MOUNT_TYPE_JA);
	//	System.out.println("queryDispatchListLogWorkflow============"+this.responseModel.serial());	
		return this.responseModel.serial();
	}
	
	
	
	@ResponseBody
	@RequestMapping(value = "saveDispatchListLogWorkflow.do")
	public String save() {
	//	JSONArray ja = JSONArray.fromObject(this.getDispatchList());
	//	Object swap = ja;		
	//System.out.println("getTaskList============="+swap.toString());
	//	JSONObject jo = new JSONObject();
	//	jo.element("success", true);
	//	jo.element("label", this.dispatchListLogService.saveOrUpdate(this.getDispatchListLogs()));
	//	return jo.toString();
		
		this.dispatchListLogWorkflowService.saveOrUpdate(this.getDispatchListLogWorkflows());
	//	this.userPageRightService.save(this.getUserPageRights());
		return this.responseModel.serial();	
		
	}


	

	public List<DispatchListLogWorkflow> getDispatchListLogWorkflows() {
		return dispatchListLogWorkflows;
	}

	public void setDispatchListLogWorkflows(List<DispatchListLogWorkflow> dispatchListLogWorkflows) {
		this.dispatchListLogWorkflows = dispatchListLogWorkflows;
	}

	public DispatchListLogWorkflow getDispatchListLogWorkflow() {
		return dispatchListLogWorkflow;
	}

	public void setDispatchListLogWorkflow(DispatchListLogWorkflow dispatchListLogWorkflow) {
		this.dispatchListLogWorkflow = dispatchListLogWorkflow;
	}

}
