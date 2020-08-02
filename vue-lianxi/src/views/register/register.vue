<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuTab"
          :key="item.id"
          :class="{'current':item.current}"
          @click="toggleMenu(item)"
        >{{item.txt}}</li>
      </ul>
      <!-- 表单验证 -->
      <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm" class="login-form">
        <el-form-item prop="username" class="form-item">
          <label for="username">邮箱</label>
          <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="form-item">
          <label for="password">密码</label>
          <el-input
            id="password"
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="passwords" class="form-item" v-if="model=='register'">
          <label>重复密码</label>
          <el-input
            type="password"
            v-model="ruleForm.passwords"
            autocomplete="off"
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="form-item">
          <label>验证码</label>
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="codeButtonStatus.status"
              >{{ codeButtonStatus.text }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('loginForm')"
            class="login-btn block"
            :disabled="loginButtonStatus"
          >{{ model === "login"?"登录":"注册"}}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/register";
import { reactive, ref, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVcode
} from "@/utils/validate";
export default {
  name: "register",
  // setup(props,context){
  //   attrs:(...) = = this.$attrs
  //   emit:(...) = = this.$emit
  //   listeners:(...) = = this.$listeners
  //   parent:(...) = = this.$parent
  //   refs:(...) = = this.$refs
  //   root:(...) = = this
  // }
  setup(props, { refs, root }) {
    // 这里面放置data数据、生命周期、自定义的函数
    // context.attrs
    // context.slots
    // context.parent
    // context.root
    // context.emit
    // context.refs
    //   验证用户名
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else if (validateEmail(value)) {
        callback(new Error("用户名格式有误"));
      } else {
        callback();
      }
    };
    //   验证密码
    var validatePassword = (rule, value, callback) => {
      // 过滤后的数据
      ruleForm.password = stripscript(value);
      value = ruleForm.password;
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (validatePass(value)) {
        callback(new Error("密码为6-20位数字+字母"));
      } else {
        callback();
      }
    };
    // 验证重复密码
    var validatePasswords = (rule, value, callback) => {
      ruleForm.passwords = stripscript(value);
      value = ruleForm.passwords;
      if (value === "") {
        callback(new Error("请输入重复密码"));
      } else if (value != ruleForm.password) {
        callback(new Error("重复密码不正确"));
      } else {
        callback();
      }
    };
    // 校验验证码
    var checkCode = (rule, value, callback) => {
      if (value === "") {
        return callback(new Error("请输入验证码"));
      } else if (validateVcode(value)) {
        return callback(new Error("验证码格式有误"));
      } else {
        callback();
      }
    };
    const menuTab = reactive([
      { txt: "登录", current: true, type: "login" },
      { txt: "注册", current: false, type: "register" }
    ]);
    // 模块值
    const model = ref("login");
    // 登录按钮禁用状态
    const loginButtonStatus = ref(true);
    // 验证码按钮状态
    // const codeButtonStatus = ref(false);
    // const codeButtonText =  ref("获取验证码");
    const codeButtonStatus = reactive({
      status: false,
      text: "获取验证码"
    });
    // 倒计时
    const timer = ref(null);

    const ruleForm = reactive({
      username: "",
      password: "",
      passwords: "",
      code: ""
    });
    // 表单的验证
    const rules = reactive({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      passwords: [{ validator: validatePasswords, trigger: "blur" }],
      code: [{ validator: checkCode, trigger: "blur" }]
    });
    // 1.不建议在一个方法里面做多件不同的事情（尽可能只做自己本身的事，不要做其他人的事情）
    // 2.尽量把相同的事情封装在一个方法里面，通过调用函数执行

    // 声明函数
    // 切换模块
    const toggleMenu = data => {
      menuTab.forEach(elem => {
        elem.current = false;
      });
      // 高光
      data.current = true;
      // 修改模块值
      model.value = data.type;
      resetFormData();
      clearInterval();
    };
    // 清除表单数据
    const resetFormData = (() => {
       // 重置表单
      // this.$refs[formName].resetFields(); 2.0写法
      refs.loginForm.resetFields();
    })
    // 获取验证码
    const getSms = () => {
      //  进行提示
      if (ruleForm.username == "") {
        root.$message.error("邮箱不能为空！！");
        return false;
      }
      if (validateEmail(ruleForm.username)) {
        root.$message.error("邮箱格式错误，请重新输入！！");
        return false;
      }
      // 更新按钮的状态
      const updataButtonStatus = ((params) =>{
         codeButtonStatus.status = params.status;
         codeButtonStatus.text = params.text;
      })
      // 获取验证码
      let requestData = {
        username: ruleForm.username,
        module: model.value
      };
      // 修改获取验证码按钮状态
      updataButtonStatus({
          status: true,
           text: "发送中"
        })
      // codeButtonStatus.value = true;
      // codeButtonText.value= "发送中";

      setTimeout(() => {
        // 延时多长时间
        GetSms(requestData)
          .then(response => {
            let data = response.data;
            console.log(data);
            root.$message({
              message: data.message,
              type: "success"
            });

            // 启用登录或注册按钮
            loginButtonStatus.value = false;
            // 调用定时器，倒计时
            countDown(60);
          })
          .catch(error => {
            console.log(error);
          });
      }, 3000);
    };
    // 提交表单
    const submitForm = formName => {
      // axios.request({
      //     method: "get",
      //     url: "/user/12345",
      //     data: {
      //       firstName: "Fred",
      //       lastName: "Flintstone"
      //     }
      //   })
      //   .then(function(response) {
      //     console.log(response);
      //   })
      //   .catch(function(error) {
      //     console.log(error);
      //   });

      refs[formName].validate(valid => {
        // 表单验证通过
        if (valid) {
          // 三元运算
          model.value === "login"? login():register();
          // if(model.value === "login"){
          //   login()
          // }else{
          //   register()
          // }
        }else{
          console.log("error submit!!");
          return false;
        }
      });
    };
    // 登录
    const login = (() => {
      let requestData = {
         username: ruleForm.username,
         password: sha1(ruleForm.password),
         code: ruleForm.code,
      }
      Login(requestData).then(response => {
        console.log(response);
        console.log("登陆成功");
        // 页面跳转
        root.$router.push({
          name:"console"
          })
      }).catch(error => {
      })
    })
    // 注册
    const register = (() => {
      let requestData = {
            username: ruleForm.username,
            password: sha1(ruleForm.password),
            code: ruleForm.code,
            module: "register"
          };
          //  注册接口
          Register(requestData)
            .then(response => {
              let data = response.data;
              root.$message({
                message: data.message,
                type: "success"
              });
              // 模拟注册成功
              toggleMenu(menuTab[0]);
              clearCountDown();
            }).catch(error => {
              // 失败时执行的代码
            });
        })

    // 倒计时
    const countDown = number => {
      // 60和0不见了，有BUG
      // setTimeout   clearTimeout(变量)  只执行一次
      // setInterval  clearInterval(变量) 不断地执行，需要条件才会停止
      // 判断定时器是否存在，存在则清除
      if (timer.value) {
        clearInterval(timer.value);
      }
      let time = number;
      timer.value = setInterval(() => {
        time--;
        if (time === 0) {
          clearInterval(timer.value);
          updataButtonStatus({
           status: false,
            text: "再次获取"
        })
        } else {
          codeButtonStatus.text = `倒计时${time}秒`;
          // ES5:codeButtonStatus.text = '倒计时' + time + '秒'
        }
      }, 1000);
    };
    // 清除倒计时
    const clearCountDown = () => {
      // 还原验证码默认状态
      updataButtonStatus({
          status: false,
           text : "获取验证码"
        })
      // 清除倒计时
      clearInterval(timer.value);
      // const codeButtonStatus = reactive({
      //     status:false,
      //     text:"获取验证码"
      // })
    };

    // 生命周期,挂载完成后
    onMounted(() => {
      // console.log(process.env.VUE_APP_ABC)
    });
    return {
      menuTab,
      model,
      loginButtonStatus,
      codeButtonStatus,
      toggleMenu,
      submitForm,
      ruleForm,
      rules,
      getSms
    };
  },
  props: {},
  watch: {}
};
</script>
<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #344a5f;
}
.login-wrap {
  width: 330px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  li {
    display: inline-block;
    width: 88px;
    line-height: 36px;
    font-size: 14px;
    color: #fff;
    border-radius: 2px;
    cursor: pointer;
  }
  .current {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
.login-form {
  margin-top: 29px;
  label {
    display: block;
    font-size: 14px;
    color: #fff;
    margin-bottom: 3px;
  }
}
.form-item {
  margin-bottom: 13px;
}
.block {
  width: 100%;
}
.login-btn {
  margin-top: 19px;
}
</style>

// 密码加密：
// 1.在前端预先加密一次
// 例：登陆密码：123456(普通字符串)
// 经过加密后：sha1("123456")--"63667287hjdsxcakjd134"(加密后的字符串)

// 2.后台加密
// 接收到字符串"63667287hjdsxcakjd134"
// 后台再次加密：md5("63667287hjdsxcakjd134")--"74suwbcdw36dyqxjfgt"（最终加密后的密码）
// 最终将新的加密字符串写入数据库：74suwbcdw36dyqxjfgt

// 3.登陆
// 用户名与加密后的密码进行匹配，成功则登录，失败则提示
