import {ICost, ICostSimple} from "../model/cost";

export interface ICostState {
    items: ICost[];
    costItem: ICost;
    parentItems: ICostSimple[];
    isLoading: boolean;
    error: string;
    hasError: boolean
}

export const nullCost = {
    id: 0,
    name: '',
    childs: [],
    parent: 0
}