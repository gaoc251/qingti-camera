import Taro from '@tarojs/taro';
/**
 *小程序图片压缩到指定大小
 * @param oldFilePath 原图地址
 * @param filePath 压缩后的图片地址
 * @param limitSize 图片大小kb 1024
 * @param quality 图片质量 100
 * @param step 图片质量每次降低多少 5 
 * @param callback 回调
 */
export default function compressImage  (
  oldFilePath,
  filePath,
  limitSize,
  quality,
  step,
  callback,
) {
  const path = filePath === '' ? oldFilePath : filePath;
  Taro.getFileSystemManager().getFileInfo({
    filePath: path,
    success: async (res) => {
      console.log(`图片压缩size：${res.size / 1024}kb`, `quality：${quality}`);
      if (res.size > 1024 * limitSize && (quality-step >= 0)) {
        Taro.compressImage({
          src: oldFilePath,
          quality: quality - step,
          success(result) {
            compressImage(
              oldFilePath,
              result.tempFilePath,
              limitSize,
              quality - step,
              step,
              callback,
            );
          },
        });
      } else {
        console.log(
          `压缩成功！size:${res.size / 1024}kb`,
          `quality：${quality}`,
          `path：${filePath}`,
        );
        // const base64 = Taro.getFileSystemManager().readFileSync(filePath);
        callback(filePath);
      }
    },
    fail(res) {
      callback(res.errMsg);
    },
  });
};