Ext.namespace('App');

/**
 * 动态加载JS库。 1.根据页面入口名称在importJs中定位需要加载的js
 * 2.根据与入口方法名称相同的组件id在主页面中定位标签页，用于判断标签页是否已经打开
 * 
 * @type
 */
App.importJs = {
	/** *************************基础管理*************************** */
	infoView : [path + '/js/info/infoView.js'],
	iconView : [path + '/jsLib/ext3/ux/uploadDialog/UploadDialog.js',
			path + '/js/basic/iconView.js'],
	/** *************************水平衡基础管理*************************** */
	kqView : [path + '/utils/expansion/treeCombo.js',
			path + '/js/wbb/kq/quotaImportWin.js',
			path + '/utils/kqNameUtil.js', path + '/js/wbb/kq/kqWin.js',
			path + '/js/wbb/kq/kqTree.js', path + '/js/wbb/kq/kqView.js'],
	standardView : [path + '/utils/expansion/treeCombo.js',
			path + '/utils/selector/standardKqSelector.js',
			path + '/js/wbb/standard/standardTree.js',
			path + '/js/wbb/standard/standardWin.js',
			path + '/js/wbb/standard/standardSettingWin.js',
			path + '/js/wbb/standard/standardView.js'],
	muwView : [path + '/js/wbb/muwView.js'],
	qpView : [path + '/utils/expansion/treeCombo.js',
			path + '/utils/selector/kqSelector.js',
			path + '/utils/selector/kqEvolveSelector.js',
			path + '/utils/selector/qpSelector.js',
			path + '/utils/calculator/calculator.js',
			path + '/js/wbb/qp/qpTree.js', path + '/js/wbb/qp/qpWin.js',
			path + '/js/wbb/qp/qpView.js'],
	cqView : [path + '/utils/expansion/treeCombo.js',
			path + '/utils/selector/kqSelector.js',
			path + '/utils/selector/kqEvolveSelector.js',
			path + '/utils/selector/qpSelector.js',
			path + '/utils/calculator/calculator.js',
			path + '/js/wbb/cq/cqEvaRateGrid.js',
			path + '/js/wbb/cq/cqTree.js', path + '/js/wbb/cq/cqWin.js',
			path + '/js/wbb/cq/cqView.js'],
	jqView : [path + '/utils/calculator/calculator.js',
			path + '/utils/selector/rpSelector.js',
			path + '/utils/selector/qpSelector.js',
			path + '/js/wbb/jq/jqWin.js', path + '/js/wbb/jq/jqView.js'],
	algorithmView : [path + '/js/wbb/algorithmView.js'],
	assistView : [path + '/js/wbb/assistView.js'],

    /** *************************合同管理*************************** */	
	contractView : [                  
	
				path + '/jsLib/ext3/ux/uploadDialog/UploadDialog.js',
				path + '/js/system/attachView.js',  
	             path + '/js/logistics/contractView.js'
	             ],		
	
    /** *************************车辆调度管理*************************** */	
	vehicleSchedulingView : [                  
	        path + '/jsLib/extensible-1.0.2/lib/extensible-all-debug.js',  
	        
//	        path + '/jsLib/extensible-1.0.2/examples/calendar/data/events.js', 
//	        path + '/jsLib/extensible-1.0.2/examples/calendar/MemoryEventStore.js', 	        
	        
	 // 2017.08.08加载这个是因为对EventEditWindow 做了修改，所以不能用extensible-all-debug.js 里面的EventEditWindow
	             path + '/jsLib/extensible-1.0.2/src/calendar/EventEditWindow.js',    
	             path + '/jsLib/extensible-1.0.2/src/locale/extensible-lang-zh_CN.js',	   	                         
             
	             path + '/utils/selector/truckSelector.js', 
	             path + '/js/logistics/vehicleSchedulingView.js'
	            
	             ],		
    /** *************************车辆调度跟踪管理*************************** */	
	dispatchListView : [path + '/js/logistics/dispatchListAmendedPetitionWin.js',	
	                    path + '/js/logistics/dispatchListView.js',	
	                    path + '/js/logistics/dispatchListTree.js',
	                    path + '/utils/selector/empSelector.js',
	             path + '/utils/expansion/treeCombo.js'],			
	
    /** *************************任务列表管理*************************** */	
	taskListView : [path + '/js/logistics/taskListView.js',	               
	             path + '/utils/selector/empSelector.js'],		

	             
    /** *************************车辆类别管理*************************** */	
	truckTypeView : [path + '/js/logistics/dossier/truckTypeView.js',
	             ],	
	             
    /** *************************车辆档案管理*************************** */	
	truckView : [path + '/js/logistics/dossier/truckView.js',
	             path + '/utils/selector/empSelector.js'],	
	
    /** *************************线路档案管理*************************** */		             
	linesView : [path + '/js/logistics/dossier/linesView.js'],	
	
    /** *************************车辆等级案管理*************************** */		             
	gradeView : [path + '/js/logistics/dossier/gradeView.js'],	
	
    /** *************************客户档案管理*************************** */		             
	customerView : [path + '/js/logistics/dossier/customerView.js'],	
	
    /** *************************拓扑管理*************************** */
    resultView : [path + '/js/result/resultView.js'],
	/** *************************系统管理*************************** */
	menuView : [path + '/jsLib/ext3/ux/treegrid/TreeGridSorter.js',
			path + '/jsLib/ext3/ux/treegrid/TreeGridColumnResizer.js',
			path + '/jsLib/ext3/ux/treegrid/TreeGridNodeUI.js',
			path + '/jsLib/ext3/ux/treegrid/TreeGridLoader.js',
			path + '/jsLib/ext3/ux/treegrid/TreeGridColumns.js',
			path + '/jsLib/ext3/ux/treegrid/TreeGrid.js',
			path + '/utils/expansion/iconCombo.js',
			path + '/js/system/menuView.js'],
	attachView : [path + '/jsLib/ext3/ux/uploadDialog/UploadDialog.js',
			path + '/js/system/attachView.js'],
	employeeView : [path + '/js/system/employeeView.js'],
	rightView : [path + '/jsLib/ext3/ux/TreeCheckNodeUI.js',
	             path + '/js/system/rightView.js'],	
	userView : [path + '/utils/selector/empSelector.js',
		//		path + '/jsLib/ext3/ux/TreeCheckNodeUI.js',  		
			path + '/jsLib/columnTreeCheck/ColumnNodeUI.js',
			path + '/jsLib/columnTreeCheck/ColumnTreeCheckNodeUI.js',
			
	//		path + '/jsLib/columnTreeCheck/TreeCheckNodeUI.js',

			path + '/js/system/userPageRightWin.js',
			path + '/js/system/userView.js']

};
