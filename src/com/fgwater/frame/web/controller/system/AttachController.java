package com.fgwater.frame.web.controller.system;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Iterator;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.utils.SessionUtils;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.model.system.Attach;
import com.fgwater.frame.service.system.AttachService;

@Controller
@Scope("request")
@RequestMapping(value = "/system", produces = "text/plain;charset=UTF-8;")

/* 
添加注解 @Controller 将其标识为控制器，这里仅仅是一个普通的Java类，
通过简单的注解，就可以将其解析为Servlet类来响应用户的请求
*/

public class AttachController extends BaseController {

	@Resource
	private AttachService attachService;

	@Injection
	private Attach attach;

	@Injection
	private List<Attach> attachs;
	
	private String uploadPath;

	private String realName;

	private String filePath;

	private String sysName;

	private String category;
	
	


	@ResponseBody
	/**
	 * 1. 使用 @RequestMapping 注解来映射请求的URL（相当于web.xml中的servlet-mapping元素的url-pattern）
	 * 2. 返回值会通过视图解析器解析为实际的物理视图，具体springMVC.xml文件的InternalResourceViewResolver配置信息
	 */	
	@RequestMapping(value = "queryAttach.do")
	public String query() {
		
	//	System.out.println("queryAttach============"+this.requestModel.getParams());		
		this.responseModel.mount(this.attachService.query(this.requestModel
				.getParams()), MOUNT_TYPE_PAGING);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "deleteAttach.do")
	public String delete() {
		this.attachService.delete(this.getAttachs());
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "uploadAttach.do")
	public String upload() throws Exception {		
	//	System.out.println("queryAttach============"+this.requestModel.getParams().get("link"));	
		
		HttpServletRequest request = this.requestModel.getRequest();
		initDir(request);
		CommonsMultipartResolver multipartResolver = new CommonsMultipartResolver(
				request.getSession().getServletContext());
		JSONObject res = new JSONObject();
		if (multipartResolver.isMultipart(request)) {
			// 转换成多部分request
			MultipartHttpServletRequest multiRequest = (MultipartHttpServletRequest) request;
			// 取得request中的所有文件名
			Iterator<String> iter = multiRequest.getFileNames();
			while (iter.hasNext()) {
				// 取得上传文件
				MultipartFile file = multiRequest.getFile(iter.next());
				if (file != null) {
					// 如果名称不为“”,说明该文件存在，否则说明该文件不存在
					if (file.getOriginalFilename().trim() != "") {
						this.buildSysName(file.getOriginalFilename());
						this.setFilePath(this.getUploadPath()
								+ this.getSysName());
						// 定义上传路径
						File localFile = new File(this.getFilePath());
						file.transferTo(localFile);
						this.attachService.save(this.buildAttach());
						res.put("success", true);
						res.put("fileId", this.buildAttach().getId());
						res.put("fileName", realName);
						res.put("filePath", filePath);
						res.put("message", "(" + file.getSize() + " bytes)");
					}
				}
			}
		}
		this.responseModel.mount(res, MOUNT_TYPE_JO);
		return this.responseModel.serial();
	}

	@ResponseBody
	@RequestMapping(value = "downloadAttach.do")
	public String download() throws Exception {
		String filePath = this.requestModel.getParams().get("filePath");
		String fileName = this.requestModel.getParams().get("realName");
		HttpServletResponse response = this.responseModel.getResponse();
		response.setCharacterEncoding("utf-8");
		response.setContentType("multipart/form-data");
		response.setHeader("Content-disposition", "attachment; filename="
				+ new String(fileName.getBytes("GBK"), "ISO8859-1"));
		InputStream inputStream = new FileInputStream(new File(filePath));
		OutputStream os = response.getOutputStream();
		byte[] b = new byte[2048];
		int length;
		while ((length = inputStream.read(b)) > 0) {
			os.write(b, 0, length);
		}
		// 这里主要关闭。
		os.close();
		inputStream.close();
		// 返回值要注意，要不然就出现下面这句错误！
		// java+getOutputStream() has already been called for this response
		return null;
	}
	
	
	

	private void initDir(HttpServletRequest request) {
		// 初始化上传的路径
		this.setUploadPath(request.getSession().getServletContext()
				.getRealPath("/attach/")+ SessionUtils.getCurrUser().getLoginName() + "\\");
		File uploadPathFile = new File(this.getUploadPath());
		if (!uploadPathFile.exists()) {
			uploadPathFile.mkdirs();
		}
	}

	/**
	 * 
	 * description : 构建系统名称
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2013-7-19 下午06:07:38
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 
	 * @param realName
	 * @return
	 * 
	 */
	private void buildSysName(String realName) {
		// 取得文件的扩展名
		String fileExt = "";
		int lastIndex = realName.lastIndexOf('.');
		if (lastIndex != -1) {
			fileExt = realName.substring(lastIndex);
		}
		String sysName = UUIDUtils.getUUID();
		if (!StrUtils.isNullOrEmpty(fileExt)) {
			sysName += fileExt;
		}
		this.setRealName(realName);
		this.setSysName(sysName);
	}

	public Attach buildAttach() {
		Attach attach = new Attach();
		attach.setId(sysName.substring(0, sysName.lastIndexOf(".")));
		attach.setCategory(SessionUtils.getCurrUser().getLoginName());
		attach.setFilePath(filePath);
		attach.setSysName(sysName);
		attach.setRealName(realName);
		attach.setUploadTime(StrUtils.getCurrFormatTime());
	    attach.setLink(this.requestModel.getParams().get("link")); //这个参数是在UploadDialog.js 文件中配置
		return attach;
	}

	public Attach getAttach() {
		return attach;
	}

	public void setAttach(Attach attach) {
		this.attach = attach;
	}

	public List<Attach> getAttachs() {
		return attachs;
	}

	public void setAttachs(List<Attach> attachs) {
		this.attachs = attachs;
	}

	public String getUploadPath() {
		return uploadPath;
	}

	public void setUploadPath(String uploadPath) {
		this.uploadPath = uploadPath;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getSysName() {
		return sysName;
	}

	public void setSysName(String sysName) {
		this.sysName = sysName;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}



}
