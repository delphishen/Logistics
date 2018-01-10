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
import com.fgwater.frame.model.logistics.TruckType;
import com.fgwater.frame.service.logistics.TruckTypeService;

@Controller
@RequestMapping(value = "/logistics", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class TruckTypeController extends BaseController {

	@Resource
	private TruckTypeService truckTypeService;

	@Injection
	private List<TruckType> truckTypes;

	@Injection
	private TruckType truckType;

	@ResponseBody
	@RequestMapping(value = "queryTruckType.do")
	public String query() {
		//	System.out.println("queryTruckType============"+this.requestModel.getParams());		
		this.responseModel.mount(this.truckTypeService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
	//		System.out.println("queryTruckType============"+this.responseModel.serial());
		return this.responseModel.serial();
	}


	@ResponseBody
	@RequestMapping(value = "getAllTruckType.do")
	public String getAll() {
		this.responseModel.mount(this.truckTypeService.getAll(this.requestModel
				.getParams()), MOUNT_TYPE_JA);
		
		JSONArray ja = JSONArray.fromObject(this.truckTypeService.getAll(this.requestModel.getParams()));
		Object swap = ja;	
		System.out.println(swap.toString());
	//	System.out.println(this.requestModel.getParams());
	//	System.out.println(this.responseModel.serial());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveTruckType.do")
	public String save() {
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.truckTypeService.saveOrUpdate(this.getTruckType()));
	//	System.out.println(this.getTruckType().toString());
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteTruckType.do")
	public String delete() {
	//	System.out.println(this.getTrucks());
		this.truckTypeService.delete(this.getTruckTypes());
		
		return this.responseModel.serial();
	}

	public List<TruckType> getTruckTypes() {
		return truckTypes;
	}

	public void setTruckTypes(List<TruckType> truckTypes) {
		this.truckTypes = truckTypes;
	}

	public TruckType getTruckType() {
		return truckType;
	}

	public void setTruckType(TruckType truckType) {
		this.truckType = truckType;
	}

}
