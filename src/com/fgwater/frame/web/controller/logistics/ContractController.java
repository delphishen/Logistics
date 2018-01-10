package com.fgwater.frame.web.controller.logistics;

import java.util.List;

import javax.annotation.Resource;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.logistics.Contract;
import com.fgwater.frame.service.logistics.ContractService;

@Controller
@RequestMapping(value = "/logistics", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class ContractController extends BaseController {

	@Resource
	private ContractService contractService;

	@Injection
	private List<Contract> contracts;

	@Injection
	private Contract contract;

	@ResponseBody
	@RequestMapping(value = "queryContract.do")
	public String query() {
			System.out.println("queryContract============"+this.requestModel.getParams());		
		this.responseModel.mount(this.contractService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
			System.out.println("queryContract============"+this.responseModel.serial());
		return this.responseModel.serial();
	}


	@ResponseBody
	@RequestMapping(value = "getAllContract.do")
	public String getAll() {
		this.responseModel.mount(this.contractService.getAll(), MOUNT_TYPE_JA);
		
	//	JSONArray ja = JSONArray.fromObject(this.truckService.getAll(this.requestModel.getParams()));
	//	Object swap = ja;	
	//	System.out.println(swap.toString());
	//	System.out.println(this.requestModel.getParams());
	//	System.out.println(this.responseModel.serial());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "saveContract.do")
	public String save() {
		System.out.println("saveContract======"+this.getContract().toString());		
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.contractService.saveOrUpdate(this.getContract()));
	
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "deleteContract.do")
	public String delete() {
	//	System.out.println(this.getTrucks());
		this.contractService.delete(this.getContracts());
		
		return this.responseModel.serial();
	}

	public List<Contract> getContracts() {
		return contracts;
	}

	public void setContracts(List<Contract> contracts) {
		this.contracts =contracts;
	}

	public Contract getContract() {
		return contract;
	}

	public void setContract(Contract contract) {
		this.contract = contract;
	}

}
