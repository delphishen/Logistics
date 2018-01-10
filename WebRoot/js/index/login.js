$(function() {
			// 错误提示隐藏
			$('#validateTips').hide();

			$("#loginName").focus();

			$('#reset').click(function() {
						$('#loginName').attr('value', '');
						$('#password').attr('value', '');
						// $('#rand').attr('value', '');
						$('#validateTips').hide();
						return false;
					});

			$('#login').click(function() {
						var bValid = true;

						bValid = bValid && $.checkLength({
									o : $('#loginName'),
									name : "用户名",
									min : 1,
									showType : 3
								});

						bValid = bValid && $.checkLength({
									o : $('#password'),
									name : "密码",
									min : 1,
									max : 16,
									showType : 3
								});

						// bValid = bValid && $.checkLength({
						// o : $('#rand'),
						// name : "校验码",
						// min : 4,
						// max : 4,
						// showType : 3
						// });

						if (bValid) {
							$('#login').hide();
							$('#reset').hide();
							$('#loading').show();
							$.ajax({
										url : path + '/system/login.do',
										data : $.formParams($('#loginForm')),
										dataType : 'json',
										type : 'POST',
										cache : false,
										success : function(data) {
											if (data.msg != 'ok') {
												// reflesh();
												$('#validateTips').empty();
												$('#validateTips').text(data.msg);
												$('#validateTips').show();
												$('#login').show();
												$('#reset').show();
												$('#loading').hide();
											} else {
												$('#validateTips').hide();
												window.location.href = 'index.jsp';
											}
										},
										error : function() {
											$('#login').show();
											$('#reset').show();
										}
									});
						} else {
							$('#validateTips').empty();
							$('#validateTips').text('请输入正确的用户名、密码及验证码');
							$('#validateTips').show();
							return false;
						}
					});

			$(document).keypress(function(e) {
						switch (e.which) {
							case 13 :
								$('#login').click();
								break;
						}
					});
		})