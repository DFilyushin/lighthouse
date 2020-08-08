import {ICost, ICostSimple} from "../model/cost";

export interface ICostState {
    items: ICost[];
    costItem: ICost;
    costFlatItems: ICostSimple[];
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