package com.fgwater.frame.web.controller.logistics;

import java.io.File;
import java.io.OutputStream;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.logistics.DispatchList;
import com.fgwater.frame.service.logistics.DispatchListService;


import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFHeader;
import org.apache.poi.hssf.usermodel.HSSFRow;  
import org.apache.poi.hssf.usermodel.HSSFSheet;  
import org.apache.poi.hssf.usermodel.HSSFWorkbook;  



@Controller
@RequestMapping(value = "/logistics", produces = "text/plain;charset=UTF-8;")
/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/
public class DispatchListController extends BaseController {

	@Resource
	private DispatchListService dispatchListService;
	
	@Injection
	private List<DispatchList> dispatchLists;

	@Injection
	private DispatchList dispatchList;

	@ResponseBody
	@RequestMapping(value = "queryDispatchList.do")
	public String query() {
	//	System.out.println("queryDispatchList============"+this.requestModel.getParams());
		this.responseModel.mount(this.dispatchListService.query(this.requestModel.getParams()), MOUNT_TYPE_PAGING);
	//	System.out.println("queryDispatchList============"+this.responseModel.serial());	
		return this.responseModel.serial();
	}
	
	
	@ResponseBody
	@RequestMapping(value = "queryDispatchListCalendar.do")
	public String queryDispatchListCalendar() {
		System.out.println("queryCalendar  getParams ==========="+this.requestModel.getParams());
		this.responseModel.mount(this.dispatchListService.queryDispatchListCalendar(this.requestModel.getParams()), MOUNT_TYPE_PAGING);
		System.out.println("queryCalendar============"+this.responseModel.serial());	
		return this.responseModel.serial();
	}	
	
	@ResponseBody
	@RequestMapping(value = "saveDispatchList.do")
	public String save() {
	//	JSONArray ja = JSONArray.fromObject(this.getDispatchList());
	//	Object swap = ja;		
	//System.out.println("getTaskList============="+swap.toString());
		JSONObject jo = new JSONObject();
		jo.element("success", true);
		jo.element("label", this.dispatchListService.saveOrUpdate(this.getDispatchList()));
		return jo.toString();
	}

	@ResponseBody
	@RequestMapping(value = "batchSaveDispatchList.do")
	public String batchSave() {
		
		JSONObject jo = new JSONObject();
		jo.element("success", true);		
		//批量新增 删除,返回处理的数据 条数
		JSONArray ja = JSONArray.fromObject(this.getDispatchLists());
		Object swap = ja;		
	    System.out.println("dispatchListService============="+swap.toString());
		jo.element("label",this.dispatchListService.batchSaveOrUpdate(this.getDispatchLists()));
		return jo.toString();			
	}	
	
	
	@ResponseBody
	@RequestMapping(value = "deleteDispatchList.do")
	public String delete() {
	//	System.out.println(this.getTrucks());
		this.dispatchListService.delete(this.getDispatchLists());
	//	System.out.println("deleteTaskList============"+this.responseModel.serial());
		return this.responseModel.serial();
	}
	
	
	
	
	
	

	@ResponseBody
	@RequestMapping(value = "suggestion.do")
	public String suggestion(HttpServletResponse response) throws Exception{ 
		//获取问题列表
	//	System.out.println("suggestion==="+this.requestModel.getParams());	
	//	JSONArray ja = JSONArray.fromObject(this.dispatchListService.queryDispatchListCalendarList(this.requestModel.getParams()));
	//	Object swap = ja;		
	//    System.out.println("queryDispatchListCalendarList========"+swap.toString());		
	List<DispatchList> dispatchList =this.dispatchListService.exportDispatchList(this.requestModel.getParams());
//		List<DispatchList> targetStockList =this.getDispatchLists();
		 
				//创建一个新的Excel
				HSSFWorkbook workBook = new HSSFWorkbook();
				//创建sheet页
				HSSFSheet sheet = workBook.createSheet();
				//sheet页名称
				workBook.setSheetName(0, "车辆调度信息");
				//创建header页
				HSSFHeader header = sheet.getHeader();
				//设置标题居中
				header.setCenter("车辆调度表");
				
				//设置第一行为Header
				HSSFRow row = sheet.createRow(0);
				
						
						
					///	Workbook wb = new HSSFWorkbook();
			    //Workbook wb = new XSSFWorkbook();
			  //  CreationHelper createHelper = wb.getCreationHelper();
			//    Sheet sheet = wb.createSheet("new sheet");				
					//	HSSFRow row = sheet.createRow((short)0);
			    // Create a cell and put a value in it.
					//	HSSFCell cell0 = row.createCell(0);
			        ///             cell0.setCellValue(1);				
				
				HSSFCell cell0 = row.createCell(0);
				HSSFCell cell1 = row.createCell(1);
			//	HSSFCell cell2 = row.createCell(2);
		 
				
				// 设置字符集
			//	cell0.setEncoding(HSSFCell.ENCODING_UTF_16);
			//	cell1.setEncoding(HSSFCell.ENCODING_UTF_16);
			//	cell2.setEncoding(HSSFCell.ENCODING_UTF_16);
		

				
				cell0.setCellValue("车牌号");
				cell1.setCellValue("调度员");
			//	cell2.setCellValue("反馈时间");
			
				
				if(dispatchList != null && !dispatchList.isEmpty()) {
					for(int i = 0; i < dispatchList.size(); i++) {
						DispatchList targetStock = dispatchList.get(i);
						row = sheet.createRow(i + 1);
						cell0 = row.createCell(0);
						cell1 = row.createCell(1);
				//		cell2 = row.createCell(2);

						
						// 设置字符集
					//	cell0.setEncoding(HSSFCell.ENCODING_UTF_16);
					//	cell1.setEncoding(HSSFCell.ENCODING_UTF_16);
					//	cell2.setEncoding(HSSFCell.ENCODING_UTF_16);

						
						cell0.setCellValue(targetStock.getPlateNumber());
						cell1.setCellValue(targetStock.getDispatchersName());
					//	cell2.setCellValue(targetStock.getPublishTime());
			 
		 
						
						sheet.setColumnWidth(0, 4000);
						sheet.setColumnWidth(1, 4000);
				//		sheet.setColumnWidth((short) 2, (short) 4000);
						
						
					}
				}
				
				//通过Response把数据以Excel格式保存
				response.reset();
				response.setContentType("application/msexcel;charset=UTF-8");
				try {
					response.addHeader("Content-Disposition", "attachment;filename=\""
							+ new String(("车辆调度表" + ".xls").getBytes("GBK"),
									"ISO8859_1") + "\"");
					OutputStream out = response.getOutputStream();
					workBook.write(out);	
					out.flush();
					out.close();
				
					//C:\Users\DelphiShen\Downloads
					//C:\Users\DELPHI~1\AppData\Local\Temp\
				//	String folder=System.getProperty("java.io.tmpdir");
					//user.dir    D:\MyEclipse 2016 CI
				//	System.out.println("path========="+System.getProperty("user.dir"));
					
					//del("C:\\Users\\DelphiShen\\Downloads\\车辆调度表.xls");
					
				} catch (Exception e) {
					e.printStackTrace();
				}
				return null;

	}		
	
	
	
	
	
	/**
	 * 刪除文件
	 * 
	 * @param path
	 */
	public void del(final String path) {
		
		
		System.out.println("path========="+path);

		File file = new File(path);
		if (file.isFile() && file.exists()) {
			file.delete();
		}

		if (file.exists()) {
			String cmd = "cmd /c del ";
			String system = System.getProperties().getProperty("os.name");
			// System.getProperties().getProperty("file.separator");
			if (!system.toLowerCase().startsWith("win")) {
				cmd = "rm -rf ";
			}
			Runtime run = Runtime.getRuntime();
			try {
				cmd = cmd + path;
				System.out.println(cmd);
				Process p = run.exec(cmd);
				p.waitFor();
			} catch (Exception e) {
			//	logger.error(e.getMessage());
				e.printStackTrace();
				Timer timer = new Timer();
				timer.schedule(new TimerTask() {
					@Override
					public void run() {
						 del(path);
					}
				}, 10000);
			}

		}
	}	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	public List<DispatchList> getDispatchLists() {
		return dispatchLists;
	}

	public void setDispatchLists(List<DispatchList> dispatchLists) {
		this.dispatchLists = dispatchLists;
	}

	public DispatchList getDispatchList() {
		return dispatchList;
	}

	public void setDispatchList(DispatchList dispatchList) {
		this.dispatchList = dispatchList;
	}

}
