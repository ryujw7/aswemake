import * as axios from 'axios';



var instance = axios.create();
instance.defaults.baseURL = 'http://15.164.34.53:3000';
instance.defaults.timeout = 20000;

export { instance as default }