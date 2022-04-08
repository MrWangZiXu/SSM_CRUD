package com.hebtu.edu.controller;

import com.hebtu.edu.pojo.Dept;
import com.hebtu.edu.service.DeptService;
import com.hebtu.edu.utils.Msg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
public class DeptController {

    @Autowired
    private DeptService deptService;

    @GetMapping("/depts")
    @ResponseBody
    public Msg getAllDeptInfo(){
        List<Dept> allDeptInfo = deptService.getAllDeptInfo();
        return Msg.success().add("depts",allDeptInfo);
    }
}
