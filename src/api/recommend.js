import jsonp from "../common/js/jsonp";

import { commonParams, options } from "./config";

import axios from './axios'


/*

    qq音乐的接口全部换成 网易云音乐了

*/


export function getRecommend() {

    const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        uin: 0,
        needNewCode: 1
    })

    return jsonp(url, data, options)

}

export function getRecommendWYY() {

   return axios.get('/banner?type=2')

}

export function getDiscList() {
    
    return axios.get('/personalized?limit=30')
}
  