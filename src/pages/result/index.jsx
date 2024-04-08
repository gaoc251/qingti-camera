import React, {useCallback, useEffect, useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames';
import './index.scss'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { Request } from '../../utils/request';
import { getImg, img2img, getUselimit, getTaskStatus, modCheckStatus } from '../../utils/api';

import { Loading } from '@nutui/nutui-react-taro';
import UploaderPopup from '../../components/Common/UploaderPopup';
import AdProcessPopup from '../../components/Result/AdProcessPopup';
import NoneCountPopup from '../../components/Common/NoneCountPopup';
import { getCurrentInstance } from '@tarojs/runtime';

let timer = null

function Result() {
  const [saveDisable, setSaveDisable] = useState(false); // 默认可点击
  const [isVisible, setIsVisible] = useState(false);
  const [isVisiblAdProcess, setIsVisibleAdProcess] = useState(true);
  const [source, setSource] = useState({
    src: 'https://carton-public.oss-cn-beijing.aliyuncs.com/portal/video.mp4',
    type: 'video/mp4',
  })

  const [imgInfo, setImgInfo] = useState({})
  const [currentIndex, setCurrentIndex] = useState([0]) // 切换生成图片索引

  const [openId, setOpenId] = useState('')
  const [isResidueTimesVisible, setIsResidueTimesVisible] = useState(false) // 剩余次数弹框
  const [residueTimes, setResidueTimes] = useState(0) // 剩余次数
  const [isReuse, setIsReuse] = useState(false); // 是否是重新绘制
  const [isFailed, setIsFailed] = useState(false); // 是否生成失败
  // const [taskId, setTaskId] = useState(getCurrentInstance().router.params.id )// 任务ID
  let taskId = getCurrentInstance().router.params.id
  

  let openLunxun = true; // 默认开启轮训操作 

  const fetchTaskStatus = useCallback( async(userId, taskId)=>{
    console.log("lunxun")
    await Request('get', getTaskStatus, {openid: userId, taskid: taskId}).then(res => {
      let _status = res.data.status
      if (_status == 'running') {
        // 生成中
      } else if (_status == 'failed') {
        // 生成失败
        clearInterval(timer)
        Taro.showToast({
          url: '生成失败',
          icon: 'none'
        })
      } else if (_status == 'success') {
        // 生成成功
        getImgData(userId, taskId)
        clearInterval(timer)
      }
    })
  }, [])
 
  useEffect(() => {
    let _openId = Taro.getStorageSync('openId')
    setOpenId(_openId)
  }, [])

  useEffect(() => {
    if (openLunxun && openId) {
      timer = setInterval(()=>{
        fetchTaskStatus(openId, taskId)
      }, 5000)
    }
  }, [openId])

  // useShareAppMessage(()=>{
  //   return {
  //     title: '我用AI智能生成了一张宝宝的头像，你也快来玩吧！',
  //     imageUrl: '/public/home/share_img.png',
  //     path: `/pages/index/index`,
  //   };
  // })
 
  // 保存图片
  const saveImg = () => {
    if (saveDisable) {
      Taro.showToast({
        title: isFailed?'生图失败，请重试':'正在生成中...请稍后',
        icon: 'none'
      })
    } else {
      // 解决办法：1、完善一下用户隐私协议 2、配置downloadFile的合法域名
      Taro.downloadFile({
        url: imgInfo.pics[currentIndex],
        success: res => {
          if (res.statusCode === 200) {
            console.log(res)
            const tempFilePath = res.tempFilePath;  // 获取下载的临时文件路径
            saveImageToPhotosAlbum(tempFilePath, currentIndex)
          } else {
            console.log('下载图片失败');
            // 图片下载失败的处理逻辑
          }
        },
        fail: (error) => {
          console.log('下载图片失败', error);
          // 图片下载失败的处理逻辑
        }
      });

    }
  }

  const saveImageToPhotosAlbum = (tempFilePath, currentIndex) => {
    // 保存图片到相册
    Taro.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        console.log('保存图片成功');
        // 图片保存成功的处理逻辑
        Taro.navigateTo({
          url: '/pages/saveSuccess/index?imgType='+imgInfo.type+'&imgUrl='+encodeURIComponent(imgInfo.pics[currentIndex])
        })
      },
      fail: (error) => {
        console.log('保存图片失败', error);
        // 图片保存失败的处理逻辑
      }
    });
  }

  const jumpToHome = () => {
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }

  const handleAgainBtn = (flag) => {
    if (saveDisable) {
      Taro.showToast({
        title: '正在生成中...请稍后',
        icon: 'none'
      })
    } else {
      setIsVisible(flag)
    }
    
  }

  const closeAdProcess = (flag) => {
    setIsVisibleAdProcess(flag)
  }

  useEffect(()=>{
    openId && getImgData(openId, taskId)
    openId && fetchResidueTimes()
  }, [openId])

  // 获取 剩余次数
  const fetchResidueTimes = () => {
    Request('get', getUselimit, {openid:openId}).then(res=>{
      setResidueTimes(res.data.limit)
    })
  }

  const getImgData = (userId, taskId) => {
    Request('get', getImg, { openid: userId, taskid: taskId }).then(res => {
      const { infoCode, data } = res

      setImgInfo({
        avatar: data.typeUrl,
        themeName: data.typeName,
        type: data.imgType || 1,
        pics: data.pics,
      })

      if (infoCode == '10000') {
        setSaveDisable(false)
        setIsVisibleAdProcess(false)
        openLunxun = false
        clearInterval(timer)
        // 更新图片状态
        changeStatus()
      } else if (infoCode == 10001) {
        setSaveDisable(true)
      } else if (infoCode == 30000) {
        openLunxun=false
        clearInterval(timer)
        setIsVisibleAdProcess(false)
        setSaveDisable(true)
        setIsFailed(true)
        Taro.showToast({
          title: '生成失败，稍后再试',
          icon: 'none'
        })
      }
    })
    // Taro.hideLoading()
  }

  const clickResBtn = (index) => {
    setCurrentIndex(index)
  }

  // 重新绘制
  const againDraw = () => {
    if (saveDisable && !isFailed) {
      Taro.showToast({
        title: '正在生成中...请稍后',
        icon: 'none'
      })
      return false
    } else if (residueTimes) {
      setIsResidueTimesVisible(true)
      return false
    } else {
      let _imgInfo = imgInfo
      _imgInfo.pics = []
      setImgInfo(_imgInfo)
      openLunxun = true
      setIsReuse(true)
      setIsVisibleAdProcess(true)
      setSaveDisable(true)

      // 重新绘制调用图生图接口
      Request('post', img2img, {openid: openId, reuse: true, imgType: imgInfo.type}).then(res => {
        taskId = res.data.taskid        
        timer = setInterval(()=>{
          fetchTaskStatus(openId, res.data.taskid)
        }, 5000)
      })
    }
  }

   // 关闭剩余次数
   const handleNoneCountBtn = (flag) => {
    setIsResidueTimesVisible(flag)
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
    <View className="result">
      <View className='result-top'>
        <View className='result-top-left'>
          <Image className='result-top-avatar' src={imgInfo.avatar} />
          <View className='result-top-info'>
            <View className='result-top-info-text'>{imgInfo.themeName}</View>
            <View className='result-top-info-change' onClick={jumpToHome}>
              <Image src={`${staticCdn}/public/result/exchange.png`} className='result-top-info-change-icon' />
              <View className='result-top-info-change-text'>点击更换风格</View>
            </View>
          </View>
        </View>
        <View className='result-top-again' onClick={()=>{handleAgainBtn(true)}}>
          <View className='result-top-again-text'>重新上传照片</View>
          <Image src={`${staticCdn}/public/result/jump.png`} className='result-top-again-icon' />
        </View>
      </View>

      <View className='result-img'>
        {!imgInfo.pics || imgInfo.pics.length == 0 && <Image className='result-img-bg' src={`${staticCdn}/public/result/bg.png`} />}
        { imgInfo.pics && imgInfo.pics.length > 0 && <Image className='result-img-bg' src={imgInfo.pics[currentIndex]} />}
        <Image className='result-img-icon' src={`${staticCdn}/public/result/home_icon.png`} />
        <View className='result-img-text'>青提相机</View>
        <View className='result-img-tip'>青提相机</View>
        <Loading direction="vertical" icon={<Image className='result-img-loading' src={`${staticCdn}/public/result/loading.png`} />}/>
      </View>
      
      <View className='result-btns'>
        {imgInfo.pics && imgInfo.pics.length > 0 && imgInfo.pics.map((item, index) => {
          return <View className={classNames('result-btns-item-border', {'active': index == currentIndex})} onClick={()=>clickResBtn(index)} key={index}>
            <View className='result-btns-item' >
            {item && <Image src={item} className='result-btns-item-img'/>}
            {!item && <Loading direction="vertical" icon={<Image className='result-btns-item-loading' src={`${staticCdn}/public/result/loading.png`} />}/>}
          </View>
          </View>
        })}

        <View 
          className={classNames('result-btns-item again', {'nodisable': !saveDisable || isFailed})}
          onClick={againDraw}
        >
          <Image className='result-btns-item-again' src={`${staticCdn}/public/result/again.png`} />
          <View className='result-btns-item-text'>重新绘制</View>
        </View>
      </View>

     
      <View className={classNames('result-save', {'active': !saveDisable})} onClick={saveImg}>
        <Image className='result-save-icon' src={`${staticCdn}/public/result/save.png`}/>
        <View className='result-save-text'>保存当前图片</View>
      </View>
      <View className='result-tip'>可用作微信头像、发表朋友圈</View>
      
      <UploaderPopup isVisible={isVisible} onClose={()=>{handleAgainBtn(false)}} currentIndex={imgInfo.type}/>

      <AdProcessPopup isVisible={isVisiblAdProcess} onClose={()=>{closeAdProcess(false)}} source={source} isReuse={isReuse} />

      {isResidueTimesVisible &&<NoneCountPopup isVisible={isResidueTimesVisible} onclose={()=>{
        handleNoneCountBtn(false)
      }} />}

    </View>
  )
}

export default Result
