import axios from './axios'

export function getSongDetail(id){

    return axios.get(`/song/detail?ids=${id}`)
    
}

export function getSongUrl(id){

    return axios.get(`/song/url?id=${id}&br=320000`)
    
}

