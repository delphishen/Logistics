<%@ page language="java" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<link type="text/css" href="<%=basePath%>page/home/css/home.css"
			rel="stylesheet" />

		<script type="text/javascript">
			var path = '<%=path%>';
			function keyDown(e){
            	if(e.keyCode == 8){ 
            		return false;
			    } 
       		}
       		document.onkeydown = keyDown;
		</script>
 
		
		
	</head>
	<body>
		<div id="sample-overview">	
		</div>
		
	</body>
</html>


