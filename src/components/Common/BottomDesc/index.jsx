import React, {useEffect, useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'


export default function BottomDesc(props) {

  const {tip} = props
  
  return (
    <View className='bottom-desc'>
        <Image className='bottom-desc-logo' src={`${staticCdn}/public/home/Subtract.png`} />
        <View className='bottom-desc-title'>青提相机</View>
        {tip && <View className='bottom-desc-tip'>优秀分享看完啦，快亲自试一试吧!</View>}
    </View>
  )
}

