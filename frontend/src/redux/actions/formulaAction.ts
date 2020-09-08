import FormulaEndpoint from "services/endpoints/FormulaEndpoint"
import {IFormula, IFormulaItem, IFormulaSelectedItem, IRawInFormula, nullFormulaItem} from 'types/model/formula'
import { showInfoMessage, hideInfoMessage } from './infoAction'
import {
    FORMULA_DELETE_OK,
    FORMULA_LOAD_FINISH,
    FORMULA_LOAD_START,
    FORMULA_LOAD_SUCCESS,
    FORMULA_ITEM_SUCCESS,
    FORMULA_UPDATE_OBJECT,
    FORMULA_SET_ERROR, FORMULA_GET_REFERENCE
} from "./types";
import {IRaw} from "types/model/raw";
import {getRandomInt, MAX_RANDOM_VALUE} from "../../utils/AppUtils";
import {FORMULA_DEFAULT_CALC_AMOUNT, FORMULA_DEFAULT_RAW_CONCENTRATION, NEW_RECORD_VALUE} from "utils/AppConst";
import moment from "moment";
import authAxios from "../../services/axios-api";


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
                const response = await authAxios.get(url);
                Object.keys(response.data).forEach((key, index) => {
                    formulaList.push({
                        id: response.data[key]['id'],
                        product: response.data[key]['product'],
                        amount: response.data[key]['calcAmount'],
                        created: moment(response.data[key]['created']).format('DD/MM/YYYY')
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
 * Загрузить список формул по коду продукта
 * @param byProduct Код продукта
 */
export function loadFormulaReference(byProduct: string) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart())
        dispatch(hideInfoMessage())
        const result: IFormulaSelectedItem[] = []
        try {
            const url = FormulaEndpoint.getFormulaList();
            const formulaList: IFormula[] = [];
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index) => {
                formulaList.push({
                    id: response.data[key]['id'],
                    product: response.data[key]['product'],
                    amount: response.data[key]['calcAmount'],
                    created: response.data[key]['created']
                })
            });
            formulaList.filter((value => value.product === byProduct)).forEach((value => {
                result.push({
                    id: value.id,
                    name: `№${value.id}  ${value.product}`
                })
            }))
            dispatch(loadFormulaReferenceOk(result))
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
        let formula: IFormulaItem = {
            ...nullFormulaItem,
            calcAmount: FORMULA_DEFAULT_CALC_AMOUNT, // рассчитаываемое значение по умолчанию
            raws: []
        };
        dispatch(fetchStart());
        if (id === NEW_RECORD_VALUE){
            dispatch(fetchItemSuccess(formula))
        }else {

            try {
                const response = await authAxios.get(FormulaEndpoint.getFormulaItem(id));
                formula = response.data
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
            const response = await authAxios.delete(FormulaEndpoint.deleteFormula(id));
            if (response.status === 204) {
                const formulas = [...getState().formula.formulas];
                const index = formulas.findIndex((elem)=>{return elem.id === id});
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

function loadFormulaReferenceOk(items: IFormulaSelectedItem[]) {
    return{
        type: FORMULA_GET_REFERENCE,
        items
    }
}

export function changeFormula(item: IFormulaItem) {
    return{
        type: FORMULA_UPDATE_OBJECT,
        item
    }
}

/**
 * Добавление пустой записи в спецификацию рецептуры
 */
export function addNewRawItem() {
    return async (dispatch: any, getState: any) => {
        const item = {...getState().formula.formulaItem};
        const itemRaw: IRawInFormula = {
            id: -getRandomInt(MAX_RANDOM_VALUE),
            raw_value: 0,
            substance: 0,
            concentration: FORMULA_DEFAULT_RAW_CONCENTRATION,
            raw: {id: 0, name: ''},
            unit: {id: 0, name: ''}
        };
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
            await authAxios.put(FormulaEndpoint.saveFormula(item.id), clone);
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
            let newItem = JSON.parse(JSON.stringify(item))
            delete(newItem.product)
            newItem.product = item.product.id
            newItem.tare = 1
            await authAxios.post(FormulaEndpoint.newFormula(), newItem);
        }catch (e) {
            dispatch(saveError(e.toString()))
            throw e
        }
    }
}

/**
 * Обновить запись о сырье в рецептуре
 * @param rawItemFormula Объект  записи
 */
export function updateRawItem(rawItemFormula: IRawInFormula) {
    return async (dispatch: any, getState: any)=> {
        const formula = {...getState().formula.formulaItem};
        const index = formula.raws.findIndex((elem: IRaw)=>{return elem.id === rawItemFormula.id})
        formula.raws[index].raw = rawItemFormula.raw
        formula.raws[index].raw_value = rawItemFormula.raw_value
        formula.raws[index].substance = rawItemFormula.substance
        formula.raws[index].concentration = rawItemFormula.concentration
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
        const index = formula.raws.findIndex((elem:IRaw)=> {return elem.id === idRaw})
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
