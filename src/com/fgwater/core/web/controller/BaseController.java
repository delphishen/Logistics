package com.fgwater.core.web.controller;

import com.fgwater.core.common.ConstantSys;
import com.fgwater.core.model.RequestModel;
import com.fgwater.core.model.ResponseModel;

public class BaseController {

	public int MOUNT_TYPE_JO = ConstantSys.RESP_MOUNT_TYPE_JO;

	public int MOUNT_TYPE_JA = ConstantSys.RESP_MOUNT_TYPE_JA;

	public int MOUNT_TYPE_MSG = ConstantSys.RESP_MOUNT_TYPE_MSG;

	public int MOUNT_TYPE_FORM = ConstantSys.RESP_MOUNT_TYPE_FORM;

	public int MOUNT_TYPE_PAGING = ConstantSys.RESP_MOUNT_TYPE_PAGING;

	public RequestModel requestModel;

	public ResponseModel responseModel;

	public BaseController() {

	}

}
