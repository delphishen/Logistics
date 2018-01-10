package com.fgwater.frame.mapper.wbb;

import java.util.List;
import java.util.Map;

import com.fgwater.core.annotation.Paging;
import com.fgwater.core.mapper.BaseMapper;
import com.fgwater.frame.model.wbb.Cq;
import com.fgwater.frame.model.wbb.Jq;
import com.fgwater.frame.model.wbb.Qp;

public interface QpMapper extends BaseMapper<Qp> {

	@Paging
	public List<Map<String, String>> query(Map<String, String> params);

	public List<Qp> getCascade(Qp qp);

	public List<Cq> getCascadeCq(List<String> list);

	public List<Jq> getCascadeJq(List<String> list);

	public List<Qp> getCascadeEl(List<String> list);

}
