package com.fgwater.frame.web.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.fgwater.core.common.ConstantSys;
import com.fgwater.core.utils.SessionUtils;
import com.fgwater.frame.model.system.User;

/**
 * 
 * description : 在线验证过滤器
 * 
 * creator : 刘必文
 * 
 * createTime : Nov 9, 2012 2:48:25 PM
 * 
 * version : 1.0
 * 
 * remark : 针对所有后台action，验证用户是否登陆并同步用户信息至线程
 * 
 */
public class OnlineFilter extends HttpServlet implements Filter {
	private static final long serialVersionUID = 1L;

	public void init(FilterConfig filterConfig) throws ServletException {

	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;
		HttpSession session = req.getSession(true);
		// 获取访问地址
		String callPath = req.getServletPath();

		// 从session里取的用户名信息
		User user = (User) session.getAttribute(ConstantSys.USERSESSION_USER);
		// 当请求超越登陆访问时，校验用户是否在线，排除登录页面过滤
		if (!callPath.endsWith("/login.jsp") && !callPath.endsWith("/login.do")) {
			// 判断如果没有取到用户信息,就跳转到登陆页面
			if (user == null) {
				// 构建跳转
				RequestDispatcher dispatcher = request
						.getRequestDispatcher("/login.jsp");
				// 跳转至登陆页面
				dispatcher.forward(request, response);
				res.setHeader("Cache-Control", "no-store");
				res.setDateHeader("Expires", 0);
				res.setHeader("Pragma", "no-cache");
				return;
			} else {
				// 同步线程
				SessionUtils.set(ConstantSys.USERSESSION_USER, user);
			}
		}
		// 继续请求
		chain.doFilter(request, response);
	}

	public void destroy() {

	}
}