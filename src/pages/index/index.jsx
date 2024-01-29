import React, {useEffect, useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import './index.scss'
import { useShareAppMessage } from '@tarojs/taro'
import { Request } from '../../utils/request'
import { getNewUser, getImg, getUselimite } from '../../utils/api'

import NavBar from '../../components/Common/NavBar'
import Tab from '../../components/Home/Tab'
import UploaderPopup from '../../components/Common/UploaderPopup'
import LatestTipPopup from '../../components/Home/LatestTipPopup'
import NoneCountPopup from '../../components/Common/NoneCountPopup'

import { getSystemInfo } from '../../components/Common/NavBar'

// const staticCdn = 'https://carton-public.oss-cn-beijing.aliyuncs.com'

function Index() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLatestVisible, setIsLatestVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0) // 当前选择的风格
  const [residueTimes, setResidueTimes] = useState(0) // 剩余次数
  const [isResidueTimesVisible, setIsResidueTimesVisible] = useState(false) // 剩余次数弹框
  const [openId, setOpenId] = useState(''); // openid
  const [isNewUser, setIsNewUser] = useState(true); // 首次登陆判断 
  const [checkStatuse, setCheckStatuse] = useState(false) // 用户是否查看过新生成的作品
  const [taskid, setTaskid] = useState(0) // 记录作品任务ID
  const [navBarHeight, setNavBarHeight] = useState(60); // 自定义导航高度

  useEffect(() => {
    let _openId = Taro.getStorageSync('openId')
    setOpenId(_openId)
  }, [])
 
  useEffect(()=>{
    openId && fetchNewUser()
    openId && fetchImg()
    openId && fetchResidueTimes()
  },[openId])

  useDidShow(()=>{
    taskid && fetchImg()
  })

  // 首次登陆接口 
  const fetchNewUser = () => {
    Request('get', getNewUser, {openid:openId}).then(res=>{
      setIsNewUser(res.data.newUser)
    })
  }

  // 获取当前用户是否有未查看的任务
  const fetchImg = () => {
    Request('get', getImg, {openid:openId}).then(res=>{
      setCheckStatuse(res.data.checkStatuse)
      setTaskid(res.data.taskid)
    })
  }

  // 获取 剩余次数
  const fetchResidueTimes = () => {
    Request('get', getUselimite, {openid:openId}).then(res=>{
      setResidueTimes(res.data.limite)
    })
  }

  useShareAppMessage(()=>{
    return {
      title: '我用AI智能生成了一张宝宝的头像，你也快来玩吧！',
      imageUrl: `${staticCdn}/public/home/share_img.png`,
      path: `/pages/index/index`,
    };
  })

  const handleExperienceBtn = (flag) => {
    if (residueTimes) {
      setIsResidueTimesVisible(true)
    } else {
      setIsVisible(flag)
    }
  }

  const handleLatestTipBtn = (flag) => {
    setIsLatestVisible(flag)
  }

  // tab 切换，记录index
  const changeThemeIndex = (index) => {
    setCurrentIndex(index)
  }

  // 关闭剩余次数
  const handleNoneCountBtn = (flag) => {
    setIsResidueTimesVisible(flag)
  }


  useEffect(() => {
    let systemInfo = getSystemInfo()
    setNavBarHeight(systemInfo.navBarHeight+systemInfo.navBarExtendHeight)
  }, [])

  // // 自定义导航栏的高度：
  // useEffect(() => {
  //   let menuButtonObject = Taro.getMenuButtonBoundingClientRect();
  //   Taro.getSystemInfo({
  //     success: (res) => {
  //       //导航高度
  //       // let statusBarHeight = res.statusBarHeight,
  //       //   navHeight =
  //       //     statusBarHeight +
  //       //     menuButtonObject.height +
  //       //     (menuButtonObject.top - statusBarHeight) * 2,
  //       //   munuButtonTotalHeight =
  //       //     menuButtonObject.height +
  //       //     (menuButtonObject.top - statusBarHeight) * 2;
  //       debugger
  //       // setNavHeight(navHeight);
  //       // setStatusBarHeight(statusBarHeight);
  //       // setMunuButtonTotalHeight(munuButtonTotalHeight);

  //       console.log("111", menuButtonObject.bottom + (menuButtonObject.top - res.statusBarHeight))
  //     },
  //     fail(err) {
  //       console.log(err);
  //     },
  //   });
  // });

  return (
    <View className="index">
      <NavBar
        title=''
        background='#fff'
        renderCenter={
          <View className='index-nav-bar'>
            <Image className='index-nav-bar-icon' src={`${staticCdn}/public/home/home_icon.png`}/>
            <View className='index-nav-bar-title'>青提相机</View>
          </View>
        }
      />
      <View className='index-top'>
        <View className='index-top-content'>
          <View >
            <View className='index-top-title'>上传一张照片</View>
            <View className='index-top-title'>用AI生成全新专属风格！</View>
            <Text className='index-top-tip'>由AI生成，内容仅供娱乐参考</Text>
          </View>
          { !isNewUser && !checkStatuse && <Image className='index-top-latest' 
            src={checkStatuse?`${staticCdn}/public/home/latestTip.png`: `${staticCdn}/public/home/latestTip_new.png`}
            onClick={()=>{setIsLatestVisible(true)}}/>}
        </View>
        <Image className='index-top-none' src={`${staticCdn}/public/home/bg.png`} style={{top: navBarHeight + 'px'}}/>
      </View>

      <Tab onChange={changeThemeIndex} navBarHeight={navBarHeight} />

      <View className='index-experience'>
        <View className='index-experience-btn' onClick={()=>{handleExperienceBtn(true)}}>
          <View className='index-experience-btn-text'>
            立即体验
            <Image className='index-experience-btn-text-icon' src={`${staticCdn}/public/home/star.png`} />
          </View>
          <View className='index-experience-btn-tip'>14876人正在生成</View>
        </View>
      </View>

      <View className='index-bottom'></View>

      <View className='index-desc'>
        <Image className='index-desc-logo' src={`${staticCdn}/public/home/Subtract.png`}/>
        <View className='index-desc-title'>青提相机</View>
        <View className='index-desc-tip'>优秀分享看完啦，快亲自试一试吧!</View>
      </View>
      
      <UploaderPopup isVisible={isVisible} onclose={()=>{handleExperienceBtn(false)}} currentIndex={currentIndex} />
      <LatestTipPopup isVisible={isLatestVisible} taskid={taskid} checkStatuse={checkStatuse} onclose={()=>{handleLatestTipBtn(false)}}/>

      {isResidueTimesVisible &&<NoneCountPopup isVisible={isResidueTimesVisible} onclose={()=>{
        handleNoneCountBtn(false)
      }} />}

    </View>
  )
}

export default Index
