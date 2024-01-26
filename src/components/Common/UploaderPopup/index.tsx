import React, {useEffect, useState} from 'react'
import { View, Image } from '@tarojs/components'
import { Popup, AvatarCropper, Button, Avatar } from '@nutui/nutui-react-taro';
import { Refresh, Retweet } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro';
import './index.scss'


export default function UploaderPopup(props) {
  const {isVisible, onClose, currentIndex} = props
  const [openId, setOpenId] = useState('')

  useEffect(() => {
    let _openId = Taro.getStorageSync('openId')
    setOpenId(_openId)
  }, [])

  const [imageUrl, setImageUrl] = useState('https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png')
  
  const cutImage = async (data) => {
    let _base64 = await fileToBase64(data)
    setImageUrl(_base64)
    let params = {
      key: currentIndex,
      openid: openId,
      imgStr: _base64
    }
    debugger
    Taro.navigateTo({
      url: `/pages/result/index?id=${currentIndex}`
    })
  }

  // 转base64
  const fileToBase64 = async (filePath) => {
    let res = [];
    for (const item of filePath) {
      let itemBase64 =''
      const base64 = Taro.getFileSystemManager().readFileSync(item.path, "base64");
      if (base64) {
        itemBase64 = "data:image/jpeg;base64," + base64;
      }
      res.push({url: itemBase64})
    }
    return res
  }

  const renderImg = () =>{
    const arrConfig = [{
      text: '完整正面',
      imgUrl: '../../public/home/example1.png',
      textColor: 'rgba(44, 209, 130, 1)'
    },{
      text: '模糊不清',
      imgUrl: '../../public/home/example2.png',
      textColor: 'rgba(255, 192, 98, 1)'
    },{
      text: '遮挡不全',
      imgUrl: '../../public/home/example3.png',
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
        <AvatarCropper
          className='uploader-popup-btns-item album'
          toolbarPosition="top"
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

