export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/result/index',
    'pages/saveSuccess/index',
    'pages/webview/index',
    'pages/private/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  permission: {
    "scope.writePhotosAlbum":{
      "desc": "授权相册权限后，您才能正常保存图片"
    },
  }
})
