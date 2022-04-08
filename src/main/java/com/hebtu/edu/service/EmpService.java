package com.hebtu.edu.service;

import com.hebtu.edu.dao.EmpMapper;
import com.hebtu.edu.pojo.Emp;
import com.hebtu.edu.pojo.EmpExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmpService {

    @Autowired
    private EmpMapper empMapper;

    public List<Emp> getAllEmpInfo() {
        EmpExample example = new EmpExample();
        example.setOrderByClause("emp_id");
        List<Emp> empList = empMapper.selectByExampleWithDept(example);
        return empList;
    }

    public int addEmpInfo(Emp emp) {
        int result = empMapper.insertSelective(emp);
        return result;
    }

    public Boolean checkEmail(String email) {
        EmpExample example=new EmpExample();
        example.createCriteria().andEmailEqualTo(email);
        long count = empMapper.countByExample(example);
        if(count>0){
            return false;
        }else {
            return true;
        }
    }

    public Emp getEmpInfoById(Integer id) {
        Emp emp = empMapper.selectByPrimaryKeyWithDept(id);
        return emp;
    }

    public int updateEmpById(Emp emp) {
        int result = empMapper.updateByPrimaryKeySelective(emp);
        return result;
    }

    public int delEmpById(List<Integer> delIds) {
        EmpExample example = new EmpExample();
        example.createCriteria().andEmpIdIn(delIds);
        int result = empMapper.deleteByExample(example);
        return result;
    }
}
