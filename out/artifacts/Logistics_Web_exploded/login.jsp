<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<title>福建庆丰物流有限公司</title>

		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>css/login.css" />

		<script type="text/javascript">
			var path = '<%=path%>';
		</script>

		<script type="text/javascript"
			src="<%=basePath%>jsLib/jquery/jquery-1.7.2.js"></script>
		<script type="text/javascript" src="<%=basePath%>utils/jqueryUtils.js"></script>
		<script type="text/javascript" src="<%=basePath%>js/index/login.js"></script>

		<script type="text/javascript">
			function reflesh() {
				document.getElementById("randImg").src = "<%=basePath%>system/auth?+now="
						+ new Date().getTime();
				document.getElementById("randImg").focus();
			}
		</script>
	</head>
	<body>
		<div class="header"></div>
		<div id="wrapper" class="body">
			<div class="login">
				<div class="login_left">
					<div class="logo" align="center" style="padding-top: 7px">
						<img src="<%=basePath%>images/login/logo.png" />
					</div>
					<div class="info" align="center">
					</div>
				</div>
				<div class="login_right">
					<div class="title"></div>
					<form id="loginForm">
						<ul class=denglu>
							<li>
								用户：
								<input id="loginName" name="loginName" value="" type="text" class="inp_txt" />
							</li>
							<li>
								密码：
								<input id="password" name="password" value="" type="password" class="inp_txt" />
							</li>
							<!-- <li>
								验证码：
								<input id="rand" name="rand" type="text" class="inp_txt"
									style="width: 80px" />
								<img src="<%=basePath%>/system/auth?_=<%=new Date().getTime()%>"
									id="randImg" width="52" height="24" border="0"
									align="absmiddle" style="margin-bottom: 4px" />
								<a href="javascript:reflesh()">看不清，换一张？</a>
							</li> -->
							<li style="height: 26px; margin-top: 10px">
								<input id="login" type="button" value="" class="but_login" />
								<input id="reset" type="button" value="" class="but_reset" />
							</li>
							<li id="validateTips"
								style="width: 355px; height: 20px; border: #f00 dashed 1px; color: #f00; padding: 2px 0 0 5px; overflow: hidden; line-height: 20px; margin-top: 6px;">
							</li>
						</ul>
					</form>
				</div>
			</div>
		</div>
		<div class="footer">
			建议浏览器：谷歌 Firefox  建议分辨率：1024*768以上
			<!-- Copyright © 2017 QINGFENG All Rights Reserved 福建庆丰物流有限公司 版权所有 -->
		</div>
	</body>
</html>