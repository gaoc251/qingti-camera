import React, { useEffect } from 'react'
import { useDidShow, useDidHide, useLaunch } from '@tarojs/taro'
import Taro from '@tarojs/taro'
import { Request } from './utils/request'
// import { api} from './utils/api.ts'
import { getOpenId } from './utils/api'

// 全局样式
import './app.scss'

function App(props) {
  useLaunch (()=>{
    console.log('onLaunch')
    let openId = Taro.getStorageSync('openId')
    !openId && getOpenIdData ()

  //   wx.cloud.init({
  //     // env: "其他云开发环境，也可以不填"    // 此处init的环境ID和微信云托管没有作用关系，没用就留空
  //   });

  })

  const getOpenIdData = () => {
    Taro.login({
      success: loginres => {
        if (loginres.code) {
          Request('get', getOpenId, {'js_code': loginres.code}).then((res) => {
            let openId = res.data.openid
            Taro.setStorage({
                key: "openId",
                data: openId
            })
          })
        }
      }
    })
  }

  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onShow
  useDidShow(() => {
    console.log('onshow')
  })

  // 对应 onHide
  useDidHide(() => {})

  return props.children
}

export default App
