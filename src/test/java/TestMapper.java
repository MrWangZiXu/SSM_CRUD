import com.hebtu.edu.dao.DeptMapper;
import com.hebtu.edu.dao.EmpMapper;
import com.hebtu.edu.pojo.Dept;
import com.hebtu.edu.pojo.Emp;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import java.util.List;
import java.util.UUID;

/**
 * 使用Spring的单元测试
 * 1、导入Spring Test依赖
 * 2、@ContextConfiguration指定Spring配置文件的位置
 * 3、直接@Autowired自动装配
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class TestMapper {
    @Autowired
    private DeptMapper deptMapper;
    @Autowired
    private EmpMapper empMapper;
    @Test
    public void testCRUD(){
        /**
         * 测试接口方法
         */
        /*deptMapper.insertSelective(new Dept(null,"财务部"));
        deptMapper.insertSelective(new Dept(null,"人事部"));
        deptMapper.insertSelective(new Dept(null,"测试部"));

        empMapper.insertSelective(new Emp(null,"张三","男","997457557@qq.com",1));
        empMapper.insertSelective(new Emp(null,"李四","男","12345332234@qq.com",2));
        empMapper.insertSelective(new Emp(null,"王五","男","216645433@qq.com",3));
        empMapper.insertSelective(new Emp(null,"周王","男","9473846304@qq.com",4));*/

        /*List<Dept> depts = deptMapper.selectByExample(null);
        System.out.println(depts);
        List<Emp> emps = empMapper.selectByExampleWithDept(null);
        System.out.println(emps);
        Emp emp = empMapper.selectByPrimaryKeyWithDept(1);
        System.out.println(emp);*/
        /**
         * 批量插入
         */
        /*for (int i = 0; i < 333; i++) {
            String name = UUID.randomUUID().toString().substring(1, 5)+i;
            int d_id = (int)(Math.random() * 5 + 1);
            if (i%2!=0){
                empMapper.insertSelective(new Emp(null,name,"男",name+"@edu.com",d_id));
            }else {
                empMapper.insertSelective(new Emp(null,name,"女",name+"@edu.com",d_id));
            }
        }*/
        /*System.out.println("hot-fix add");
        System.out.println("master add");
        System.out.println("hot-fix add-2");*/
    }
}
