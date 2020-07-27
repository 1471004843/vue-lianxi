
import axios from "axios";
/**
 * 登录用户
 * @param {String} username 用户名
 * @param {String} password 密码
 * @returns {Object} 成功resolve,失败reject错误信息
 */
export async function login(username, password) {
  const $data = await axios({
    url: api.API_LOGIN,
    params: {
      UserID: username,
      PassWord: password,
    },
  });
  const $node = $data.find("Node");
  const res = $node.attr("title");
  if (res != "ok") {
    throw res;
  }
  return {
    result: $node.attr("title"),
    name: $node.attr("UserName"),
    department: $node.attr("AgencyName"),
    id: $node.attr("UserID"),
  };
}

