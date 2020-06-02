export interface IContractListItem {
    id: number;
    num: string;
    clientName: string;
    contractDate: string;
    estDelivery: string;
    status: number;
    sum: number;
}

export interface IContract {
    id: number,
    created: string,
    clientName: string,
    contractNum: string,
    contractDate: string,
    deliveryDate: string,
    state: number,
    delivered: string,
    discount: number,
    comment: string,
}

export const ContractStateString = [
    '',
    'Черновик',
    'Действующий',
    'Исполненный'
];