import React, {useState} from 'react'
import { View, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import { useShareAppMessage, useShareTimeline } from '@tarojs/taro'
import BottomDesc from '../../components/Common/BottomDesc'
import UploaderPopup from '../../components/Common/UploaderPopup'

function SaveSuccess() {
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleTip, setIsVisiblTip] = useState(false); // 分享朋友圈提示

  const res = {
    imgUrl: '../../public/saveSuccess/result.png',

  }

  const {imgUrl} = res

  // TODO: 推过链接是什么
  useShareAppMessage(()=>{
    return {
      title: '我用AI智能生成了一张宝宝的头像，你也快来玩吧！',
      imageUrl: '/public/home/share_img.png',
      path: `/pages/index/index`,
    };
  })

  useShareTimeline (()=>{
    return {
      title: '我用AI智能生成了一张宝宝的头像，你也快来玩吧！',
      imageUrl: '/public/home/share_img.png',
      path: `/pages/index/index`,
    };
  })

  const jumpToHome = () => {
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }

  const handleChangeBtn = (flag) => {
    setIsVisible(flag)
  }

  // 分享盆友圈
  const openPenyouquan = (flag) => {
    setIsVisiblTip(flag)
  }
  
  return (
    <View className="save-success">
      <View className='save-success-top'>
        <View className='save-success-img'>
          <Image src={imgUrl} className='save-success-img-res'/>
          <Image src='../../public/saveSuccess/album.png' className='save-success-img-album' />
        </View>
        <View className='save-success-tip'>已保存到手机相册</View>
        <View className='save-success-btns'>
          <View className='save-success-btns-item' onClick={jumpToHome}>返回首页</View>  
          <View className='save-success-btns-item' onClick={()=>{handleChangeBtn(true)}}>更换照片</View>
        </View>
      </View>

      <View className='save-success-share'>
        <View className='save-success-share-title'>
          <Image src='../../public/saveSuccess/share.png' className='save-success-share-icon'/>
          分享到
        </View>
        <View className='save-success-share-btns'>
          <Button className='save-success-share-btns-item' openType='share'>
            <View className='save-success-share-btns-item-img'>
              <Image src='../../public/saveSuccess/weixin.png' className='save-success-share-btns-item-img-icon' />
            </View>
            <View className=''>微信好友</View>
          </Button>
          <View className='save-success-share-btns-item' onClick={()=>{openPenyouquan(true)}}>
            <View className='save-success-share-btns-item-img'>
              <Image src='../../public/saveSuccess/weixin_circle.png' className='save-success-share-btns-item-img-icon' />
            </View>
            <View className=''>朋友圈</View>
          </View>
        </View>
      </View>

      <View className='save-success-bottom'>
        <BottomDesc />  
      </View>

      <UploaderPopup isVisible={isVisible} onClose={()=>{handleChangeBtn(false)}} />

      {isVisibleTip && <Image className='save-success-sharetip' src='../../public/saveSuccess/tip.png' onClick={()=>{openPenyouquan(false)}} />}
    </View>
  )
}

export default SaveSuccess
