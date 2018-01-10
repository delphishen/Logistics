Ext.namespace('Ext.userPageRight');


var arrayMenu = new Array();	
//
//点击了选择框  onChecked : function(tr) {
function clickCheck(checkbox,param) {
	var isAdd,isModify,isDel,isSee;
	
	//如果查看权限取消，其它权限一同取消
//    if(!document.getElementById(checkbox.id.substring(0,32)+"_see").checked) {
//    	
//    	document.getElementById(checkbox.id.substring(0,32)+"_add").checked=false;
//    	document.getElementById(checkbox.id.substring(0,32)+"_modify").checked=false;
//    	document.getElementById(checkbox.id.substring(0,32)+"_del").checked=false;
//    }
    
	//同时记录 isAdd,isModify,isDel,isSee勾选状态
	if(document.getElementById(checkbox.id.substring(0,32)+"_add")!=null)
	isAdd=document.getElementById(checkbox.id.substring(0,32)+"_add").checked;
	if(document.getElementById(checkbox.id.substring(0,32)+"_modify")!=null)
	isModify=document.getElementById(checkbox.id.substring(0,32)+"_modify").checked;
	if(document.getElementById(checkbox.id.substring(0,32)+"_del")!=null)
	isDel=document.getElementById(checkbox.id.substring(0,32)+"_del").checked;
	if(document.getElementById(checkbox.id.substring(0,32)+"_see")!=null)
	isSee=document.getElementById(checkbox.id.substring(0,32)+"_see").checked;	
	
	if(isAdd || isModify || isDel ){	
		
		if(document.getElementById(checkbox.id.substring(0,32)+"_see")!=null)
		document.getElementById(checkbox.id.substring(0,32)+"_see").checked=true;
	}	
	
//	alert("isAdd="+isAdd+",isModify="+isModify+",isDel="+isDel+",isSee="+isSee);
	var isExist=0;
	//alert(arrayMenu.length);
	for (var i = 0; i < arrayMenu.length; i++) {
		//alert(Ext.encode(arrayMenu[i]));
		//alert(arrayMenu[i].menuId);
		if(arrayMenu[i].menuId==checkbox.id.substring(0,32)){
			
			if(!isAdd && !isModify && !isDel && !isSee)
			{
			//如果全部未选择，删除数组内的菜单id
			//	alert("del="+i);
			arrayMenu.splice(i,1); //删除从指定位置deletePos开始的指定数量deleteCount的元素，数组形式返回所移除的元素
			}else{
				arrayMenu[i].isModify=isModify;
				arrayMenu[i].isAdd=isAdd;
				arrayMenu[i].isDel=isDel;
				arrayMenu[i].isSee=isSee;	
			}							
			isExist=1;  //菜单 id 存在
		}	

	}		
	if(isExist==0){		
		//添加菜单权限
		var object = new Object();
		object.userId = Ext.getCmp('id').getValue();
		object.menuId = checkbox.id.substring(0,32);
		object.isModify=isModify;
		object.isAdd=isAdd;
		object.isDel=isDel;
		object.isSee=isSee;
		arrayMenu.push(object);			
	}
	
 //   alert(arrayMenu.length+"===="+Ext.encode(arrayMenu));
  
}	

Ext.userPageRight.form = Ext.extend(Ext.FormPanel, {
	constructor : function(app) {
		this.app = app;
		
		this.tree = new Ext.ux.tree.ColumnTree({
	//	this.tree = new Ext.tree.TreePanel({			
			id:'menuColumnTree',
			width : 600,
			height : 500,
			rootVisible : false,
			autoScroll : true,
			title : '权限分配',
			checkModel : 'cascade',
			//  checkModel:'childCascade',    
			//   onlyLeafCheckable: true,//对树所有结点都可选
			iconCls : 'vcard',
			enableDD : false,// 是否支持拖拽效果
			containerScroll : true,// 是否支持滚动条
			animate : false,
			//  renderTo: 'myTreeDiv',
		    viewConfig:{
		    	forceFit:true
		    },
			columns : [{
				header : '功能名称',
				width : 300,
				dataIndex : 'menu'
			},{
				header : '查看',
				width : 40,
				dataIndex : 'see'
			}, {
				header : '新增',
				width : 40,
				dataIndex : 'add'
			}, {
				header : '修改',
				width : 40,
				dataIndex : 'modify'
			}, {
				header : '删除',
				width : 40,
				dataIndex : 'del'
			} ],

			loader : new Ext.tree.TreeLoader({
				dataUrl : path + '/system/buildMenu.do',
//				uiProviders : {
//					'col' : Ext.ux.ColumnTreeCheckNodeUI
//				//	'col' : Ext.ux.tree.TreeCheckNodeUI					
//				},
			baseAttrs:{uiProvider:Ext.ux.ColumnTreeCheckNodeUI},  //ok 	
			listeners : {
			load : function() {
				var userId = this.app.app.user.id;
				//alert(userId);
						Ext.eu.ajax(
										path+ '/system/getByUserIdMenu.do',
										{
											userId : userId
										}, function(resp) {
											var arr = Ext.decode(resp.responseText);
										//	alert(resp.responseText);
											this.onChecked(arr);
										}, this);
				},
				scope : this
			}			
			
			//Ext.tree.ColumnTreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI, {  
			
			//ColumnTreeNodeUI  Ext.ux.tree.ColumnNodeUI   
			//旧 uiProvider : Ext.ux.tree.TreeCheckNodeUI
//				,baseAttrs : {
//				uiProvider : Ext.ux.tree.ColumnNodeUI
//			}
			}),

			root : new Ext.tree.AsyncTreeNode({
				text : '所有菜单',
				draggable : false,
				id : '0'
			})		
		
		});
	//	this.tree.on("clickCheck",function(node,checked){alert(node.text+" = "+checked)}); //注册"check"事件 
		
		this.items = [ {
			xtype : 'hidden',
			id : 'id',
			value : this.app.app.user.id
		}, {
			columnWidth : 1,
			items : [ {
				fieldLabel : '授权对象',
				xtype : 'textfield',
				name : 'empName',
				readOnly : true,
				style : 'background:#E6E6E6',
				anchor : '100%',
				value : this.app.app.user.empName
			} ]
		}, {
			columnWidth : 1,
			items : [ this.tree ]
		} ];

		Ext.userPageRight.form.superclass.constructor.call(this, {
			labelWidth : 60,
			baseCls : 'x-plain',
			layout : 'column',
			style : 'padding : 5',
			defaults : {
				baseCls : 'x-plain',
				layout : 'form'
			}
		});
	},
	onChecked : function(tr) {

		for (var i = 0; i < tr.length; i++) {
		//	var node = this.getNodeById(tr[i].id);
		//	if (node.isLeaf())  node.getUI().toggleCheck(true);
			var node;
			if(tr[i].fatherId!='0'){
			var object = new Object();
			object.userId = Ext.getCmp('id').getValue();
			object.menuId = tr[i].id;
			object.isModify=tr[i].isModify;
			object.isAdd=tr[i].isAdd;
			object.isDel=tr[i].isDel;
			object.isSee=tr[i].isSee;
			arrayMenu.push(object);		
			}
			
			if(tr[i].isSee==true && tr[i].fatherId!='0'){
				node=tr[i].id+"_see";
				//document.getElementById(node)!=null   过滤掉父菜单
				if(document.getElementById(node)!=null)  document.getElementById(node).checked=true;	
				//父菜单    eee061c766204b669a3ac72a82bd43e7_see

			} 
			if(tr[i].isModify==true && tr[i].fatherId!='0'){
				node=tr[i].id+"_modify";
				//document.getElementById(node)!=null   过滤掉父菜单
				if(document.getElementById(node)!=null) document.getElementById(node).checked=true;	
			}
			if(tr[i].isAdd==true && tr[i].fatherId!='0' ){
				node=tr[i].id+"_add";
				//document.getElementById(node)!=null   过滤掉父菜单
				if(document.getElementById(node)!=null) document.getElementById(node).checked=true;	
			}
			if(tr[i].isDel==true && tr[i].fatherId!='0' ){
				node=tr[i].id+"_del";
				//document.getElementById(node)!=null   过滤掉父菜单
				if(document.getElementById(node)!=null) document.getElementById(node).checked=true;	
			}					
			
		}
	}	
	
	
	
	
	
	
	
	
});





Ext.userPageRight.win = Ext.extend(Ext.Window, {
	constructor : function(app) {
		arrayMenu=[];   //显示win 清空下菜单权限
		this.app = app;
		this.form = new Ext.userPageRight.form(this);
		Ext.userPageRight.win.superclass.constructor.call(this, {
			width : 500,
			plain : true,
			showLock : true,
			modal : true,
			resizable : false,
			buttonAlign : 'center',
			items : this.form,
			buttons : [ {
				text : '保存',
				iconCls : 'save',
				handler : this.onSave,
				scope : this
			}, {
				text : '取消',
				iconCls : 'cancel',
				handler : this.onClose,
				scope : this
			} ]
		});
	},
	onSave : function(btn) {
		this.userId = this.form.getForm().findField('id').getValue();
		if (this.userId == '') {
			Ext.ux.Toast.msg('信息', '请先选择授权对象');
			return;
		}
		if (arrayMenu.length == 0) {
			Ext.ux.Toast.msg('信息', '请选择权限');
			return;
		}
    //  alert(Ext.encode(arrayMenu));
		Ext.eu.ajax(path + '/system/saveRight.do', {
			userPageRights : Ext.encode(arrayMenu)
		}, function(resp) {
			Ext.ux.Toast.msg('信息', '保存成功');
			this.close();
		}, this);
	},
	onClose : function() {	
		this.close();
	}
});