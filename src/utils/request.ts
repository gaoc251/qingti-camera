import Taro from "@tarojs/taro";
const baseUrl = ' https://mock.mengxuegu.com/mock/65a8b8cfc4cd67421b34c78d/api'


export async function Request(method, url, params = {}, header = {}) {
    return new Promise((resolve, reject) => {
        Taro.request({
            url: baseUrl + url,
            data: params,
            method,
            header: Object.assign(header, {'Content-type': 'application/json'}),
            success: (result) => {
                const res = result.data
                if (res?.infoCode == 10000 || res?.infoCode == 10001) {
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