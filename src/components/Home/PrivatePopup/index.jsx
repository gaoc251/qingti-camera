import React, {useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Popup } from '@nutui/nutui-react-taro'
import './index.scss'


export default function PrivatePopup(props) {
  const {isVisible, onclose, openId} = props

  // 拒绝
  const rejectAction = () => {
    Taro.setStorageSync('newUser-private',0)
    onclose()
  }

  // 同意
  const confirmAction = () => {
    Taro.setStorageSync('newUser-private',1)
    onclose()
  }

  const jumpAction = () => {
    let url = 'http://www.baidu.com'
    Taro.navigateTo({
      url: `/pages/webview/index?src=${encodeURIComponent(url)}`
    })
  }

  return (
    <Popup visible={isVisible || false} onClose={()=>{onclose?.()}} closeOnOverlayClick={false} round className='private-popup' position="bottom">
      <View className='private-popup-title'>用户隐私保护提示</View>
      <View className='private-popup-content'>
        <View>在你使用 “AI头像生成器” 服务之前，请仔细阅读</View>
        <View className='private-popup-content-link' onClick={jumpAction}>《AI头像生成器小程序隐私保护指引》</View>
        <View>如你同意该指引，请点击 “同意” 开始使用本小程序。</View>
      </View>
      <View className='private-popup-btns'>
        <View className='private-popup-btns-item' onClick={rejectAction}>拒绝</View>
        <View className='private-popup-btns-item agreement' onClick={confirmAction}>同意</View>
      </View>
    </Popup>
  )
}

