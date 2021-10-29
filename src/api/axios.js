import axios from 'axios'



const instance = axios.create({
    baseURL: 'http://cloud-music.pl-fe.cn',
    timeout: 1000,

});

export default instance;