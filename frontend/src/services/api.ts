import axios from 'axios';
import Auth from './endpoints/auth';

export async function getDataAuth(url: string) {
    const loginUrl = '/login';


};

export function authUser(username: string, password: string) {
    const response = axios.post(Auth.getAuth())
};

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
}