import axios from 'axios';
import AuthEndpoint from './endpoints/AuthEndpoint';
import {parseJwt} from 'utils/AppUtils';
import {AccessGroups} from "../utils/AppConst";


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

    /**
     * Признак аутентификации пользователя
     */
    static isAuthenticated() {
        return !!AuthenticationService.currentUserName()
    }

    /**
     * Код сотрудника
     */
    static currentEmployeeId(){
        const token = localStorage.getItem('token') || '';
        const tokenObject = parseJwt(token);
        return tokenObject.user_id
    }

    /**
     * Список доступных групп
     */
    static getUserGroups(){
        const token = localStorage.getItem('token') || '';
        const tokenObject = parseJwt(token);
        return tokenObject.groups
    }

    /**
     * Проверка нахождения групп пользователя в списке проверяемых групп
     * @param groups Проверяемые группы
     */
    static hasGroup(groups: AccessGroups[] | null){
        if (!groups) {return true}
        const user_groups = this.getUserGroups()
        const isAllAccess = Boolean(groups.includes(AccessGroups.ALL))
        const hasAccess = user_groups.filter( (item: AccessGroups) => groups.includes(item)).length > 0
        return isAllAccess || hasAccess
    }
}
