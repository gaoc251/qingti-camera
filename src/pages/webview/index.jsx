import React, {useState, useEffect} from 'react'
import { View, WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { getCurrentInstance } from '@tarojs/runtime';
import './index.scss'


function WebviewPage() {

  const [url, setUrl] = useState('');

  let params = getCurrentInstance().router.params // 路由参数

  useEffect(() => {
    if (!params) return;
    const decodeUrl = decodeURIComponent(params.src || '');
    setUrl(decodeUrl);
  }, [params]);

  return (
    <View className="webview">
      <WebView src={url}></WebView>
    </View>
  )
}

export default WebviewPage
