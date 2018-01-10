package com.fgwater.frame.service.system.impl;

import java.io.File;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.frame.mapper.system.AttachMapper;
import com.fgwater.frame.model.system.Attach;
import com.fgwater.frame.service.system.AttachService;

import net.sf.json.JSONArray;

@Service("attachService")
public class AttachServiceImpl extends BaseServiceImpl implements AttachService {

	@Resource
	private AttachMapper attachMapper;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.attachMapper.query(params);
	}

	public void save(Attach attach) {
			JSONArray ja = JSONArray.fromObject(attach);
			Object swap = ja;	
			System.out.println("attachMapper==="+swap.toString());		
		this.attachMapper.insert(attach);
	}

	public void delete(List<Attach> attachs) {
		for (Attach attach : attachs) {
			this.attachMapper.deletePhysical(attach);
			File file = new File(attach.getFilePath());
			file.delete();
		}
	}

}
