//上下文路径
var ContextPath="/SSM_CRUD"
var currentPage;
/**
 * 员工信息显示操作
 */
//1、DOM完成加载后，Ajax向服务器发送请求，要到json数据。
$(function () {
    //初始页面：1
    jumpPage(1);
});
//页面跳转
function jumpPage(pageNum) {
    $.ajax({
        url:ContextPath+"/emps",
        data:"pageNum="+pageNum,
        type:"get",
        success:function (result) {
            console.log(result);
            //1、解析并显示员工数据
            build_emps_table(result);
            //2、解析并显示分页信息
            build_emps_pageInfo(result);
            //3、解释并显示分页条信息
            build_emps_pageBar(result);
        }
    });
}
function build_emps_table(result) {
    $("#check_all").prop("checked",false);
    $("#emps_table tbody").empty();
    var emps=result.extend.pageInfo.list;
    $.each(emps,function (index,item) {
        var checkBoxTd=$("<td><input type=checkbox class=check_item></td>")
        var empIdTd=$("<td></td>").append(item.empId);
        var empName=$("<td></td>").append(item.empName);
        var gender=$("<td></td>").append(item.gender);
        var email=$("<td></td>").append(item.email);
        var deptName=$("<td></td>").append(item.dept.deptName);
        var editButton=$("<button></button>").attr("update_id",item.empId).addClass("btn btn-primary btn-sm update-btn").append($("<span></span>").addClass("glyphicon glyphicon-pencil")).append("编辑");
        var delButton=$("<button></button>").addClass("btn btn-danger btn-sm del-btn").append($("<span></span>").addClass("glyphicon glyphicon-trash")).append("删除");
        var editAndDelTd=$("<td></td>").append(editButton).append(" ").append(delButton);
        $("<tr></tr>").append(checkBoxTd).append(empIdTd).append(empName).append(gender).append(email).append(deptName).append(editAndDelTd).appendTo("#emps_table tbody");
    });
}
function build_emps_pageInfo(result) {
    $("#emps_pageInfo").empty();
    $("#emps_pageInfo").append("当前页："+result.extend.pageInfo.pageNum+" 共"+result.extend.pageInfo.pages+"页"+" 共"+result.extend.pageInfo.total+"条记录");
    //将当前页号赋值给更新按钮，提交更新后转到更新后页面
    $("#empInfo_submit_update").attr("update_pageNum",result.extend.pageInfo.pageNum);
    currentPage=result.extend.pageInfo.pageNum;
}
function build_emps_pageBar(result) {
    $("#emp_pageBar").empty();
    var pageBar_li_index = $("<li></li>").append($("<a></a>").append("首页"));
    var pageBar_li_prePage = $("<li></li>").append($("<a></a>").append($("<span></span>").append("&laquo;")));
    if (result.extend.pageInfo.hasPreviousPage == false) {
        pageBar_li_index.addClass("disabled");
        pageBar_li_prePage.addClass("disabled");
    } else {
        pageBar_li_prePage.click(function () {
            jumpPage(result.extend.pageInfo.pageNum - 1);
        });
        pageBar_li_index.click(function () {
            jumpPage(1);
        });
    }
    var pageBar_li_end = $("<li></li>").append($("<a></a>").append("末页"));
    var pageBar_li_nextPage = $("<li></li>").append($("<a></a>").append($("<span></span>").append("&raquo;")));
    if (result.extend.pageInfo.hasNextPage == false) {
        pageBar_li_end.addClass("disabled");
        pageBar_li_nextPage.addClass("disabled");
    } else {
        pageBar_li_end.click(function () {
            jumpPage(result.extend.pageInfo.pages);
        });
        pageBar_li_nextPage.click(function () {
            jumpPage(result.extend.pageInfo.pageNum + 1);
        });
    }
    var pageBar_ul = $("<ul></ul>").addClass("pagination").append(pageBar_li_index).append(pageBar_li_prePage)
    $.each(result.extend.pageInfo.navigatepageNums, function (index, item) {
        var num_li = ($("<li></li>").append($("<a></a>").append(item)));
        //绑定跳转页面事件
        num_li.click(function () {
            jumpPage(item);
        });
        if (result.extend.pageInfo.pageNum == item) {
            //取消click事件，以免重复点击发起请求。
            num_li.unbind("click");
            num_li.addClass("active");
        }
        pageBar_ul.append(num_li);
    });
    pageBar_ul.append(pageBar_li_nextPage).append(pageBar_li_end);
    var pageBar_nav = $("<nav></nav>").append(pageBar_ul);
    $("#emp_pageBar").append(pageBar_nav);
}


/**
 * 新增员工信息操作
 */
function removeForm(ele) {
    $(ele)[0].reset();
    $(ele).find("*").removeClass("has-success has-error");
    $(ele).find(".help-block").text("");
}
//绑定新增按钮事件
$("#emp_add").click(function () {
    //清空原表单数据
    removeForm("#emp_add_modal form");
    //获取部门信息，添加到下拉框
    addDeptInfo("#input_emp_deptName")
    //弹出模态框
    $('#emp_add_modal').modal({
        backdrop:"static"
    });
});
//将部门信息添加到模态框
function addDeptInfo(ele) {
    //向服务器请求部门数据
    $.ajax({
        url:ContextPath+"/depts",
        type:"get",
        success:function (result) {
            console.log(result);
            $(ele).empty();
            $.each(result.extend.depts,function (index,item) {
                var deptName_option=$("<option></option>").append(item.deptName).attr("value",item.deptId);
                $(ele).append(deptName_option);
            });
        }
    });
}



//modal数据校验
function validateModalMsg(ele,status,msg) {
    //移除原有添加数据
    $(ele).parent().removeClass("has-success has-error");
    $(ele).next("span").text("");
    if (status == "success") {
        $(ele).parent().addClass("has-success");
        $(ele).next("span").text(msg);
    }
    if (status == "error") {
        $(ele).parent().addClass("has-error");
        $(ele).next("span").text(msg);
    }
}

/*--------------新增modal数据校验-------------*/
var flagEmpName=false,flagEmail=false;
//为modal input-empName绑定失去焦点事件
$("#input_emp_name").blur(function () {
    var empName=$("#input_emp_name").val();
    var regEmpName=/^[\u4E00-\u9FA5A-Za-z]{2,20}$/;
    if(regEmpName.test(empName)){
        validateModalMsg("#input_emp_name","success","");
        flagEmpName=true;
        return;
    }else {
        validateModalMsg("#input_emp_name","error","姓名由2-20位中文、英文字符组成");
        flagEmpName=false;
        return;
    }
});
//为modal input-email绑定失去焦点事件
$("#input_emp_email").blur(function () {
    var email=$("#input_emp_email").val();
    var regEmail=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if(regEmail.test(email)){
        validateModalMsg("#input_emp_email","success","");
        flagEmail=true;
    }else {
        validateModalMsg("#input_emp_email","error","邮箱格式不正确");
        flagEmail=false;
        return;
    }
    $.ajax({
        url:ContextPath+"/checkEmail",
        data:"email="+$("#input_emp_email").val(),
        type:"post",
        success:function (result) {
                if(result.code=="200"){
                    validateModalMsg("#input_emp_email","success","");
                    flagEmail=true;
                    return;
                }else {
                    validateModalMsg("#input_emp_email","error","邮箱已存在");
                    flagEmail=false;
                    return;
                }
        }
    });
});
/*--------------新增modal数据校验-------------*/

//绑定提交按钮事件
$("#empInfo_submit").click(function () {
    //1、提交数据校验
    if(!(flagEmpName&&flagEmail)){
        validateModalMsg("#input_emp_name","error","姓名由2-20位中文、英文字符组成");
        validateModalMsg("#input_emp_email","error","邮箱格式不正确");
        return;
    }
    //2、提交保存
    $.ajax({
        url:ContextPath+"/emps",
        type:"post",
        data:$("#add_emp_form_modal").serialize(),
        success:function (result) {
            if(result.code=="200"){
                $("#alertModal_text").text("").text("添加成功！");
                $("#alertModal").modal();
                //1、隐藏模态框
                $('#emp_add_modal').modal('hide')
                //2、跳转到最后一页
                jumpPage(999999);
            }
            if(result.code=="404"){
                if(result.extend.errors.email!="undefined"){
                    validateModalMsg("#input_emp_email","error",result.extend.errors.email);
                }
                if(result.extend.errors.empName!="undefined"){
                    validateModalMsg("#input_emp_name","error",result.extend.errors.empName);
                }
            }
        }
    });
});

//绑定编辑按钮click事件
$(document).on("click",".update-btn",function () {
    //清空原表单状态
    $("#emp_update_modal form").find("*").removeClass("has-success has-error");
    $("#emp_update_modal form").find(".help-block").text("");
    //1、向服务器请求部门数据
    addDeptInfo("#input_emp_deptName_update");
    //2、获取员工数据
    $.ajax({
        url:ContextPath+"/emps/"+$(this).attr("update_id"),
        type:"get",
        success:function (result) {
            $("#input_emp_name_update").val(result.extend.EmpInfoById.empName);
            $("#input_emp_email_update").val(result.extend.EmpInfoById.email);
            $("#input_emp_gender_update").text(result.extend.EmpInfoById.gender);
            $("#update_emp_form_modal select").val([result.extend.EmpInfoById.dId]);
            $("#empInfo_submit_update").attr("update_id",result.extend.EmpInfoById.empId);
        }
    });
   //3、弹出更新modal
    $("#emp_update_modal").modal();
});


var flagEmpName_update=false,flagEmail_update=false;
$("#input_emp_name_update").blur(function () {
    var empName = $("#input_emp_name_update").val();
    var regEmpName = /^[\u4E00-\u9FA5A-Za-z]{2,20}$/;
    if (regEmpName.test(empName)) {
        validateModalMsg("#input_emp_name_update", "success", "");
        flagEmpName_update = true;
    } else {
        validateModalMsg("#input_emp_name_update", "error", "姓名由2-20位中文、英文字符组成");
        flagEmpName_update = false;
    }
});
$("#input_emp_email_update").blur(function () {
    var email=$("#input_emp_name_update").val();
    var regEmail=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if(regEmail.test(email)){
        validateModalMsg("#input_emp_email_update","success","");
        flagEmail_update=true;
    }else {
        validateModalMsg("#input_emp_email_update","error","邮箱格式不正确");
        flagEmail_update=false;
    }
    $.ajax({
        url:ContextPath+"/checkEmail",
        data:"email="+$("#input_emp_email_update").val(),
        type:"post",
        success:function (result) {
            if(result.code=="200"){
                validateModalMsg("#input_emp_email_update","success","");
                flagEmail_update=true;
                return;
            }else {
                validateModalMsg("#input_emp_email_update","error","邮箱已存在");
                flagEmail_update=false;
                return;
            }
        }
    });
});
//绑定更新按钮事件
$("#empInfo_submit_update").click(function () {
    //1、提交数据校验
    if(!flagEmail_update){
        validateModalMsg("#input_emp_email_update","error","邮箱已存在");
        return;
    }
    if(!flagEmpName_update){
        return;
    }
    //2、提交数据
    $.ajax({
        url:ContextPath+"/emps",
        data:$("#emp_update_modal form").serialize()+"&empId="+$("#empInfo_submit_update").attr("update_id"),
        type:"put",
        success:(function (result) {
            console.log(result);
            //3、关闭模态框
            $('#emp_update_modal').modal('hide')
            //4、显示提示信息
            $("#alertModal_text").text("").text("更新成功！");
            $("#alertModal").modal();
            //5、转到更新页
            jumpPage($("#empInfo_submit_update").attr("update_pageNum"));
        })
    });
});

//绑定删除按钮事件
$(document).on("click",".del-btn",function () {
   var empName=$(this).parents("tr").find("td:eq(2)").text();
   var empId=$(this).parents("tr").find("td:eq(1)").text();
   if(confirm("确认要删除员工"+empName+"吗？")){
       $.ajax({
           url:ContextPath+"/emps/"+empId,
           type:"delete",
           success:function (result) {
               $("#alertModal_text").text("").text("删除成功！");
               $("#alertModal").modal();
               jumpPage(currentPage);
           }
       });
   }
});
//完成全选全不选
$("#check_all").click(function () {
   $(".check_item").prop("checked",$(this).prop("checked"));
});
$(document).on("click",".check_item",function () {
    var flag=$(".check_item:checked").length==$(".check_item").length;
    $("#check_all").prop("checked",flag);
});
//绑定批量删除按钮
$("#emp_del").click(function () {
    var empNames="";
    var empId="";
    $.each($(".check_item:checked"),function () {
        empNames=empNames+$(this).parents("tr").find("td:eq(2)").text()+" ";
        empId=empId+$(this).parents("tr").find("td:eq(1)").text()+"-";
    });
    var del_empId=empId.substring(0,empId.length-1);
    if(confirm("确认要删除员工"+empNames+"吗？")){
        $.ajax({
            url:ContextPath+"/emps/"+del_empId,
            type:"delete",
            success:function (result) {
                $("#alertModal_text").text("").text("删除成功！");
                $("#alertModal").modal();
                jumpPage(currentPage);
            }
        });
    }
});