/**
 * 计算自定义导航
 */
import { useMemo } from 'react';
import Taro from '@tarojs/taro';

const useCustomNavBarParams = () => {
  const [height, paddingTop] = useMemo(() => {
    const sysInfo = Taro.getSystemInfoSync();
    const menuInfo = Taro.getMenuButtonBoundingClientRect();
    const navigationBarHeight =
      (menuInfo.top - (sysInfo?.statusBarHeight || 0)) * 2 + menuInfo.height;
    
    let systemInfo = Taro.getSystemInfoSync() || {
        model: '',
        system: ''
    };
    let ios = !!(systemInfo.system.toLowerCase().search('ios') + 1);
    
    return [navigationBarHeight, ios?(sysInfo?.statusBarHeight+4):(sysInfo?.statusBarHeight+8)];
  }, []);

  return [height, paddingTop];
};

export default useCustomNavBarParams;

