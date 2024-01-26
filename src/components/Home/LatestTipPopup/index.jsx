import React, {useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Popup } from '@nutui/nutui-react-taro'
import './index.scss'


export default function LatestTipPopup(props) {
  const {isVisible, onclose, taskid, checkStatuse} = props

  const jumpAction = () => {
    Taro.navigateTo({
      url: '/pages/result/index?id='+taskid
    })
  }
  return (
    <Popup visible={isVisible || false} onClose={()=>{onclose?.()}} closeable round className='latest-tip-popup'>
      <View className='latest-tip-popup-tip'>当前有任务正在进行先去看看吧~</View>
      <Image className='latest-tip-popup-img' 
        // src='../../public/home/latestTip_new.png' 
        src={checkStatuse?'../../public/home/latestTip.png':'../../public/home/latestTip_new.png'}
      />
      <View className='latest-tip-popup-btn' onClick={jumpAction}>立即查看</View>
    </Popup>
  )
}

