package com.fgwater.frame.service.basic.impl;

import java.io.File;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.basic.IconMapper;
import com.fgwater.frame.mapper.system.AttachMapper;
import com.fgwater.frame.model.basic.Icon;
import com.fgwater.frame.model.system.Attach;
import com.fgwater.frame.service.basic.IconService;

@Service("iconService")
public class IconServiceImpl extends BaseServiceImpl implements IconService {

	@Resource
	private IconMapper iconMapper;

	@Resource
	private AttachMapper attachMapper;

	public List<Map<String, String>> query(Map<String, String> params) {
		return this.iconMapper.query(params);
	}

	public boolean saveOrUpdate(Icon icon) {
		int count = this.iconMapper.check(icon, "name");
		if (count == 0) {
			if (StrUtils.isNullOrEmpty(icon.getId())) {
				icon.setId(UUIDUtils.getUUID());
				this.iconMapper.insert(icon);
			} else {
				this.iconMapper.update(icon);
			}
		}
		return count == 0;
	}

	public void defaultIcon(Icon icon) {
		this.iconMapper.defaultIcon(icon.getType());
		this.iconMapper.update(icon);
	}

	public void delete(List<Icon> icons) {
		for (Icon icon : icons) {
			this.iconMapper.deleteLogic(icon);
			this.deleteAttach(icon);
		}
	}

	private void deleteAttach(Icon icon) {
		if (!StrUtils.isNullOrEmpty(icon.getAttachId())) {
			Attach attach = this.attachMapper.getById(icon.getAttachId());
			if (attach != null) {
				attachMapper.deleteLogic(attach);
				File file = new File(attach.getFilePath());
				if (file.exists()) {
					file.delete();
				}
			}
		}
	}

}
