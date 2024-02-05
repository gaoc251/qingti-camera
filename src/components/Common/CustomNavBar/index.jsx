
import { memo } from 'react';
import { View } from '@tarojs/components';

import useCustomNavBarParams from './useCustomNavBarParams';

// import styles from './index.module.less';
import './index.scss'

const CustomNavBar = (props) => {

    const {
        title,
        renderCenter
    } = props;
 
  const [height, paddingTop] = useCustomNavBarParams();

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
      style={Object.assign(
        {
          height: `${height}px`,
          paddingTop: `${paddingTop}px`,
        }
      )}
      className='custom-navBar'
    //   className={`${styles?.navBar} ${className}`}
    //   {...rest}
    >
      {/* <text className={styles.name}>****</text> */}
      <View className='custom-navBar-content' style={{height: `${height}px`}}>{renderNavCenter()}</View>
    </View>
  );
};

export default memo(CustomNavBar);
