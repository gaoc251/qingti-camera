import React, {useState} from 'react'
import Taro, {components, useDidShow} from '@tarojs/taro';
import _isFunction from 'lodash/isFunction';
import { View, Text, Image } from '@tarojs/components'

import './index.scss'

export function getSystemInfo() {
if (Taro.globalSystemInfo && !Taro.globalSystemInfo.ios) {
    return Taro.globalSystemInfo;
  } else {
    // h5环境下忽略navbar
    if (!_isFunction(Taro.getSystemInfoSync)) {
      return null;
    }
    let systemInfo = Taro.getSystemInfoSync() || {
      model: '',
      system: ''
    };
    let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
    let rect;
    try {
      rect = Taro.getMenuButtonBoundingClientRect ? Taro.getMenuButtonBoundingClientRect() : null;
      if (rect === null) {
        throw 'getMenuButtonBoundingClientRect error';
      }
      //取值为0的情况  有可能width不为0 top为0的情况
      if (!rect.width || !rect.top || !rect.left || !rect.height) {
        throw 'getMenuButtonBoundingClientRect error';
      }
    } catch (error) {
      let gap = ''; //胶囊按钮上下间距 使导航内容居中
      let width = 96; //胶囊的宽度
      if (systemInfo.platform === 'android') {
        gap = 8;
        width = 96;
      } else if (systemInfo.platform === 'devtools') {
        if (ios) {
          gap = 5.5; //开发工具中ios手机
        } else {
          gap = 7.5; //开发工具中android和其他手机
        }
      } else {
        gap = 4;
        width = 88;
      }
      if (!systemInfo.statusBarHeight) {
        //开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
      }
      rect = {
        //获取不到胶囊信息就自定义重置一个
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width: width
      };
      console.log('error', error);
      console.log('rect', rect);
    }

    let navBarHeight = '';
    if (!systemInfo.statusBarHeight) {
      //开启wifi和打电话下
      systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
      navBarHeight = (function() {
        let gap = rect.top - systemInfo.statusBarHeight;
        return 2 * gap + rect.height;
      })();

      systemInfo.statusBarHeight = 0;
      systemInfo.navBarExtendHeight = 0; //下方扩展4像素高度 防止下方边距太小
    } else {
      navBarHeight = (function() {
        let gap = rect.top - systemInfo.statusBarHeight;
        return systemInfo.statusBarHeight + 2 * gap + rect.height;
      })();
      if (ios) {
        systemInfo.navBarExtendHeight = 4; //下方扩展4像素高度 防止下方边距太小
      } else {
        systemInfo.navBarExtendHeight = 0;
      }
    }

    systemInfo.navBarHeight = navBarHeight; //导航栏高度不包括statusBarHeight
    systemInfo.capsulePosition = rect; //右上角胶囊按钮信息bottom: 58 height: 32 left: 317 right: 404 top: 26 width: 87 目前发现在大多机型都是固定值 为防止不一样所以会使用动态值来计算nav元素大小
    systemInfo.ios = ios; //是否ios
    Taro.globalSystemInfo = systemInfo; //将信息保存到全局变量中,后边再用就不用重新异步获取了
    //console.log('systemInfo', systemInfo);

    console.log("statusBarHeight", systemInfo.statusBarHeight)
    console.log("")
    return systemInfo;
  }
}

let globalSystemInfo = getSystemInfo()

console.log("globalSystemInfo", globalSystemInfo)

export default function NavBar(props) {
    const [configStyle, setConfigStyle] = useState({})

    const {
        navigationbarinnerStyle,
        navBarLeft,
        navBarHeight,
        capsulePosition,
        navBarExtendHeight,
        ios,
        rightDistance
    } = configStyle;
    const {
        title,
        background,
        backgroundColorTop,
        back,
        home,
        searchBar,
        searchText,
        iconTheme,
        extClass,
        renderCenter
    } = props;

    useDidShow (()=>{
        if (globalSystemInfo.ios) {
            globalSystemInfo = getSystemInfo();
    
            let _globalSystemInfo = setStyle(globalSystemInfo)
            setConfigStyle(_globalSystemInfo)
        } else {
          setConfigStyle(globalSystemInfo)
        }
    })

    const handleBackClick = ()=> {
        if (_isFunction(onBack)) {
          onBack();
        } else {
          const pages = Taro.getCurrentPages();
          if (pages.length >= 2) {
            Taro.navigateBack({
              delta: delta
            });
          }
        }
    }

    // const handleGoHomeClick = () => {
    //     if (_isFunction(onHome)) {
    //       onHome();
    //     }
    // }
    // const handleSearchClick = () => {
    //     if (_isFunction(onSearch)) {
    //       onSearch();
    //     }
    // }

    const setStyle = (systemInfo) => {
        const { statusBarHeight, navBarHeight, capsulePosition, navBarExtendHeight, ios, windowWidth } = systemInfo;
        const { back, home, title, color } = props;
        let rightDistance = windowWidth - capsulePosition.right; //胶囊按钮右侧到屏幕右侧的边距
        let leftWidth = windowWidth - capsulePosition.left; //胶囊按钮左侧到屏幕右侧的边距
    
        let navigationbarinnerStyle = [
          `color:${color}`,
          //`background:${background}`,
          `height:${navBarHeight + navBarExtendHeight}px`,
          `padding-top:${statusBarHeight}px`,
          `padding-right:${leftWidth}px`,
          `padding-bottom:${navBarExtendHeight}px`
        ].join(';');
        let navBarLeft = [];
        if ((back && !home) || (!back && home)) {
          navBarLeft = [
            `width:${capsulePosition.width}px`,
            `height:${capsulePosition.height}px`,
            `margin-left:0px`,
            `margin-right:${rightDistance}px`
          ].join(';');
        } else if ((back && home) || title) {
          navBarLeft = [
            `width:${capsulePosition.width}px`,
            `height:${capsulePosition.height}px`,
            `margin-left:${rightDistance}px`
          ].join(';');
        } else {
          navBarLeft = [`width:auto`, `margin-left:0px`].join(';');
        }
        return {
          navigationbarinnerStyle,
          navBarLeft,
          navBarHeight,
          capsulePosition,
          navBarExtendHeight,
          ios,
          rightDistance
        };
      }
    const renderNavCenter = () => {
        if (title) {
            return <Text>{title}</Text>;
        } else {
            /* eslint-disable */
            return renderCenter;
            /* eslint-enable */
          }
    }

    return (
        <View
        className={`nav-bar ${ios ? 'ios' : 'android'} ${extClass}`}
        style={`background: ${backgroundColorTop ? backgroundColorTop : background};height:${navBarHeight +
          navBarExtendHeight}px;`}
      >
        <View
          className={`nav-bar__placeholder ${ios ? 'ios' : 'android'}`}
          style={`padding-top: ${navBarHeight + navBarExtendHeight}px;`}
        />
        <View
          className={`nav-bar__inner ${ios ? 'ios' : 'android'}`}
          style={`background:${background};${navigationbarinnerStyle};`}
        >
          {renderNavCenter()}
        </View>
      </View>
    );
  }

