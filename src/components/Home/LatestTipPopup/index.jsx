import React, {useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Popup } from '@nutui/nutui-react-taro'
import { modCheckStatus } from '../../../utils/api'
import { Request } from '../../../utils/request'
import './index.scss'


export default function LatestTipPopup(props) {
  const {isVisible, onclose, taskid, checkStatus, openId} = props

  const jumpAction = () => {
    changeStatus()
    Taro.navigateTo({
      url: '/pages/result/index?id='+taskid
    })
  }

  // 更改状态
  const  changeStatus = () => {
    Request('get', modCheckStatus, {openid: openId}).then(res => {
      if (res.infoCode !== 10000) {
        Taro.showToast({
          title: res.info,
          icon: 'none'
        })
      }
    })
  }

  return (
    <Popup visible={isVisible || false} onClose={()=>{onclose?.()}} closeable round className='latest-tip-popup'>
      <View className='latest-tip-popup-tip'>当前有任务正在进行先去看看吧~</View>
      <Image className='latest-tip-popup-img' 
        src={checkStatus?`${staticCdn}/public/home/latestTip.png`:`${staticCdn}/public/home/latestTip_new.png`}
      />
      <View className='latest-tip-popup-btn' onClick={jumpAction}>立即查看</View>
    </Popup>
  )
}

