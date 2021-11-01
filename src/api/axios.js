import axios from 'axios'



const instance = axios.create({
    baseURL: 'http://cloud-music.pl-fe.cn',
    timeout: 2000,

});

export default instance;