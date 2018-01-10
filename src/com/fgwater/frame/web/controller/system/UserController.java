package com.fgwater.frame.web.controller.system;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.system.User;
import com.fgwater.frame.service.system.UserService;

@Controller
@RequestMapping(value = "/system", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class UserController extends BaseController {

	@Resource
	private UserService userService;

	@Injection
	private List<User> users;

	@Injection
	private User user;

	@ResponseBody
	@RequestMapping(value = "queryUser.do")
	public String query() {
		this.responseModel.mount(this.userService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
	//	System.out.println(this.responseModel.serial());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "findUserByEmpId.do")
	public String findByEmpId() {
		this.responseModel.mount(this.userService.findByEmpId(this.requestModel
				.getParams().get("empId")), MOUNT_TYPE_JO);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "getAllUser.do")
	public String getAll() {
		this.responseModel.mount(this.userService.getAll(this.requestModel
				.getParams()), MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveUser.do")
	public String save() {
		
		//System.out.println("userService==="+this.getUser());	
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.userService.saveOrUpdate(this.getUser()));
		return jo.toString();
	}
	
	@ResponseBody
	@RequestMapping(value = "resetPassword.do")
	public String resetPassword() {
		
		//System.out.println("userService==="+this.getUser());	
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.userService.resetPassword(this.getUser()));
		return jo.toString();
	}	

	@ResponseBody
	@RequestMapping(value = "deleteUser.do")
	public String delete() {
		this.userService.delete(this.getUsers());
		return this.responseModel.serial();
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

}
