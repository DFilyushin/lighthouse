import {IClientItem, nullClientItem} from "./client";
import {IProduct, nullProduct} from "./product";
import {ITare, nullTare} from "./tare";
import {IEmployeeListItem, nullEmployeeItem} from "./employee";
import {IStoreListReserveProduct} from "./store";

/**
 * Статусы контрактов
 */
export const CONTRACT_UNDEFINED_STATE = -1
export const CONTRACT_STATE_DRAFT = 1
export const CONTRACT_STATE_ACTIVE = 2
export const CONTRACT_STATE_READY = 3


export interface IContractListItemSimple {
    id: number;
    num: string;
    date: string;
    client: string;
}

export const nullContractListItemSimple: IContractListItemSimple = {
    id: 0,
    num: '',
    date: '',
    client: ''
}

export interface IContractListItem {
    /**
     * Код контракта
     */
    id: number;
    /**
     * Номер контракта
     */
    num: string;
    /**
     * Клиент
     */
    clientName: string;
    /**
     * Дата заключения контракта
     */
    contractDate: string;
    /**
     * Ожидаемая доставка
     */
    estDelivery: string;
    /**
     * Код статуса контракта
     */
    status: number;
    /**
     * Сумма контракта полная
     */
    sum: number;
    /**
     * Оплачено по контракту
     */
    payed: number;
}

export interface IPaymentContractItem {
    id: number;
    created: string;
    date: string;
    num: string;
    type: string;
    value: number;
}

export interface IWaitPaymentContractItem {
    id: number;
    created: string | null;
    waitDate: string;
    waitSum: number;
}

/**
 * Интерфейс разрешённого доступа сотрудников к контракту
 */
export interface IContractManagerAccess {
    /**
     * код записи
     */
    id: number;
    /**
     * код сотрудника
     */
    employeeId: number;
    /**
     * ФИО сотрудника
     */
    employeeFio: string;
    /**
     * Период действия
     */
    toDate: string | null;
}

export const nullContractManagerAccess: IContractManagerAccess = {
    id: 0,
    employeeId: 0,
    employeeFio: '',
    toDate: null
}

export const nullWaitPaymentContractItem: IWaitPaymentContractItem = {
    id: 0,
    created: null,
    waitDate: '',
    waitSum: 0
}

export const nullContractItem: IContract = {
    id: 0,
    num: '',
    client: {...nullClientItem},
    contractDate: (new Date()).toISOString().slice(0, 10),
    delivered: '',
    contractState: CONTRACT_STATE_DRAFT,
    comment: '',
    created: '',
    discount: 0,
    contractId: '',
    estDelivery: '',
    agent: nullEmployeeItem,
    deliveryTerms: '',
    specs: [],
    payments: [],
    waitPayments: [],
    employeeAccess: [],
    reserveProducts: []
};

export const nullContractSpecItem : IContractSpecItem = {
    id: 0,
    product: {...nullProduct},
    tare: nullTare,
    itemCount: 0,
    itemPrice: 0,
    itemNds: 0,
    itemTotal: 0,
    itemDiscount: 0,
    delivered: null,
    delivery: null,
    specNum: '',
    specDate: '',
    returned: null,
    returnCause: null,
    returnValue: 0
}

/**
 * Спецификация контракта
 */
export interface IContractSpecItem {
    /**
     * Код записи
     */
    id: number;
    /**
     * Продукция
     */
    product: IProduct;
    /**
     * Тара
     */
    tare: ITare;
    /**
     * Количество
     */
    itemCount: number;
    /**
     * Цена
     */
    itemPrice: number;
    /**
     * НДС
     */
    itemNds: number;
    /**
     * Сумма позиции
     */
    itemTotal: number;
    /**
     * Скидка по позиции
     */
    itemDiscount: number;
    /**
     * Плановая дата доставки
     */
    delivery: string|null;
    /**
     * Дата фактической поставки
     */
    delivered: string|null;
    /**
     * Номер спецификации
     */
    specNum: string;
    /**
     * Дата спецификации
     */
    specDate: string;
    /**
     * Дата возврата позиции
     */
    returned: string|null;
    /**
     * Причина возврата
     */
    returnCause: string|null;
    /**
     * Количество возврата
     */
    returnValue: number;
}


/**
 * Интерфейс контракта
 */
export interface IContract {
    /**
     * Код записи
     */
    id: number;
    /**
     * Дата создания записи
     */
    created: string | undefined;
    /**
     * Клиент
     */
    client: IClientItem;
    /**
     * Номер контракта
     */
    num: string;
    /**
     * Дата контракта
     */
    contractDate: string;
    /**
     * Текущее состояние контракта
     */
    contractState: number;
    /**
     * Ожидаемая доставка контракта
     */
    estDelivery: string;
    /**
     * Дата доставка фактическая
     */
    delivered: string | null;
    /**
     * % скидки на контракт
     */
    discount: number;
    /**
     * Комментарий
     */
    comment: string;
    /**
     * Внутренний номер контракта
     */
    contractId: string;
    /**
     * Агент
     */
    agent: IEmployeeListItem;
    /**
     * Условия поставки
     */
    deliveryTerms: string;
    /**
     * Спецификации контракта
     */
    specs: IContractSpecItem[];
    /**
     * Поступившие платежи
     */
    payments: IPaymentContractItem[];
    /**
     * График платежей
     */
    waitPayments: IWaitPaymentContractItem[];
    /**
     * Список сотрудников, которые могу просматривать контракт
     */
    employeeAccess: IContractManagerAccess[];
    /**
     * Резерв продукции по контракту
     */
    reserveProducts: IStoreListReserveProduct[];
}

export const ContractStateString = [
    '',
    'Черновик',
    'Действующий',
    'Исполненный'
];

export const CONTRACT_STATE_ITEMS = [
    {id: CONTRACT_STATE_DRAFT, name: 'Черновик'},
    {id: CONTRACT_STATE_ACTIVE, name: 'В работе'},
    {id: CONTRACT_STATE_READY, name: 'Исполненные'}
]
