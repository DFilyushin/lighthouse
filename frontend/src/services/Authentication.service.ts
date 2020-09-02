import axios from 'axios';
import AuthEndpoint from './endpoints/AuthEndpoint';
import {AccessGroups} from "../utils/AppConst";


export default class AuthenticationService {

    /**
     * Аутентификация пользователя
     * @param login логин
     * @param password пароль
     */
    static async login(login: string, password: string) {
        const data = {
            username: login,
            password: password
        }
        try {
            const response = await axios.post(AuthEndpoint.getAuth(), data);

            if (response.status === 200) {
                let result = response.data;
                localStorage.setItem('token', result.access);
                localStorage.setItem('userName', login);
                localStorage.setItem('refresh', result.refresh)
                localStorage.setItem('groups', JSON.stringify(result.groups))
                localStorage.setItem('lastName', result.lastName)
                localStorage.setItem('firstName', result.firstName)
                localStorage.setItem('employee', result.employee)
                return true
            } else {
                return false
            }
        }catch (e) {
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
        return localStorage.getItem('userName') || ''
    }

    static currentEmployee() {
        const lastName = localStorage.getItem('lastName') || ''
        const firstName = localStorage.getItem('firstName') || ''
        return `${lastName} ${firstName}`
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
        const employee = localStorage.getItem('employee') || '0'
        return parseInt(employee)
    }

    /**
     * Список доступных групп
     */
    static getUserGroups(){
        const groups = localStorage.getItem('groups') || ''
        return JSON.parse(groups)
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
