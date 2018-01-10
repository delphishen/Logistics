package com.fgwater.frame.web.controller.system;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.system.Employee;
import com.fgwater.frame.service.system.EmployeeService;

@Controller
@Scope("request")
@RequestMapping(value = "/system", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class EmployeeController extends BaseController {

	@Resource
	private EmployeeService employeeService;

	@Injection
	private Employee employee;

	@Injection
	private List<Employee> employees;

	@ResponseBody
	@RequestMapping(value = "queryEmployee.do")
	public String query() {
		this.responseModel.mount(this.employeeService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}
	
	
	@ResponseBody
	@RequestMapping(value = "getAllEmployee.do")
	public String getAll() {
		this.responseModel.mount(this.employeeService.getAll(this.requestModel
				.getParams()), MOUNT_TYPE_JA);
		
	//	JSONArray ja = JSONArray.fromObject(this.truckService.getAll(this.requestModel.getParams()));
	//	Object swap = ja;	
	//	System.out.println(swap.toString());
	//	System.out.println(this.requestModel.getParams());
	//	System.out.println(this.responseModel.serial());
		return this.responseModel.serial();
	}	

	@ResponseBody
	@RequestMapping(value = "saveEmployee.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.employeeService.saveOrUpdate(this
				.getEmployee()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteEmployee.do")
	public String delete() {
		this.employeeService.delete(this.getEmployees());
		return this.responseModel.serial();
	}

	public Employee getEmployee() {
		return employee;
	}

	public void setEmployee(Employee employee) {
		this.employee = employee;
	}

	public List<Employee> getEmployees() {
		return employees;
	}

	public void setEmployees(List<Employee> employees) {
		this.employees = employees;
	}

}
