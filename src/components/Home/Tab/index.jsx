import React, {useEffect, useState} from 'react'
import Taro, { useReady, useDidHide } from '@tarojs/taro';
import { View, Image } from '@tarojs/components'
import { Tabs, Empty, Loading } from '@nutui/nutui-react-taro';
import { Request } from '../../../utils/request'

import { getHomeTypeList, getHomeTabContent } from '../../../utils/api';
import './index.scss'


const system = Taro.getSystemInfoSync()
console.log("system", system)
function HomeTabs (props) {
  console.log("sssssss渲染")
  const [tabvalue, setTabvalue] = useState('0');
  
  const [rightShowList, setRightShowList] = useState([]);
  const [leftShowList, setLeftShowList] = useState([]);
  const [leftHeight, setLeftHeight] = useState(0);
  const [rightHeight, setRightHeight] = useState(0);

  const [loading, setLoading] = useState(false)
  // const [tabData, setTabData] = useState([])
  const { onChange, navBarHeight } = props

  const [typeList, setTypeList] = useState([]); // 风格title
  const [typeContent, setTypeContent] = useState([]); // 风格title
  const [overlap, setOverlap] = useState(false); // 默认不重叠

  let observer = null


  useEffect (()=> {
    setLoading(true)
    Request('get', getHomeTypeList, {}).then(res => {
      let _theme = res.data.theme
      setTypeList(_theme)
      onChange(_theme[0].type)
      Request('get', getHomeTabContent, {type: res.data.theme[0].type}).then(resC => {
        if (resC.data.length == 0) {
          setLoading(false)
        }
        setTypeContent(resC.data)
      })
    })
  }, [])

  useEffect(()=>{
    typeContent.length && 
    Taro.nextTick(()=> {
      const query = Taro.createSelectorQuery()
      query.select('.home-tabs-list-left').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function(res){
        if (res[1]){
          setWaterFallLayout()
        }
      })

    })
  }, [typeContent])

  const setWaterFallLayout = async () => {
    let _leftShowList = leftShowList,
        _rightShowList = rightShowList,
        _leftHeight = leftHeight,
        _rightHeight = rightHeight
    for (let item of typeContent) {
      try {
        let res = await getImgHeight(item.imgurl)
        let _scr = system.screenWidth
        let w = _scr*(375-51)/375/2
        let h = res.height*w/res.width
        console.log("wwwwww",w, h)
        if (_leftHeight <= _rightHeight) {
          _leftShowList.push({...item, width: w, height:h})
          _leftHeight += res.height
        } else {
          _rightShowList.push({...item, width: w, height:h})
          _rightHeight += res.height
        }
      }
      catch {}
    }
    setLeftHeight(_leftHeight)
    setLeftShowList(_leftShowList)
    setRightHeight(_rightHeight)
    setRightShowList(_rightShowList)
    setLoading(false)
  }

  const getImgHeight = (url) => {
    return new Promise((resolve, reject) => {
      Taro.getImageInfo({
        src: url,
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject(err)
        }
      })
    })
  } 

  const changeTab = (value) => {
    setTabvalue(value)
    setLeftHeight(0)
    setRightHeight(0)
    setLeftShowList([])
    setRightShowList([])
    setLoading(true)
    onChange(typeList[value].type)
    Request('get', getHomeTabContent, {type: typeList[value].type}).then(resC => {
      if(resC.data.length == 0){
        setLoading(false)
      }
      setTypeContent(resC.data)
    })
  }

  useReady(()=>{
    observer = Taro.createIntersectionObserver()
    observer
      .relativeTo('.custom-navBar')
      .observe('.home-tabs', (res) => {
        console.log("observe", res);
        setOverlap(res.intersectionRatio > 0)
      })

  })

  useDidHide(()=>{
    if (observer) {
      observer.disconnect()
    }
  })

  return (
    <View className="home-tabs">
      <Tabs 
        value={tabvalue} 
        onChange={(value) => {
          changeTab(value)
        }}
        tabStyle={ Object.assign({ position: 'sticky', top: navBarHeight + 'px', zIndex: 11, padding: '0 10px'}, overlap?{background: '#fff'}:{})}
        className='home-tabs-wrap'
      >
        {typeList && typeList.length && typeList.map((item,index) => <Tabs.TabPane title={item.name} className='home-tabs-title'>
          { loading && rightShowList.length == 0 && leftShowList.length == 0 && <Loading className='home-tabs-loading' direction="vertical" icon={<Image className='home-tabs-loading-img' src={`${staticCdn}/public/result/loading.png`} />}>加载中</Loading>}
          {!loading && typeContent.length == 0 && <Empty />}
          {typeContent.length > 0 && <View className='home-tabs-list'>
            <View className='home-tabs-list-left'>
              { leftShowList && leftShowList.map((item,index) => <View className='home-tabs-list-item' key={`left_${index}`}>
                <Image src={item.imgurl} className='home-tabs-list-item-img' lazyLoad style={{height: item.height}}/>
                {item.text && <View className='home-tabs-list-item-text'>{item.text}</View>}
                <View className='home-tabs-list-item-bottom'>
                  <Image src={item.avatar} className='home-tabs-list-item-avatar' />
                  <View className='home-tabs-list-item-username'>{item.username}</View>
                </View>
              </View>)}
            </View>
            <View className='home-tabs-list-right'>
              { rightShowList && rightShowList.map((item,index) => <View className='home-tabs-list-item' key={`right_${index}`}>
                <Image src={item.imgurl} className='home-tabs-list-item-img' lazyLoad style={{height: item.height}}/>
                {item.text && <View className='home-tabs-list-item-text'>{item.text}</View>}
                <View className='home-tabs-list-item-bottom'>
                  <Image src={item.avatar} className='home-tabs-list-item-avatar' />
                  <View className='home-tabs-list-item-username'>{item.username}</View>
                </View>
              </View>)}
            </View>
          </View> }
        </Tabs.TabPane>)}
        
      </Tabs>
    </View>
  )
}

export default HomeTabs
