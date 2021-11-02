import axios from './axios'

export function getDiscData(id){

    return axios.get(`/playlist/detail?id=${id}`)
    
}