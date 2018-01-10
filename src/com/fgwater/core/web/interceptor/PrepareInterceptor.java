package com.fgwater.core.web.interceptor;

import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Enumeration;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.fgwater.core.annotation.Injection;
import com.fgwater.core.common.ConstantSys;
import com.fgwater.core.model.BaseModel;
import com.fgwater.core.model.RequestModel;
import com.fgwater.core.model.ResponseModel;
import com.fgwater.core.utils.SessionUtils;

public class PrepareInterceptor implements HandlerInterceptor {

	@SuppressWarnings("unchecked")
	public boolean preHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler) throws Exception {
		if (HandlerMethod.class.equals(handler.getClass())) {
			HandlerMethod method = (HandlerMethod) handler;
			// 目标controller
			Object controller = method.getBean();
			Class ctrlClass = controller.getClass();
			// 常规交换数据准备
			RequestModel rqm = new RequestModel();
			ResponseModel rpm = new ResponseModel();
			Enumeration paramEnu = request.getParameterNames();
			while (paramEnu.hasMoreElements()) {
				String key = (String) paramEnu.nextElement();
				String val = (String) request.getParameter(key);
				rqm.set(key, val);
			}
			rqm.setSession(request.getSession());
			rqm.setRequest(request);
			rpm.setResponse(response);
			// 分页数据准备
			this.preparePageData(rqm);
			// 目标父类属性注入
			ctrlClass.getField("requestModel").set(controller, rqm);
			ctrlClass.getField("responseModel").set(controller, rpm);
			// 目标属性注入
			Field[] fields = ctrlClass.getDeclaredFields();
			for (Field field : fields) {
				if (field.isAnnotationPresent(Injection.class)) {
					this.injection(rqm, controller, field);
				}
			}
		}
		return true;
	}

	public void postHandle(HttpServletRequest request,
			HttpServletResponse response, Object handler,
			ModelAndView modelAndView) throws Exception {
		// TODO Auto-generated method stub

	}

	public void afterCompletion(HttpServletRequest request,
			HttpServletResponse response, Object handler, Exception ex)
			throws Exception {
		// TODO Auto-generated method stub
	}

	private void preparePageData(RequestModel requestModel) {
		if (requestModel.has("isPaging")) {
			if (requestModel.getBoolean("isPaging")) {
				SessionUtils.set("isPaging", true);
				if (requestModel.has("start") && requestModel.has("limit")) {
					Integer start = requestModel.getInteger("start");
					Integer limit = requestModel.getInteger("limit");
					SessionUtils.set("pageNum", start / limit + 1);
					SessionUtils.set("pageSize", limit);
				} else {
					SessionUtils.set("pageNum", ConstantSys.PAGING_DEFAULT_NUM);
					SessionUtils.set("pageSize",
							ConstantSys.PAGING_DEFAULT_SIZE);
				}
			} else {
				SessionUtils.set("isPaging", false);
				SessionUtils.set("pageNum", ConstantSys.PAGING_DEFAULT_NUM);
				SessionUtils.set("pageSize", ConstantSys.PAGING_DEFAULT_SIZE);
			}
		} else {
			SessionUtils.set("isPaging", true);
			SessionUtils.set("pageNum", ConstantSys.PAGING_DEFAULT_NUM);
			SessionUtils.set("pageSize", ConstantSys.PAGING_DEFAULT_SIZE);
		}
	}

	/**
	 * 
	 * description : 向目标controller注入属性
	 * 
	 * creator : 刘必文
	 * 
	 * createTime : 2015 九月 20 10:27:47
	 * 
	 * remark : (修改人，修改时间，修改原因/内容)
	 * 对标记为@Injection的属进行注入，目前仅为model对象进行注入，将来可扩展其他类型
	 * 
	 * @param rqm
	 * @param ctrl
	 * @param field
	 * 
	 */
	@SuppressWarnings("unchecked")
	private void injection(RequestModel rqm, Object ctrl, Field field) {
		try {
			Class<?> ctrlClass = ctrl.getClass();// 获取目标controller类型
			Class<?> filedClass = field.getType();// 获取目标controller属性类型
			String fieldName = field.getName();// 获取目标controller属性名称
			Method setMethod = this.getSetMethod(ctrlClass, fieldName);// 获取目标controller属性set方法
			if (List.class.equals(filedClass)) {// 判断是否list
				Type fc = field.getGenericType();
				if (fc instanceof ParameterizedType) {// 判断是否泛型
					// 提取泛型
					ParameterizedType pt = (ParameterizedType) fc;
					Class<?> genericClazz = (Class<?>) pt
							.getActualTypeArguments()[0];
					if (BaseModel.class.equals(genericClazz.getSuperclass())) {// 判断父类是否是BaseModel
						setMethod.invoke(ctrl, new Object[] { rqm.getModelList(
								fieldName, (Class<BaseModel>) genericClazz) });
					}
				}
			} else {
				if (BaseModel.class.equals(filedClass.getSuperclass())) {// 判断父类是否是BaseModel
					setMethod.invoke(ctrl, new Object[] { rqm.getModel(
							fieldName, (Class<BaseModel>) filedClass) });
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private Method getSetMethod(Class<?> objectClass, String fieldName) {
		try {
			PropertyDescriptor pd = new PropertyDescriptor(fieldName,
					objectClass);
			return pd.getWriteMethod();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

}
