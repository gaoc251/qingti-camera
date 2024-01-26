import React, {useEffect, useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Popup, Video, Progress } from '@nutui/nutui-react-taro'
import useInterval from './interval'
import './index.scss'


export default function AdProcessPopup(props) {
  const {isVisible, onClose, source} = props

  const [seconds, setSeconds] = useState(0);
  const [percent, setPercent] = useState(30)

  const options = {
    controls: false,
    autoplay: true,
    disabled: true,
    muted: true,
    playsinline: true,
    loop: true,
  }

  const play = (elm) => console.log('play', elm)
  const pause = (elm) => console.log('pause', elm)
  const playend = (elm) => console.log('playend', elm)

  useEffect(()=>{
    setSeconds(40)
  },[])

  useInterval(
    () => {
      if (seconds < 1) {
        setSeconds(0);
        return;
      } else if (seconds > 10) {
        setPercent((s)=>s+2)
      }

      setSeconds((s) => s - 1);
      
    },
    1000
  );

  const onCloseAd = () => {
    if (seconds > 0) {
      return false
    } else {
      onClose?.()
    }
  }

  return (
    <Popup visible={isVisible || false} onClose={()=>{onClose?.()}}  round className='ad-process-popup'>
      <Video
        source={source}
        options={options}
        onPlay={play}
        onPause={pause}
        onPlayEnd={playend}
        className='ad-process-popup-video'
      />
      <View className='ad-process-popup-countDown' onClick={onCloseAd}>
        {seconds == 0? '关闭': `${seconds} s`}
      </View>
      <Progress
        percent={percent}
        color="linear-gradient(95deg, #92FFD1 0%, #9EFF96 100%)"
        animated
        className='ad-process-popup-process'
      />
      <View className='ad-process-popup-tip'>{percent}% 正在全力加速生成中... 更多风格等你探索</View>
    </Popup>
  )
}

