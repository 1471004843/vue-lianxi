import Vue from "vue";
import SvgIcon from "./SvgIcon.vue";
// 自定义全局组件
Vue.component("svg-icon",SvgIcon)
// require.context,读取指定目录的所有文件
// 第一参数，指定目录
// 第二个参数，是否遍历子级目录
// 第三个参数，定义遍历文件规则
const req = require.context("./svg", false, /\.svg$/)
const requireAll = requireContext => {
    return requireContext.keys().map(requireContext)
}
requireAll(req)