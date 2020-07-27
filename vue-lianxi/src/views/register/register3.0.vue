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
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="login-form">
        <el-form-item prop="username" class="form-item">
          <label>邮箱</label>
          <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="form-item">
          <label>密码</label>
          <el-input
            type="text"
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
              <el-input v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input>
            </el-col>
            <el-col :span="9">
              <el-button type="success" class="block">获取验证码</el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {login} from './data/data'
import { reactive, ref, onMounted } from "@vue/composition-api";
import {
  stripscript,
  validateEmail,
  validatePass,
  validateVcode
} from "@/utils/validate";
import { format } from 'path';
export default {
  name: "register",
  setup(props, { refs }) {
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
    console.log(login)
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
    // 声明函数
    const toggleMenu = data => {
      menuTab.forEach(elem => {
        elem.current = false;
      });
      model.value = data.type;
      data.current = true;
    };
    const submitForm = formName => {
        refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    onMounted(() => {});
    return {
      menuTab,
      model,
      toggleMenu,
      submitForm,
      ruleForm,
      rules
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
