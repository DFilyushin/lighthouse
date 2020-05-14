import axios from 'axios';
import AuthEndpoint from './endpoints/AuthEndpoint';
import { parseJwt } from 'utils/AppUtils';


export default class AuthenticationService {

    /**
     *
     * @param userName
     * @param password
     */
    static async login(userName: string, password: string) {
        let data = JSON.stringify({
            username: userName,
            password: password
        });
        let headers = {
            'Content-Type': 'application/json',
        };

        try {
            const response = await axios.post(AuthEndpoint.getAuth(), data, {headers});
            const json_data = response.data;
            if (json_data.status_code === 200) {
                console.log('Auth ok');
                localStorage.setItem('token', json_data.token);
                localStorage.setItem('userName', userName);
                return true;
            }
        } catch (error) {
            return false;
        }
    }

    static async login2(userName: string, password: string) {
        const data = JSON.stringify({
            username: userName,
            password: password
        });
        const headers = {
            'Content-Type': 'application/json',
        };
        const response = await fetch(AuthEndpoint.getAuth(), {
            method: 'POST',
            headers: headers,
            body: data
        });
        if (response.ok) {
            let result = await response.json();
            console.log('Auth ok');
            localStorage.setItem('token', result.token);
            localStorage.setItem('userName', userName);
            return true
        }
        else{
            return false
        }
    }

    /**
     * Выход из системы
     * @constructor
     */
    static logout() {
        localStorage.clear()
    }

    static currentUserName() {
        const token = localStorage.getItem('token') || '';
        const tokenObject = parseJwt(token);
        return tokenObject.username
    }

    static currentEmployee() {
        const token = localStorage.getItem('token') || '';
        const tokenObject = parseJwt(token);
        return `${tokenObject.lastName} ${tokenObject.firstName}`;
    }

    static isAuthenticated() {
        return !!AuthenticationService.currentUserName()
    }
}