
export const MAX_RANDOM_VALUE = 100000;

/**
 * Преобразовать токен в объект
 * @param token
 */
export function  parseJwt (token: string) {
    if (token === '') {return {}}
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

/**
 * Случайное значение
 * @param max Максимальное значение
 */
export function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
}

/**
 * Проверка валидности email
 * @param email Текстовая строка с почтовым адресом
 */
export function validateEmail(email: string) {
    //eslint-disable-next-line
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Проверка строки на латинские строки
 * @param text Входная строка
 */
export function validateLatin(text: string) {
    const re = /^(?=[a-zA-Z0-9._]{4,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/
    return re.test(String(text.toLowerCase()))
}

/**
 * Округление значения до сотых
 * @param value
 * @constructor
 */
export function RoundValue(value: number) {
    return Math.round((value + Number.EPSILON) * 100) / 100
}

/**
 * Начало текущего месяца
 */
export function getStartCurrentMonthDate() {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
}

/**
 * Генерация случайной строки
 * @param length Длина строки
 */
export function makeRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@$_-=+';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Добавление к дате дней
 * @param date Дата в строковом формате
 * @param days Число дней
 */
export function addDays(date: string, days: number) {
    let result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

/**
 * Получить текущую дату в формате строки
 */
export function getCurrentDate() {
    return (new Date()).toISOString().slice(0, 10)
}
