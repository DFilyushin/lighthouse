import axios from 'axios'
import AuthEndpoint from "./endpoints/AuthEndpoint";

const authAxios = axios.create()

/**
 * Добавление авторизационного заголовка с токеном
 */
authAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || ''
    config.headers.Authorization = `Bearer ${token}`
    return config
})

/**
 * Обновление рабочего токена при 401 ошибке
 */
authAxios.interceptors.response.use((response) => {
    return response
}, error => {
    const originalRequest = error.config
    if (error.response.status === 401) {
        const refreshToken = localStorage.getItem('refresh')
        return axios.post(AuthEndpoint.getUpdateToken(), {
            "refresh": refreshToken
        }).then(res => {
            if (res.status === 200) {
                console.log('refresh session token...')
                const newAccessToken = res.data.access
                localStorage.setItem('token', newAccessToken)
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`
                return axios(originalRequest)
            } else {
                console.log('Refresh token error: ', res)
            }
        }).catch(error => {
            console.log('Request new token error:', error)
            window.history.pushState({}, '', '/login/')
            window.history.go(0)
            }
        )
    }
    return Promise.reject(error)
})

export default authAxios
