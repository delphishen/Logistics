package com.fgwater.frame.web.controller.logistics;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.logistics.Lines;
import com.fgwater.frame.service.logistics.LinesService;

@Controller
@RequestMapping(value = "/logistics", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class LinesController extends BaseController {

	@Resource
	private LinesService linesService;

	@Injection
	private List<Lines> liness;

	@Injection
	private Lines lines;

	@ResponseBody
	@RequestMapping(value = "queryLines.do")
	public String query() {
		this.responseModel.mount(this.linesService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
	//		System.out.println(this.requestModel.getParams());
		return this.responseModel.serial();
	}
	
	@ResponseBody
	@RequestMapping(value = "getLinesAll.do")
	public String getAll() {

		this.responseModel.mount(this.linesService.getAll(),
				MOUNT_TYPE_JA);		
	//		System.out.println("getLinesAll=========="+this.responseModel.serial());
		return this.responseModel.serial();
	}
	
	@ResponseBody
	@RequestMapping(value = "saveLines.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		
	//	System.out.println("saveLines===="+this.getLines().getLinesName());
	//	System.out.println("saveLines==Lng=="+this.getLines().getLng());
	//	System.out.println("saveLines==getLat=="+this.getLines().getLat());
		jo.element("label", this.linesService.saveOrUpdate(this.getLines()));
		
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteLines.do")
	public String delete() {
	//	System.out.println("deleteLines====="+this.getLiness().toString());
		this.linesService.delete(this.getLiness());
		
		return this.responseModel.serial();
	}

	public List<Lines> getLiness() {
		return liness;
	}

	public void setLiness(List<Lines> liness) {
		this.liness = liness;
	}

	public Lines getLines() {
		return lines;
	}

	public void setLines(Lines lines) {
		this.lines = lines;
	}

}
