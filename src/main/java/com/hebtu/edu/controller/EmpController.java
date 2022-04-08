package com.hebtu.edu.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.hebtu.edu.pojo.Emp;
import com.hebtu.edu.pojo.EmpExample;
import com.hebtu.edu.service.EmpService;
import com.hebtu.edu.utils.Msg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;

@Controller
public class EmpController {

    @Autowired
    private EmpService empService;

    @GetMapping("/emps")
    @ResponseBody
    public Msg getAllEmpInfo(@RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum) {
        PageHelper.startPage(pageNum, 15);
        List<Emp> allEmpInfo = empService.getAllEmpInfo();
        PageInfo pageInfo = new PageInfo<>(allEmpInfo, 5);
        return Msg.success().add("pageInfo", pageInfo);
    }

    @GetMapping("emps/{id}")
    @ResponseBody
    public Msg getEmpInfoById(@PathVariable("id") Integer id) {
        Emp empInfoById = empService.getEmpInfoById(id);
        return Msg.success().add("EmpInfoById", empInfoById);
    }

    @PostMapping("/emps")
    @ResponseBody
    public Msg addEmpInfo(@Valid Emp emp, BindingResult bindingResult) {
        Map<String, Object> errors = new HashMap<>();
        if (bindingResult.hasErrors()) {
            List<FieldError> fieldErrors = bindingResult.getFieldErrors();
            for (FieldError fieldError : fieldErrors) {
                errors.put(fieldError.getField(), fieldError.getDefaultMessage());
            }
            return Msg.fail().add("errors", errors);
        } else {
            empService.addEmpInfo(emp);
            return Msg.success();
        }
    }

    @PostMapping("/checkEmail")
    @ResponseBody
    public Msg checkEmail(String email) {
        Boolean flag = empService.checkEmail(email);
        if (flag)
            return Msg.success();
        else
            return Msg.fail();
    }

    @PutMapping("/emps")
    @ResponseBody
    public Msg updateEmpById(Emp emp) {
        int result = empService.updateEmpById(emp);
        if (result > 0) {
            return Msg.success();
        } else {
            return Msg.fail();
        }
    }

    @DeleteMapping("/emps/{id}")
    @ResponseBody
    public Msg delEmpById(@PathVariable("id") String ids) {
        int result = 0;
        if (ids.contains("-")) {
            List<Integer> list_ids = new ArrayList<>();
            String[] array_ids = ids.split("-");
            for (String id : array_ids) {
                list_ids.add(Integer.parseInt(id));
            }
            result = empService.delEmpById(list_ids);
        } else {
            List<Integer> list_ids = new ArrayList<>();
            list_ids.add(Integer.parseInt(ids));
            result = empService.delEmpById(list_ids);
        }
        if (result > 0) {
            return Msg.success();
        } else {
            return Msg.fail();
        }
    }
}
