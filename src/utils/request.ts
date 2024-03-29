import Taro from "@tarojs/taro";
// const baseUrl = 'https://mock.mengxuegu.com/mock/65a8b8cfc4cd67421b34c78d/api'

const baseUrl = 'https://www.carton622.cn'

export async function Request(method, url, params = {}, header = {}) {
    return new Promise((resolve, reject) => {
        Taro.request({
            url: baseUrl + url,
            data: params,
            method,
            header: Object.assign(header, {'Content-type': 'application/json'}),
            success: (result) => {
                console.log("请求接口URL", url, params, result)
                const res = result.data
                if (res?.infoCode == 10000 || res?.infoCode == 10001 || res?.infoCode == 30000) {
                    // return res.data
                    resolve(res)
                } else {
                    Taro.showToast({
                        title: res.info,
                        icon: 'none'
                    })
                }
            },
            fail (err) {
                reject(err)
                Taro.showToast({
                    title: '服务器异常',
                    icon: 'none'
                })
            }
        }).catch(err => {
            Taro.showToast({
                title: '服务器异常',
                icon: 'none'
            })
        })
    })
}

export async function RequestCloud(method, url, params = {}, header = {}) {
    return new Promise((resolve, reject) => {
        
        // Taro.cloud.callContainer({
        //     path: url,
        //     method,
        //     header: Object.assign(header, {'Content-type': 'application/json'}),
        //     success: (result) => {
        //         console.log("请求接口URL", url, params, result)
        //         const res = result.data
        //         if (res?.infoCode == 10000 || res?.infoCode == 10001 || res?.infoCode == 30000) {
        //             // return res.data
        //             resolve(res)
        //         } else {
        //             Taro.showToast({
        //                 title: res.info,
        //                 icon: 'none'
        //             })
        //         }
        //     },
        //     fail (err) {
        //         reject(err)
        //         Taro.showToast({
        //             title: '服务器异常',
        //             icon: 'none'
        //         })
        //     }
        // })

        wx.cloud.callContainer({
            config: {
                env: "prod-2g0ml0fc4f6ab588"
            },
            path: url,
            header: {
              "X-WX-SERVICE": "flask-ur6e",
              "content-type": "application/json"
            },
            method,
            data: params,
            success: (result) => {
                console.log("请求接口URL", url, params, result)
                const res = result.data
                if (res?.infoCode == 10000 || res?.infoCode == 10001 || res?.infoCode == 30000) {
                    // return res.data
                    resolve(res)
                } else {
                    Taro.showToast({
                        title: res.info,
                        icon: 'none'
                    })
                }
            },
            fail (err) {
                reject(err)
                Taro.showToast({
                    title: '服务器异常',
                    icon: 'none'
                })
            }
          })
    })
}


// mock： 网址https://mock.mengxuegu.com/project/65a8b8cfc4cd67421b34c78d