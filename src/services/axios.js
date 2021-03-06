import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { errMessage, reLogin } from '@/utils/messages'
import { HOST } from '@/settings'

// create an axios instance
const service = axios.create({
  baseURL: HOST + '/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  mode: 'cors',
  credentials: 'same-origin',
  timeout: 40000, // request timeout
  headers: { Accept: 'application/json; version=1' }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // config.headers.post['Content-Type'] = 'application/json'
    // config.headers.put['Content-Type'] = 'application/json'
    // config.headers.patch['Content-Type'] = 'application/json'
    if (store.getters.token) {
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  res => {
    // if the custom code is not 20000, it is judged as an error.
    if (res.status !== 200 && res.status !== 201 && res.status !== 204) {
      // errMessage(res.err)

      // 401/403: Unauthorized / Token expired
      if (res.status === 401 || res.status === 403) {
        // to re-login
        reLogin()
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {
    const { response, message } = error
    console.log(response)
    errMessage(message)

    // 401/403: Unauthorized / Token expired
    if (response.status === 401 || response.status === 403) {
      // to re-login
      reLogin()
    }
    return Promise.reject(response)
  }
)

export default service
