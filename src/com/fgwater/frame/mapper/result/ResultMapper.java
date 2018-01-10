package com.fgwater.frame.mapper.result;

import com.fgwater.core.mapper.BaseMapper;

import java.util.List;
import java.util.Map;

public interface ResultMapper extends BaseMapper {

    public List<Map<String, String>> getAll(String ids);

}
