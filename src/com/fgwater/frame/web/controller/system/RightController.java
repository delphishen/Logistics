package com.fgwater.frame.web.controller.system;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.system.UserPageRight;
import com.fgwater.frame.service.system.MenuService;
import com.fgwater.frame.service.system.UserPageRightService;

@Controller
@RequestMapping(value = "/system", produces = "text/plain;charset=UTF-8;")
public class RightController extends BaseController {

	@Resource
	private UserPageRightService userPageRightService;

	@Resource
	private MenuService menuService;

	@Injection
	private List<UserPageRight> userPageRights;

	@ResponseBody
	@RequestMapping(value = "findRight.do")
	public String find() {
		this.responseModel.mount(this.userPageRightService
				.getByUserId(this.requestModel.getString("userId")),
				MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "buildRight.do")
	public String build() {
		this.responseModel.mount(this.menuService.getAllMenus(), MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveRight.do")  //菜单权限保存
	public String save() {
		this.userPageRightService.save(this.getUserPageRights());
		return this.responseModel.serial();
	}

	public List<UserPageRight> getUserPageRights() {
		return userPageRights;
	}

	public void setUserPageRights(List<UserPageRight> userPageRights) {
		this.userPageRights = userPageRights;
	}

}
