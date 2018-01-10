package com.fgwater.frame.web.controller.logistics;


import java.util.List;
import javax.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.logistics.DispatchListLog;
import com.fgwater.frame.service.logistics.DispatchListLogService;



@Controller
@RequestMapping(value = "/logistics", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class DispatchListLogController extends BaseController {

	@Resource
	private DispatchListLogService dispatchListLogService;
	
	@Injection
	private List<DispatchListLog> dispatchListLogs;

	@Injection
	private DispatchListLog dispatchListLog;

	@ResponseBody
	@RequestMapping(value = "queryDispatchListLog.do")
	public String query() {
	//	System.out.println("queryDispatchListLog============"+this.requestModel.getParams());
		this.responseModel.mount(this.dispatchListLogService.query(this.requestModel.getParams()), MOUNT_TYPE_PAGING);
	//	System.out.println("queryDispatchListLog============"+this.responseModel.serial());	
		return this.responseModel.serial();
	}
	
	
	
	@ResponseBody
	@RequestMapping(value = "saveDispatchListLog.do")
	public String save() {
	//	JSONArray ja = JSONArray.fromObject(this.getDispatchList());
	//	Object swap = ja;		
	//System.out.println("getTaskList============="+swap.toString());
	//	JSONObject jo = new JSONObject();
	//	jo.element("success", true);
	//	jo.element("label", this.dispatchListLogService.saveOrUpdate(this.getDispatchListLogs()));
	//	return jo.toString();
		
		this.dispatchListLogService.saveOrUpdate(this.getDispatchListLogs());
	//	this.userPageRightService.save(this.getUserPageRights());
		return this.responseModel.serial();	
		
	}


	
	@ResponseBody
	@RequestMapping(value = "deleteDispatchListLog.do")
	public String delete() {
	//	System.out.println(this.getTrucks());
		this.dispatchListLogService.delete(this.getDispatchListLogs());
	//	System.out.println("deleteTaskList============"+this.responseModel.serial());
		return this.responseModel.serial();
	}
	

	public List<DispatchListLog> getDispatchListLogs() {
		return dispatchListLogs;
	}

	public void setDispatchListLogs(List<DispatchListLog> dispatchListLogs) {
		this.dispatchListLogs = dispatchListLogs;
	}

	public DispatchListLog getDispatchListLog() {
		return dispatchListLog;
	}

	public void setDispatchListLog(DispatchListLog dispatchListLog) {
		this.dispatchListLog = dispatchListLog;
	}

}
