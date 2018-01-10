package com.fgwater.frame.web.controller.system;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.utils.SessionUtils;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.system.Menu;
import com.fgwater.frame.service.system.MenuService;

@Controller
@Scope("request")
@RequestMapping(value = "/system", produces = "text/plain;charset=UTF-8;")
public class MenuController extends BaseController {

	@Resource
	private MenuService menuService;

	@Injection
	private Menu menu;

	@ResponseBody
	@RequestMapping(value = "buildMenu.do")   //菜单权限分配读取所有菜单
	public String build() {
		this.responseModel.mount(this.menuService.getAllMenus(), MOUNT_TYPE_JA);
		
		System.out.println("buildMenu======"+this.responseModel.serial());		
		return this.responseModel.serial();
	}

	@ResponseBody            
	@RequestMapping(value = "buildByCurrUserMenu.do")   //系统登录根据用户权限读取菜单
	public String buildByCurrUser() {
		this.responseModel.mount(this.menuService.getMenusByUserId(SessionUtils
				.getCurrUser().getEmpId()), MOUNT_TYPE_JA);


		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "getByUserIdMenu.do") //菜单权限分配，读取选择的用户的菜单权限
	public String getByUserIdMenu() {
		this.responseModel.mount(this.menuService.getByUserId(this.requestModel
				.getParams().get("userId")), MOUNT_TYPE_JA);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveMenu.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.menuService.saveOrUpdate(this.getMenu()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteMenu.do")
	public String delete() {
		this.menuService.delete(this.getMenu());
		return this.responseModel.serial();
	}

	public Menu getMenu() {
		return menu;
	}

	public void setMenu(Menu menu) {
		this.menu = menu;
	}

}
