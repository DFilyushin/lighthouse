import axios from 'axios'
import AuthEndpoint from "./endpoints/AuthEndpoint";


const token = localStorage.getItem('token') || ''
console.log('token', token)
const authAxios = axios.create()

/**
 * Добавление авторизационного заголовка с токеном
 */
authAxios.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token') || ''
    console.log('interceptor request: ', token)
    config.headers.Authorization = `Bearer ${token}`
    return config
})

/**
 * Обновление рабочего токена при 401 ошибке
 */
authAxios.interceptors.response.use((response)=> {
    return response
}, error => {
    const originalRequest = error.config
    if (error.response.status === 401) {
        console.log('401', originalRequest.url)
        const refreshToken = localStorage.getItem('refresh')
        return axios.post(AuthEndpoint.getUpdateToken(), {
            "refresh": refreshToken
        }).then(res=>{
            if (res.status === 200){
                console.log('newToken', res)
                const newAccessToken = res.data.access
                localStorage.setItem('token', newAccessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
                return axios(originalRequest)
            }else {
                console.log('res', res)
            }
        }).catch(error=>{
            console.log(error)
            }
        )
    }
    return Promise.reject(error)
})

export default authAxios