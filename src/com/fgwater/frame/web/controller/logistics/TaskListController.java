package com.fgwater.frame.web.controller.logistics;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.logistics.TaskList;
import com.fgwater.frame.service.logistics.TaskListService;

@Controller
@RequestMapping(value = "/logistics", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class TaskListController extends BaseController {

	@Resource
	private TaskListService taskListService;
	
	@Injection
	private List<TaskList> taskLists;

	@Injection
	private TaskList taskList;

	@ResponseBody
	@RequestMapping(value = "queryTaskList.do")
	public String query() {
		//System.out.println("queryTaskList============"+this.requestModel.getParams());
		this.responseModel.mount(this.taskListService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		
		return this.responseModel.serial();
	}
	
	@ResponseBody
	@RequestMapping(value = "getTreeAllTaskList.do")
	public String getAll() {
		this.responseModel.mount(this.taskListService.getTreeAll(this.requestModel
				.getParams()), MOUNT_TYPE_JA);
		
		JSONArray ja = JSONArray.fromObject(this.taskListService.getTreeAll(this.requestModel
				.getParams()));
		Object swap = ja;	
		System.out.println("getTreeAllTaskList========"+swap.toString());
	//	System.out.println(this.requestModel.getParams());
	//	System.out.println(this.responseModel.serial());
		return this.responseModel.serial();
	}	
	
	@ResponseBody
	@RequestMapping(value = "saveTaskList.do")
	public String save() {
	//	JSONArray ja = JSONArray.fromObject(this.getTaskList());
	//	Object swap = ja;		
	//System.out.println("getTaskList============="+swap.toString());		
		
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.taskListService.saveOrUpdate(this.getTaskList()));
		

		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteTaskList.do")
	public String delete() {
	//	System.out.println(this.getTrucks());
		this.taskListService.delete(this.getTaskLists());
	//	System.out.println("deleteTaskList============"+this.responseModel.serial());
		return this.responseModel.serial();
	}

	public List<TaskList> getTaskLists() {
		return taskLists;
	}

	public void setTaskLists(List<TaskList> taskLists) {
		this.taskLists = taskLists;
	}

	public TaskList getTaskList() {
		return taskList;
	}

	public void setTaskList(TaskList taskList) {
		this.taskList = taskList;
	}

}
