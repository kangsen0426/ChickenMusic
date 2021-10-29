import jsonp from "../common/js/jsonp";

import axios from './axios'

export function getSingerList(){

    return axios.get('/top/artists?limit=100')
    
}