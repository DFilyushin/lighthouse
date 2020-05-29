import {Staff} from "./staff";

export interface IEmployeeListItem {
    id: number;
    tabNum: string;
    fio: string;
    staff: string;
}

export const nullEmployeeItem = {
    id: 0,
    tabNum: '',
    fio: '',
    staff: ''
};

export interface IEmployee {
    id: number;
    created: string;
    tabNum: string;
    fio: string;
    dob: string;
    iin: string;
    docType: number;
    docDate: string;
    docAuth: string;
    docNum: string;
    addrRegistration: string;
    addrResidence: string;
    contactPhone: string;
    contactEmail: string;
    staff: Staff
}

export const nullEmployee = {
    id: 0,
    created: '',
    tabNum: '',
    fio: '',
    iin: '',
    dob: '',
    docType: 0,
    docDate: '',
    docAuth: '',
    docNum: '',
    addrRegistration: '',
    addrResidence: '',
    contactEmail: '',
    contactPhone: '',
    staff: {id: 0, name: ''}
};

export const docType = [
    {
        value: 0,
        label: 'УДЛ'
    },
    {
        value: 1,
        label: 'Паспорт гражданина РК'
    },
    {
        value: 2,
        label: 'Паспорт иностранного гражданина'
    }
];