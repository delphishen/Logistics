package com.fgwater.frame.service.result.impl;

import com.fgwater.core.service.impl.BaseServiceImpl;
import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.utils.UUIDUtils;
import com.fgwater.frame.mapper.info.StandardBelongSortMapper;
import com.fgwater.frame.mapper.result.ResultMapper;
import com.fgwater.frame.model.info.StandardBelongSort;
import com.fgwater.frame.service.info.StandardBelongSortService;
import com.fgwater.frame.service.result.ResultService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service("resultService")
public class ResultServiceImpl extends BaseServiceImpl implements ResultService {

    @Resource
    private ResultMapper resultMapper;

    public List<Map<String, String>> getAll(String ids) {
        Map<String, String> m = new HashMap<>();
        if (StrUtils.isNullOrEmpty(ids)) {
            return new ArrayList<Map<String, String>>();
        } else {
            return this.resultMapper.getAll(ids);
        }
    }

}
