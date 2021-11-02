import axios from './axios'

export function getTopList(id){

    return axios.get(`/toplist/detail`)
    
}