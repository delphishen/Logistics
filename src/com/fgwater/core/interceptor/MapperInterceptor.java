package com.fgwater.core.interceptor;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.utils.SessionUtils;
import com.github.pagehelper.PageHelper;

@Aspect
public class MapperInterceptor {

	public MapperInterceptor() {

	}

	@Before("execution(* com.fgwater.frame.mapper..*(..))")
	public void pagingCut(JoinPoint joinPoint) {
		MethodSignature s = (MethodSignature) joinPoint.getSignature();
		if (s.getMethod().isAnnotationPresent(Paging.class)) {
			if (Boolean.parseBoolean(SessionUtils.get("isPaging").toString())) {
				PageHelper.startPage(Integer.parseInt(SessionUtils.get(
						"pageNum").toString()), Integer.parseInt(SessionUtils
						.get("pageSize").toString()));
			}
		}
	}

}
