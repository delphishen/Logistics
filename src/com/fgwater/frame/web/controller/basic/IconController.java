package com.fgwater.frame.web.controller.basic;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.basic.Icon;
import com.fgwater.frame.service.basic.IconService;

@Controller
@Scope("request")
@RequestMapping(value = "/basic", produces = "text/plain;charset=UTF-8;")
public class IconController extends BaseController {

	@Resource
	private IconService iconService;

	@Injection
	private Icon icon;

	@Injection
	private List<Icon> icons;

	@ResponseBody
	@RequestMapping(value = "queryIcon.do")
	public String query() {
		this.responseModel.mount(this.iconService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveIcon.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.iconService.saveOrUpdate(this.getIcon()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "defaultIcon.do")
	public String defaultIcon() {
		this.iconService.defaultIcon(this.getIcon());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "deleteIcon.do")
	public String delete() {
		this.iconService.delete(this.getIcons());
		return this.responseModel.serial();
	}

	public Icon getIcon() {
		return icon;
	}

	public void setIcon(Icon icon) {
		this.icon = icon;
	}

	public List<Icon> getIcons() {
		return icons;
	}

	public void setIcons(List<Icon> icons) {
		this.icons = icons;
	}

}
