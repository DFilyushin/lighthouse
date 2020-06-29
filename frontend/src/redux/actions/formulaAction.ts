import axios from 'axios'
import FormulaEndpoint from "services/endpoints/FormulaEndpoint"
import {IFormula, IFormulaItem, IRawInFormula, nullFormulaItem} from 'types/model/formula'
import { showInfoMessage, hideInfoMessage } from './infoAction'
import {
    FORMULA_DELETE_OK,
    FORMULA_LOAD_FINISH,
    FORMULA_LOAD_START,
    FORMULA_LOAD_SUCCESS,
    FORMULA_ITEM_SUCCESS,
    FORMULA_UPDATE_OBJECT,
    FORMULA_SET_ERROR
} from "./types";
import {IRaw} from "types/model/raw";
import {getRandomInt, MAX_RANDOM_VALUE} from "../../utils/AppUtils";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";


/**
 * Загрузить список рецептур
 * @param search строка поиска
 * @param limit ограничение на загрузку
 * @param offset смещение
 */
export function loadFormula(search?: string, limit?: number, offset?:number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
            try {
                const url = FormulaEndpoint.getFormulaList(search, limit, offset);
                const formulaList: IFormula[] = [];
                const response = await axios.get(url);
                Object.keys(response.data).forEach((key, index) => {
                    formulaList.push({
                        id: response.data[key]['id'],
                        product: response.data[key]['product'],
                        amount: response.data[key]['calcAmount']
                    })
                });
                dispatch(fetchSuccess(formulaList))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
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
        if (id === NEW_RECORD_VALUE){
            dispatch(fetchItemSuccess(formula))
        }else {

            try {
                const response = await axios.get(FormulaEndpoint.getFormulaItem(id));
                formula.id = response.data['id']
                formula.specification = response.data['specification']
                formula.calcLosses = response.data['calcLosses']
                formula.product = response.data['product']
                formula.calcAmount = response.data['calcAmount']
                formula.raws = response.data['raws']
                dispatch(fetchItemSuccess(formula))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
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
                const formulas = [...getState().formula.formulas];
                const index = formulas.findIndex((elem, index, array)=>{return elem.id === id});
                formulas.splice(index, 1);
                dispatch(deleteOK(formulas));
            }
            else {
                dispatch(showInfoMessage('error', 'Не удалось удалить рецептуру!'))
            }
        }catch (e) {
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
    return{
        type: FORMULA_UPDATE_OBJECT,
        item
    }
}


export function addNewRawItem() {
    return async (dispatch: any, getState: any) => {
        const item = {...getState().formula.formulaItem};
        const itemRaw: IRawInFormula = {id: -getRandomInt(MAX_RANDOM_VALUE), raw_value: 0, raw: {id: 0, name: ''}};
        item.raws.push(itemRaw)
        dispatch(changeFormula(item))
    }
}

/**
 * Обновить данные
 * @param item Объект рецептуры
 */
export function updateFormula(item: IFormulaItem) {
    return async (dispatch: any, getState: any) => {
        try{
            var clone = JSON.parse(JSON.stringify(item))
            delete(clone.product)
            clone.product = item.product.id
            clone.tare = 1
            await axios.put(FormulaEndpoint.saveFormula(item.id), clone);
        }catch (e) {
            dispatch(saveError(e.toString()))
        }
    }
}

function saveError(e: string) {
    return{
        type: FORMULA_SET_ERROR,
        error: e
    }
}

/**
 * Добавить новую запись
 * @param item
 */
export function addNewFormula(item: IFormulaItem) {
    return async (dispatch: any, getState: any) => {
        try{
            var newItem = JSON.parse(JSON.stringify(item))
            delete(newItem.product)
            newItem.product = item.product.id
            newItem.tare = 1
            await axios.post(FormulaEndpoint.newFormula(), newItem);
        }catch (e) {
            dispatch(saveError(e.toString()))
            throw e
        }
    }
}

/**
 * Обновить запись о сырье в рецептуре
 * @param id Код записи
 * @param idRaw Код сырья
 * @param value Количество
 */
export function updateRawItem(rawItemFormula: IRawInFormula) {
    return async (dispatch: any, getState: any)=> {
        const formula = {...getState().formula.formulaItem};
        const index = formula.raws.findIndex((elem: IRaw, index:number, array: IRawInFormula[])=>{return elem.id === rawItemFormula.id})
        formula.raws[index].raw = rawItemFormula.raw
        formula.raws[index].raw_value = rawItemFormula.raw_value
        dispatch(changeFormula(formula));
    }
}

/**
 * Удалить запись о составе рецептуры
 * @param idRaw Код записи
 */
export function deleteRawItem(idRaw: number){
    return async (dispatch: any, getState: any) => {
        const formula = {...getState().formula.formulaItem};
        const index = formula.raws.findIndex((elem:IRaw, index: number, array: IRaw[])=> {return elem.id === idRaw})
        formula.raws.splice(index, 1)
        dispatch(changeFormula(formula))
    }
}

export function setFormulaError(text: string) {
    return {
        type: FORMULA_SET_ERROR,
        error: text
    }
}