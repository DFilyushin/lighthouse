import {IStaff, nullStaff} from "./staff";
import {IWork} from "./work";

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

export interface IEmployeeWorkTimeItem {
    id: number;
    employee: IEmployeeListItem;
    product: string;
    line: string;
    periodStart: string;
    periodEnd: string;
    work: IWork;
    hours: number;
}

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
    staff: IStaff
}

export const nullEmployee = {
    id: 0,
    created: '',
    tabNum: '',
    fio: '',
    iin: '',
    dob: (new Date()).toISOString().slice(0, 10),
    docType: 0,
    docDate: (new Date()).toISOString().slice(0, 10),
    docAuth: '',
    docNum: '',
    addrRegistration: '',
    addrResidence: '',
    contactEmail: '',
    contactPhone: '',
    staff: {...nullStaff}
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