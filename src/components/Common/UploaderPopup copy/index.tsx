import React, {useState} from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Popup, Uploader } from '@nutui/nutui-react-taro';
import './index.scss'


export default function UploaderPopup(props) {
  const {isVisible, onClose} = props

  const uploadUrl = 'https://my-json-server.typicode.com/linrufeng/demo/posts' // 服务器接口


  const beforeUploader = (xhr, options) => {
    console.log("1", options?.taroFile)
    debugger
  }

  const renderImg = () =>{
    const arrConfig = [{
      text: '完整正面',
      imgUrl: '../../public/home/test_img.png',
      textColor: 'rgba(44, 209, 130, 1)'
    },{
      text: '模糊不清',
      imgUrl: '../../public/home/test_img.png',
      textColor: 'rgba(255, 192, 98, 1)'
    },{
      text: '遮挡不全',
      imgUrl: '../../public/home/test_img.png',
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
    <Popup visible={ isVisible } style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'absolute'}} closeable closeIcon={'../../../public/home/close.png'} position="bottom" onClose={ () => { onClose?.() }} className='uploader-popup'>
      <View className='uploader-popup-top'>
        <View className='uploader-popup-top-title'>上传一张照片</View>
      </View>
      { renderImg()}
      <View className='uploader-popup-btns'>
        <Uploader 
          url={uploadUrl} 
          sourceType={['album']} 
          className='uploader-popup-btns-item' 
          maxCount="1" 
          beforeXhrUpload={beforeUploader} >相册</Uploader>
        <Uploader url={uploadUrl} sourceType={['camera']} className='uploader-popup-btns-item' maxCount="1" autoUpload={false}>拍摄</Uploader>
      </View>
    </Popup>
  )
}

