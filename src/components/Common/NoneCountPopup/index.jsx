import React, {useEffect, useState} from 'react'
import { View, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Popup } from '@nutui/nutui-react-taro'
import './index.scss'


export default function NoneCountPopup(props) {
  const {isVisible, onclose} = props

  // const jumpAction = () => {
  //   Taro.navigateTo({
  //     url: '/pages/result/index'
  //   })
  // }
  const openVideo = () => {
    Taro.showToast({
      title: '查看视频', icon: 'none'
    })
  }
  
  return (
    <View>
      <Popup visible={isVisible} onClose={()=>{onclose?.()}} round className='none-count-popup' 
      >
      <Image className='none-count-popup-img' src='../../public/saveSuccess/popup_none.png'/>
      <View className='none-count-popup-tip'>次数用完啦</View>
      <View className='none-count-popup-title'>获得免费生成次数</View>
      <View className='none-count-popup-btns'>
        <Button className='none-count-popup-btns-item' openType='share'>
          <Image className='none-count-popup-btns-item-img' src='../../public/saveSuccess/popup_1.png' />
          <View className='none-count-popup-btns-item-text'>分享给好友</View>
        </Button>
        <Button className='none-count-popup-btns-item' openType='share'>
          <Image className='none-count-popup-btns-item-img' src='../../public/saveSuccess/popup_2.png' />
          <View className='none-count-popup-btns-item-text'>分享到群聊</View>
        </Button>
        <Button className='none-count-popup-btns-item' onClick={openVideo}>
          <Image className='none-count-popup-btns-item-img' src='../../public/saveSuccess/popup_3.png'/>
          <View className='none-count-popup-btns-item-text'>看视频广告</View>
        </Button>
      </View>
    </Popup>
    </View>
  )
}

