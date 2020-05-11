import axios from 'axios'
import FormulaEndpoint from "services/endpoints/FormulaEndpoint"
import {IFormula, IFormulaItem, nullFormulaItem} from 'types/model/formula'
import { showInfoMessage, hideInfoMessage } from './infoAction'
import {
    FORMULA_DELETE_OK,
    FORMULA_LOAD_FINISH,
    FORMULA_LOAD_START,
    FORMULA_LOAD_SUCCESS,
    FORMULA_ITEM_SUCCESS
} from "./types";


const LS_FORMULA_KEY = 'formulas';

/**
 * Загрузить список рецепту
 * @param search строка поиска
 * @param limit ограничение на загрузку
 * @param offset смещение
 */
export function loadFormula(search?: string, limit?: number, offset?:number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        const formulasInLocal = localStorage.getItem(LS_FORMULA_KEY);
        if (formulasInLocal){
            console.log('GetByStorage');
            const formulaList = JSON.parse(formulasInLocal);
            dispatch(fetchSuccess(formulaList))

        }else {
            try {
                const url = FormulaEndpoint.getFormulaList(search, limit, offset);
                console.log('GetByApi');
                const formulaList: IFormula[] = [];
                const response = await axios.get(url);
                Object.keys(response.data).forEach((key, index) => {
                    formulaList.push({
                        id: response.data[key]['id'],
                        product: response.data[key]['product'],
                        amount: response.data[key]['calcAmount']
                    })
                });
                localStorage.setItem(LS_FORMULA_KEY, JSON.stringify(formulaList))
                dispatch(fetchSuccess(formulaList))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить объект рецептуры
 * @param id код рецептуры
 */
export function loadFormulaItem(id: number) {
    return async (dispatch: any, getState: any) => {
        let formula: IFormulaItem = nullFormulaItem;
        dispatch(fetchStart());
        try{
            const response = await axios.get(FormulaEndpoint.getFormulaItem(id));
            console.log(response.data);
            formula.id = response.data['id']
            formula.specification = response.data['specification']
            formula.calcLosses = response.data['calcLosses']
            formula.amount = response.data['amount']
            formula.product = response.data['product']
            formula.raws = response.data['raws']
            dispatch( fetchItemSuccess(formula))
            dispatch(showInfoMessage('error', 'Не удалось загрузить рецептуру!'))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить рецептуру
 * @param id код рецептуры
 */
export function deleteFormula(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(FormulaEndpoint.deleteFormula(id));
            if (response.status === 204) {
                const formulas = [...getState().product.products];
                const index = formulas.findIndex((elem, index, array)=>{return elem.id === id});
                formulas.splice(index, 1);
                dispatch(deleteOK(formulas));
                localStorage.removeItem(LS_FORMULA_KEY)
            }
            else {
                dispatch(showInfoMessage('error', 'Не удалось удалить рецептуру!'))
            }
        }catch (e) {
            console.log(e);
            dispatch(showInfoMessage('error', 'Не удалось удалить рецептуру!'))
        }
        dispatch(fetchFinish())
    }
}

function fetchSuccess(items: IFormula[]) {
    return{
        type: FORMULA_LOAD_SUCCESS,
        items: items
    }
}

function fetchItemSuccess(item: IFormulaItem) {
    return{
        type: FORMULA_ITEM_SUCCESS,
        item
    }
}

function fetchStart() {
    return{
        type: FORMULA_LOAD_START
    }
}

function fetchFinish(){
    return{
        type: FORMULA_LOAD_FINISH
    }
}

function deleteOK(items: IFormula[]) {
    return{
        type: FORMULA_DELETE_OK,
        items
    }
}

export function changeFormula(item: IFormulaItem) {

}

export function updateFormula(item: IFormulaItem) {

}

export function addNewFormula(item: IFormulaItem) {

}