package com.fgwater.frame.web.controller.system;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.common.ConstantSys;
import com.fgwater.core.utils.SessionUtils;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.system.User;
import com.fgwater.frame.service.system.UserService;

@Controller
@RequestMapping(value = "/system", produces = "text/plain;charset=UTF-8;")
public class LoginController extends BaseController {

	@Resource
	private UserService userService;

	private String errMsg;

	@ResponseBody
	@RequestMapping(value = "login.do")
	public String login() {
		this.check();
		this.responseModel.mount(this.getErrMsg(), MOUNT_TYPE_MSG);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "logout.do")
	public String logout() {
		// session置空
		this.requestModel.getSession().setAttribute(
				ConstantSys.USERSESSION_USER, null);
		 SessionUtils.remove(ConstantSys.USERSESSION_USER);
		return this.responseModel.serial();
	}

	private void check() {
		this.setErrMsg("ok");
		System.out.println("login============"+this.requestModel.getParams().get("loginName"));				
		
		
		// 校验用户名
		User user = this.userService.getByName(this.requestModel.getParams()
				.get("loginName"));
		if (user == null) {
			this.setErrMsg("对不起，您输入的用户名不正确");
			return;
		}


			if (!user.getPassword().equals(
					this.requestModel.getParams().get("password"))) {
				this.setErrMsg("对不起，您输入的密码错误");
				return;
			}
	
		// 登陆账户存入session
		this.requestModel.getSession().setAttribute(
				ConstantSys.USERSESSION_USER, user);
	}

	public String getErrMsg() {
		return errMsg;
	}

	public void setErrMsg(String errMsg) {
		this.errMsg = errMsg;
	}
}
