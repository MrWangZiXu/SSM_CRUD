package com.hebtu.edu.service;

import com.hebtu.edu.dao.DeptMapper;
import com.hebtu.edu.pojo.Dept;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DeptService {

    @Autowired
    private DeptMapper deptMapper;

    public List<Dept> getAllDeptInfo() {
        List<Dept> deptList = deptMapper.selectByExample(null);
        return deptList;
    }
}
