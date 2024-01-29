import React, {useEffect, useState} from 'react'
import Taro from '@tarojs/taro';
import { View, Image } from '@tarojs/components'
import { Tabs, Empty, Loading } from '@nutui/nutui-react-taro';
import { Request } from '../../../utils/request'

import { getHomeTypeList, getHomeTabContent } from '../../../utils/api';
import './index.scss'

function HomeTabs(props) {
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

  

  const res = [{
    key: 1,
    title: '写实油画',
    content: [{
      id: 1,
      imgUrl: 'https://img0.baidu.com/it/u=3968191045,278326663&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704474000&t=e431e825ad135e46ea80fa66e8a61b39',
      text: '给大家看看我的可爱宝宝吧，变成这样啦哈哈',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '萱萱妈妈'
    },{
      id: 2,
      imgUrl: 'https://i0.hdslb.com/bfs/archive/320d0d306b09fb580c616e7f475caaedeff0e601.jpg',
      text: '可爱的宝贝',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '夏甜甜🌸'
    },{
      id: 3,
      imgUrl: 'https://img1.baidu.com/it/u=437261551,167616624&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704992400&t=2c48aadc72d68721ec3b8846f3aacb3c',
      text: '给大家看看我的可爱宝宝吧，变成这样啦哈哈',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '萱萱妈妈'
    },{
      id: 4,
      imgUrl: 'https://img0.baidu.com/it/u=3968191045,278326663&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704474000&t=e431e825ad135e46ea80fa66e8a61b39',
      text: '可爱的宝贝',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '夏甜甜🌸'
    },,{
      id: 9,
      imgUrl: 'https://img1.baidu.com/it/u=437261551,167616624&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704992400&t=2c48aadc72d68721ec3b8846f3aacb3c',
      text: '给大家看看我的可爱宝宝吧，变成这样啦哈哈',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '萱萱妈妈'
    },{
      id: 10,
      imgUrl: 'https://img0.baidu.com/it/u=3968191045,278326663&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704474000&t=e431e825ad135e46ea80fa66e8a61b39',
      text: '可爱的宝贝',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '夏甜甜🌸'
    }
  ]
  },{
    key: 2,
    title: '日系漫画',
    content: [{
      id: 5,
      imgUrl: 'https://img0.baidu.com/it/u=3968191045,278326663&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704474000&t=e431e825ad135e46ea80fa66e8a61b39',
      text: '给大家看看我的可爱宝宝吧，变成这样啦哈哈',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '萱萱妈妈'
    },{
      id: 6,
      imgUrl: 'https://img0.baidu.com/it/u=3968191045,278326663&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704474000&t=e431e825ad135e46ea80fa66e8a61b39',
      text: '可爱的宝贝',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '夏甜甜🌸'
    }]
  },{
    key: 3,
    title: '巾帼萌宝',
    content: []
  },{
    key: 4,
    title: '龙年萌宝',
    content: [{
      id: 7,
      imgUrl: 'https://img0.baidu.com/it/u=3968191045,278326663&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704474000&t=e431e825ad135e46ea80fa66e8a61b39',
      text: '给大家看看我的可爱宝宝吧，变成这样啦哈哈',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '萱萱妈妈'
    }]
  },{
    key: 5,
    title: '魔幻萌宝',
    content: [{
      id: 8,
      imgUrl: 'https://img0.baidu.com/it/u=3968191045,278326663&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1704474000&t=e431e825ad135e46ea80fa66e8a61b39',
      text: '可爱的宝贝',
      avatar: 'https://lf-cdn-tos.bytescm.com/obj/static/xitu_extension/static/github.46c47564.png',
      username: '夏甜甜🌸'
    }]
  }]


  useEffect (()=> {
    setLoading(true)
    Request('get', getHomeTypeList, {}).then(res => {
      setTypeList(res.data.theme)
      Request('get', getHomeTabContent, {type: res.data.theme[0].type}).then(resC => {
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
        let h = await getImgHeight(item.imgUrl)
        
        if (_leftHeight <= _rightHeight) {
          _leftShowList.push(item)
          _leftHeight += h
        } else {
          _rightShowList.push(item)
          _rightHeight += h
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
          resolve(res.height)
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
    onChange(value)
    Request('get', getHomeTabContent, {type: typeList[value].type}).then(resC => {
      setTypeContent(resC.data)
    })
  }

  return (
    <View className="home-tabs">
      <Tabs 
        value={tabvalue} 
        onChange={(value) => {
          changeTab(value)
        }}
        tabStyle={{ position: 'sticky', top: navBarHeight + 'px', zIndex: 11, padding: '0 10px'}}
        className='home-tabs-wrap'
      >
        {typeList && typeList.length && typeList.map((item,index) => <Tabs.TabPane title={item.name}>
        
          { loading && rightShowList.length == 0 && leftShowList.length == 0 && <Loading className='home-tabs-loading' direction="vertical" icon={<Image className='home-tabs-loading-img' src={`${staticCdn}/public/result/loading.png`} />}>加载中</Loading>}
          {typeContent.length == 0 && <Empty />}
          {typeContent.length > 0 && <View className='home-tabs-list'>
            <View className='home-tabs-list-left'>
              { leftShowList && leftShowList.map((item,index) => <View className='home-tabs-list-item' key={`left_${index}`}>
                <Image src={item.imgUrl} className='home-tabs-list-item-img' mode='widthFix' lazyLoad/>
                {item.text && <View className='home-tabs-list-item-text'>{item.text}</View>}
                <View className='home-tabs-list-item-bottom'>
                  <Image src={item.nava} className='home-tabs-list-item-avatar' />
                  <View className='home-tabs-list-item-username'>{item.username}</View>
                </View>
              </View>)}
            </View>
            <View className='home-tabs-list-right'>
              { rightShowList && rightShowList.map((item,index) => <View className='home-tabs-list-item' key={`right_${index}`}>
                <Image src={item.imgUrl} className='home-tabs-list-item-img' mode='widthFix' lazyLoad/>
                {item.text && <View className='home-tabs-list-item-text'>{item.text}</View>}
                <View className='home-tabs-list-item-bottom'>
                  <Image src={item.nava} className='home-tabs-list-item-avatar' />
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
