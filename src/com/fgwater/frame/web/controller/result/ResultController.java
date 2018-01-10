package com.fgwater.frame.web.controller.result;

import com.fgwater.core.utils.StrUtils;
import com.fgwater.core.web.controller.BaseController;
import com.fgwater.frame.service.info.StandardBelongSortService;
import com.fgwater.frame.service.result.ResultService;
import net.sf.json.JSONArray;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.File;
import java.util.List;
import java.util.Map;

@Controller
@Scope("request")
@RequestMapping(value = "/result", produces = "text/plain;charset=UTF-8;")
public class ResultController extends BaseController {

    @Resource
    private ResultService resultService;

    @ResponseBody
    @RequestMapping(value = "getAllResult.do")
    public String getAll() {
        String filePath = this.getClass().getClassLoader().getResource("../../result/").getPath();


        File dir = new File(filePath);
        File[] files = dir.listFiles();

        String ids = "";
        for (File file : files) {
            String fileName = file.getName();
            if (fileName.contains(".pdf")) {
                fileName = fileName.substring(0, fileName.indexOf("."));
                ids += "'" + fileName + "',";
            }
        }
        if (!StrUtils.isNullOrEmpty(ids)) {
            ids = ids.substring(0, ids.lastIndexOf(","));
            ids = "(" + ids + ")";
        }
        List<Map<String, String>> list = this.resultService.getAll(ids);
        for (Map<String, String> m : list) {
            m.put("filePath", filePath);
        }
        this.responseModel.mount(list, MOUNT_TYPE_JA);
        return this.responseModel.serial();
    }

}
