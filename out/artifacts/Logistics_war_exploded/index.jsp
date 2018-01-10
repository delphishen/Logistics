<%@ page language="java" pageEncoding="utf-8"%>
<%@page import="com.fgwater.core.common.ConstantSys"%>
<%@page import="com.fgwater.frame.model.system.User"%>

<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";

	User user = (User) session
			.getAttribute(ConstantSys.USERSESSION_USER);
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE8" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<base href="<%=basePath%>">
		<title>泉州搏浪信息科技有限公司</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is BOLANG page">

		<script type="text/javascript">
			var path = '<%=path%>';
		
			var basePath = '<%=basePath%>'
			var loginName= '<%=user.getLoginName()%>'
			var loginID= '<%=user.getEmpId()%>'
			var isAdmin = '<%=user.getIsAdmin()%>'
			var loginEmpID = '<%=user.getEmpId()%>'
		</script>

		<!-- 载入基础样式 -->
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>jsLib/ext3/css/ext-all.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>css/frame.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>css/icons.css" />		
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>jsLib/ext3/ux/css/Portal.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>jsLib/ext3/ux/treegrid/treegrid.css" />
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>jsLib/ext3/ux/uploadDialog/css/uploadDialog.css" />

          <!-- 2017.08.04日程控件样式 -->
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>jsLib/extensible-1.0.2/resources/css/extensible-all.css" />
			
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>jsLib/columnTreeCheck/ColumnNodeUI.css" />			
		<link rel="stylesheet" type="text/css"
			href="<%=basePath%>jsLib/columnTreeCheck/column-tree.css" />	




		<!-- ext库及组件 -->
		<script type="text/javascript"
			src="<%=basePath%>jsLib/ext3/ext-base.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>jsLib/ext3/ext-all-debug.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>jsLib/ext3/ext-lang-zh_CN.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>jsLib/ext3/ux/Portal.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>jsLib/ext3/ux/PortalColumn.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>jsLib/ext3/ux/Portlet.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>jsLib/ext3/ux/Toast.js"></script>

		<script type="text/javascript"
			src="<%=basePath%>jsLib/jquery/jquery-1.7.2.js"></script>

		<!-- 动态加载相关组件 -->
		<script type="text/javascript" src="<%=basePath%>js/core/scriptMgr.js"></script>
		<script type="text/javascript" src="<%=basePath%>js/core/appMgr.js"></script>
		<script type="text/javascript" src="<%=basePath%>js/import.js"></script>

		<!-- 首页及公用组件 -->
		<script type="text/javascript" src="<%=basePath%>js/core/constant.js"></script>
		<script type="text/javascript" src="<%=basePath%>js/index/index.js"></script>
		<script type="text/javascript" src="<%=basePath%>js/index/home.js"></script>
		<script type="text/javascript" src="<%=basePath%>utils/extUtils.js"></script>
		<script type="text/javascript"
			src="<%=basePath%>utils/mapContainerUtils.js"></script>



		
	</head>

	<body>
		<div id="north">
			<table width="100%" border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td height="45px" background="<%=basePath%>images/frame/topbg.png">
						<div style="float: left;">
							<img id="logo" src="<%=basePath%>images/frame/logomini.png" />
						</div>
						<div style="float: right; font-size: 12px; color: #fff;">
							<div
								style="text-align: right; margin-top: 5px; margin-right: 15px;">
								<p>
									<!--  <span>公司：</span>
									<span>部门：</span>-->
									<span>用户：</span><%=user.getLoginName()%>
								</p>
							</div>
							<div
								style="text-align: right; margin-top: 8px; margin-right: 15px;">
								<p>
								 <% if(user.getIsAdmin()==1) {%>
									<a id="myMessage" href="javascript:void(0)" class="lockScreen"
										onclick="myMessage()">我的消息</a>
									<%} %>	
									<a id="modifyPassword" href="javascript:void(0)" class="lockScreen"
										onclick="modifyPassword()">修改登录密码</a>
									<a id="switchPro" href="javascript:void(0)" class="switchPro"
										onclick="switchPro()">切换到GIS</a>
									<a id="logout" href="javascript:void(0)" class="logout"
										onclick="logout()">退出</a>
								</p>
							</div>
						</div>
					</td>
				</tr>
			</table>
		</div>

		<div id="south" style="width: 100%;">
			<div id="support"
				style="float: left; width: 32%; margin-top: 4; margin-left: 10;">
				技术支持：
				<a href="#" style='text-decoration: none'>QQ:5666057</a>
			</div>
			<div id="copyright"
				style="float: left; width: 36%; text-align: center; margin-top: 4;">
				Copyright © 2017 泉州搏浪信息科技有限公司 All Rights Reserved
			</div>
			<div id="version"
				style="float: right; margin-top: 4; margin-right: 10;">
				版本：
				<a href="#" style='text-decoration: none'>BL_alpha_V1.0.0</a>
			</div>
		</div>
	</body>
</html>
