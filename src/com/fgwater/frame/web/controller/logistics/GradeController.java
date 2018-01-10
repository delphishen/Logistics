package com.fgwater.frame.web.controller.logistics;

import java.util.List;

import javax.annotation.Resource;

import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.logistics.Grade;
import com.fgwater.frame.service.logistics.GradeService;

@Controller
@RequestMapping(value = "/logistics", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class GradeController extends BaseController {

	@Resource
	private GradeService gradeService;

	@Injection
	private List<Grade> grades;

	@Injection
	private Grade grade;

	@ResponseBody
	@RequestMapping(value = "queryGrade.do")
	public String query() {
		this.responseModel.mount(this.gradeService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
	//		System.out.println(this.requestModel.getParams());
		return this.responseModel.serial();
	}

	
	@ResponseBody
	@RequestMapping(value = "getAllGrade.do")
	public String getAll() {
		this.responseModel.mount(this.gradeService.getAll(this.requestModel
				.getParams()), MOUNT_TYPE_JA);
		
	//	JSONArray ja = JSONArray.fromObject(this.truckService.getAll(this.requestModel.getParams()));
	//	Object swap = ja;	
	//	System.out.println(swap.toString());
	//	System.out.println(this.requestModel.getParams());
	//	System.out.println(this.responseModel.serial());
		return this.responseModel.serial();
	}	

	@ResponseBody
	@RequestMapping(value = "saveGrade.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		
	//	System.out.println("saveLines===="+this.getLines().getLinesName());
	//	System.out.println("saveLines==Lng=="+this.getLines().getLng());
	//	System.out.println("saveLines==getLat=="+this.getLines().getLat());
		jo.element("label", this.gradeService.saveOrUpdate(this.getGrade()));
		
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteGrade.do")
	public String delete() {
	//	System.out.println("deleteLines====="+this.getLiness().toString());
		this.gradeService.delete(this.getGrades());
		
		return this.responseModel.serial();
	}

	public List<Grade> getGrades() {
		return grades;
	}

	public void setGrades(List<Grade> grades) {
		this.grades = grades;
	}

	public Grade getGrade() {
		return grade;
	}

	public void setGrade(Grade grade) {
		this.grade = grade;
	}

}
