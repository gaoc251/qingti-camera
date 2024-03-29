/**
 * 获取当前页面中，选择器为 selector 的第一个node节点
 * @param {String} selector 符合微信小程序规范的选择器
 * @param {Object} context 调用环境，普通页面中为wx，自定义组件中为this；默认值为wx.
 * @return {Array} 返回一个数组，第一个元素为 node 节点
 */
import Taro from "@tarojs/taro";
import { Request } from "./request";
export const querySelector = function (selector) {
    return new Promise((resolve, reject) => {
      Taro.createSelectorQuery()
      .select(selector)
      .boundingClientRect((res) => {
        if (res) {
          resolve(res);
        } else {
          reject(`不存在选择器为 ${selector} 的节点`);
        }
      })
      .exec();
    })
};
