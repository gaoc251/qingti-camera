import React, {useEffect, useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import classNames from 'classnames';
import './index.scss'
import Taro, { useShareAppMessage } from '@tarojs/taro'
import { Request } from '../../utils/request';
import { getImg, img2img } from '../../utils/api';

import { Loading } from '@nutui/nutui-react-taro';
import UploaderPopup from '../../components/Common/UploaderPopup';
import AdProcessPopup from '../../components/Result/AdProcessPopup';
import NoneCountPopup from '../../components/Common/NoneCountPopup';
import { getCurrentInstance } from '@tarojs/runtime';


function Result() {
  const [saveDisable, setSaveDisable] = useState(false); // 默认可点击
  const [isVisible, setIsVisible] = useState(false);
  const [isVisiblAdProcess, setIsVisibleAdProcess] = useState(true);
  const [source, setSource] = useState({
    src: 'https://storage.360buyimg.com/nutui/video/video_NutUI.mp4',
    type: 'video/mp4',
  })

  const [imgInfo, setImgInfo] = useState([])
  const [currentIndex, setCurrentIndex] = useState([0]) // 切换生成图片索引

  const [openId, setOpenId] = useState('')
  const [isResidueTimesVisible, setIsResidueTimesVisible] = useState(false) // 剩余次数弹框
  const [residueTimes, setResidueTimes] = useState(0) // 剩余次数
  let taskId = getCurrentInstance().router.params.id // 任务ID
  let openLunxun = true; // 默认开启轮训操作
 
  useEffect(() => {
    let _openId = Taro.getStorageSync('openId')
    setOpenId(_openId)
  }, [])

  // TODO: 数据轮询 5S一次

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
        title: '正在生成中...请稍后',
        icon: 'none'
      })
    } else {
      // 解决办法：1、完善一下用户隐私协议 2、配置downloadFile的合法域名
      Taro.downloadFile({
        url: 'https://img0.baidu.com/it/u=3968191045,278326663&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704474000&t=e431e825ad135e46ea80fa66e8a61b39',
        success: res => {
          if (res.statusCode === 200) {
            console.log(res)
            const tempFilePath = res.tempFilePath;  // 获取下载的临时文件路径
            saveImageToPhotosAlbum(tempFilePath)
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

  const saveImageToPhotosAlbum = (tempFilePath) => {
    // 保存图片到相册
    Taro.saveImageToPhotosAlbum({
      filePath: tempFilePath,
      success: () => {
        console.log('保存图片成功');
        // 图片保存成功的处理逻辑
        Taro.navigateTo({
          url: '/pages/saveSuccess/index'
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
    openId && getImgData()
    openId && fetchResidueTimes()
  }, [openId])

  // 获取 剩余次数
  const fetchResidueTimes = () => {
    Request('get', getUselimite, {openid:openId}).then(res=>{
      setResidueTimes(res.data.limite)
    })
  }

  const getImgData = () => {
    Request('get', getImg, { openid:openId, taskid: taskId }).then(res => {
      const { infoCode, pics } = res
      if (infoCode == '10000') {
        setImgInfo({
          avatar: '',
          themeName: '',
          type: '',
          pics: pics
        })
        setSaveDisable(false)
        setIsVisibleAdProcess(false)
      } else if (infoCode == 10001) {
        setSaveDisable(true)
      } else if (infoCode == 30000) {
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
    if (residueTimes) {
      setIsResidueTimesVisible(true)
    }
    if (saveDisable) {
      Taro.showToast({
        title: '正在生成中...请稍后',
        icon: 'none'
      })
    } else {
      setIsVisibleAdProcess(true)
      // 重新绘制调用图生图接口
      Request('get', img2img, {openid: openId, reuse: true, type: imgInfo.type}).then(res => {
        taskId = res.data.taskid
      })
    }
  }

   // 关闭剩余次数
   const handleNoneCountBtn = (flag) => {
    setIsResidueTimesVisible(flag)
  }

  return (
    <View className="result">
      <View className='result-top'>
        <View className='result-top-left'>
          <Image className='result-top-avatar' src={imgInfo.avatar} />
          <View className='result-top-info'>
            <View className='result-top-info-text'>{imgInfo.themeName}</View>
            <View className='result-top-info-change' onClick={jumpToHome}>
              <Image src='../../public/result/exchange.png' className='result-top-info-change-icon' />
              <View className='result-top-info-change-text'>点击更换风格</View>
            </View>
          </View>
        </View>
        <View className='result-top-again' onClick={()=>{handleAgainBtn(true)}}>
          <View className='result-top-again-text'>重新上传照片</View>
          <Image src='../../public/result/jump.png' className='result-top-again-icon' />
        </View>
      </View>
      <View className='result-img'>
        {!imgInfo.pics && <Image className='result-img-bg' src='../../public/result/bg.png' />}
        {imgInfo.pics && <Image className='result-img-bg' src={imgInfo.pics[currentIndex]} />}
        <Image className='result-img-icon' src='../../public/result/home_icon.png'/>
        <View className='result-img-text'>青提相机</View>
        <View className='result-img-tip'>青提相机</View>
        <Loading direction="vertical" icon={<Image className='result-img-loading' src='../../public/result/loading.png' />}/>
      </View>
      
      <View className='result-btns'>
        {imgInfo.pics && imgInfo.pics.length > 0 && imgInfo.pics.map((item, index) => {
          return <View className={classNames('result-btns-item-border', {'active': index == currentIndex})} onClick={()=>clickResBtn(index)} key={index}>
            <View className='result-btns-item' >
            {item && <Image src={item} className='result-btns-item-img'/>}
            {!item && <Loading direction="vertical" icon={<Image className='result-btns-item-loading' src='../../public/result/loading.png' />}/>}
          </View>
          </View>
        })}

        <View 
          className={classNames('result-btns-item again', {'nodisable': !saveDisable})}
          onClick={againDraw}
        >
          <Image className='result-btns-item-again' src='../../public/result/again.png' />
          <View className='result-btns-item-text'>重新绘制</View>
        </View>
      </View>

     
      <View className={classNames('result-save', {'active': !saveDisable})} onClick={saveImg}>
        <Image className='result-save-icon' src='../../public/result/save.png'/>
        <View className='result-save-text'>保存当前图片</View>
      </View>
      <View className='result-tip'>可用作微信头像、发表朋友圈</View>
      
      <UploaderPopup isVisible={isVisible} onClose={()=>{handleAgainBtn(false)}} />

      <AdProcessPopup isVisible={isVisiblAdProcess} onClose={()=>{closeAdProcess(false)}} source={source} />

      {isResidueTimesVisible &&<NoneCountPopup isVisible={isResidueTimesVisible} onclose={()=>{
        handleNoneCountBtn(false)
      }} />}

    </View>
  )
}

export default Result
