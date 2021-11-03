import axios from './axios'

export function getHotSearch(){

    return axios.get(`/search/hot`)
    
}

export function getSuggest(query,offset){

    return axios.get(`/cloudsearch?keywords=${query}&offset=${offset}`)
    
}