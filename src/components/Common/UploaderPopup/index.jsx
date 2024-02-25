import React, {useEffect, useState} from 'react'
import { View, Image } from '@tarojs/components'
import { Popup, AvatarCropper, Button, Avatar } from '@nutui/nutui-react-taro';
import { Refresh, Retweet } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro';
import { img2img } from '../../../utils/api';
import { Request } from '../../../utils/request';
import compressImage from './compressImage';
import './index.scss'


export default function UploaderPopup(props) {
  const {isVisible, onclose, currentIndex} = props
  
  const [openId, setOpenId] = useState('')

  useEffect(() => {
    let _openId = Taro.getStorageSync('openId')
    setOpenId(_openId)
  }, [])

  const [imageUrl, setImageUrl] = useState('')
  
  const cutImage = async (data) => {
    let file = ''
    await compressImage(data,file,60,100,5, (res)=>{
      file = res
      const _base64 = Taro.getFileSystemManager().readFileSync(file, "base64");
      setImageUrl(_base64)
      let params = {
        imgType: currentIndex,
        openid: openId,
        imgStr: _base64,
        reuse: false
      }
      uploadImg(params)
    })

    // ToDo暂时隐藏
    // let _base64 = await fileToBase64(data)
    // setImageUrl(_base64)
    // let params = {
    //   imgType: currentIndex,
    //   openid: openId,
    //   imgStr: _base64,
    //   reuse: false
    // }
    // Request('post', img2img, params).then(res => {
    //   if (res.infoCode == 10000) {
    //     Taro.navigateTo({
    //       url: `/pages/result/index?id=${res.data.taskid}`
    //     })
    //   } else {
    //     Taro.showToast({
    //       title: res.info,
    //       icon: 'none'
    //     })
    //   }
    // })
  }

  const uploadImg = (params) => {
    Request('post', img2img, params).then(res => {
      if (res.infoCode == 10000) {
        Taro.navigateTo({
          url: `/pages/result/index?id=${res.data.taskid}`
        })
      } else {
        Taro.showToast({
          title: res.info,
          icon: 'none'
        })
      }
    })
  }

  // 转base64
  const fileToBase64 = async (filePath) => {
    const base64 = Taro.getFileSystemManager().readFileSync(filePath, "base64");
    return base64
  }

  const renderImg = () =>{
    const arrConfig = [{
      text: '完整正面',
      imgUrl: `${staticCdn}/public/home/example1.png`,
      textColor: 'rgba(44, 209, 130, 1)'
    },{
      text: '模糊不清',
      imgUrl: `${staticCdn}/public/home/example2.png`,
      textColor: 'rgba(255, 192, 98, 1)'
    },{
      text: '遮挡不全',
      imgUrl: `${staticCdn}/public/home/example3.png`,
      textColor: 'rgba(255, 192, 98, 1)'
    }]
    return <View className='uploader-popup-img'>
      {arrConfig.map((item,index) => <View className='uploader-popup-img-item' key={index}>
        <Image src={item.imgUrl} className='uploader-popup-img-item-img' />
        <View className='uploader-popup-img-item-title' style={{color: item.textColor}}>{item.text}</View>
      </View>)}
    </View>
  }

  return (
    <Popup visible={ isVisible } style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute'}} closeable closeIcon={`${staticCdn}/public/home/close.png`} position="bottom" onClose={ () => { onclose?.() }} className='uploader-popup'>
      <View className='uploader-popup-top'>
        <View className='uploader-popup-top-title'>上传一张照片</View>
      </View>
      { renderImg()}
      <View className='uploader-popup-btns'>
        <AvatarCropper
          className='uploader-popup-btns-item album'
          // toolbarPosition="top"
          sizeType={['compressed']}
          editText=""
          sourceType={['album']} 
          onConfirm={cutImage}
          toolbar={[
            <Button type="danger" key="cancel">
              取消
            </Button>,
            <Refresh key="reset" />,
            <Retweet key="rotate" />,
            <Button type="success" key="confirm">
              确认
            </Button>,
          ]}
          >
          <View className='uploader-popup-btns-item-text'>相册</View>
        </AvatarCropper>
        <AvatarCropper
          className='uploader-popup-btns-item camera'
          toolbarPosition="top"
          editText=""
          sourceType={['camera']} 
          onConfirm={cutImage}
          toolbar={[
            <Button type="danger" key="cancel">
              取消
            </Button>,
            <Refresh key="reset" />,
            <Retweet key="rotate" />,
            <Button type="success" key="confirm">
              确认
            </Button>,
          ]}
          >
          <View className='uploader-popup-btns-item-text'>拍摄</View>
        </AvatarCropper>
      </View>
    </Popup>
  )
}

