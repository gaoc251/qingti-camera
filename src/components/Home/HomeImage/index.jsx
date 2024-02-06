import { Image } from "@tarojs/components";
import { FC, useEffect, useState } from "react";
import Taro, { pxTransform } from "@tarojs/taro";
import { memo } from "react";

export const ImageCom = memo(({ url }) => {
  const [imageHW, setImageHW] = useState({
    width: 0,
    height: 0,
  });

  /**
   * 计算图片相对于屏幕的比例
   * @param res
   * @returns
   */
  const computeImageScale = (res) => {
    const { width, height } = res;
    const screenWidth = Taro.getSystemInfoSync().windowWidth * 2 * 0.7;
    if (screenWidth < width) {
      const scale = screenWidth / width;
      return {
        width: screenWidth,
        height: height * scale,
      };
    } else {
      return {
        width,
        height,
      };
    }
  };

  /**
   * 获取并计算图片的宽高
   */
  const handelGetImageInfo = () => {
    console.log("url", url)

    Taro.getImageInfo({
      src: url,
      success: (res) => {
        const elInfo = computeImageScale(res);
        setImageHW({
          height: elInfo.height,
          width: elInfo.width,
        });
      },
    });
  };

  useEffect(() => {
   handelGetImageInfo();
  });
  
  return (
    <>
      <Image
        src={url}
        //一开始就给他一个固定的经过计算的宽高，不给他自适应的机会
        style={{ width: pxTransform(imageHW.width),height:pxTransform(imageHW.height) }}
      />
    </>
  );
});
