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
  })

  const getOpenIdData = () => {
    Taro.login({
      success: loginres => {
        if (loginres.code) {
          Request('get', getOpenId, {'js_code': loginres.code}).then((res) => {
            let openId = res.openid
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
