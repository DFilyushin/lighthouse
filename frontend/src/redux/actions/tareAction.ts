import {hideInfoMessage, showInfoMessage} from "./infoAction";
import TareEndpoint from "services/endpoints/TareEndpoint";
import {ITare} from "../../types/model/tare";
import axios from "axios";
import {TARE_DELETE_OK, TARE_LOAD_FINISH, TARE_LOAD_START, TARE_LOAD_SUCCESS} from "./types";
import FormulaEndpoint from "../../services/endpoints/FormulaEndpoint";

const LS_TARE_KEY = 'tares'

export function loadTare(search?: string, limit?: number, offset?:number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        dispatch(hideInfoMessage())
        const tareInLocalStorage = localStorage.getItem(LS_TARE_KEY);
        if (tareInLocalStorage){
            const tareList = JSON.parse(tareInLocalStorage);
            dispatch(fetchSuccess(tareList))

        }else {
            try {
                const url = TareEndpoint.getTareList(search, limit, offset);
                const tareList: ITare[] = [];
                const response = await axios.get(url);
                Object.keys(response.data).forEach((key, index) => {
                    tareList.push({
                        id: response.data[key]['id'],
                        name: response.data[key]['name'],
                        unit: response.data[key]['unit'],
                        unitId: response.data[key]['unitId'],
                        v: response.data[key]['v']
                    })
                });
                localStorage.setItem(LS_TARE_KEY, JSON.stringify(tareList))
                dispatch(fetchSuccess(tareList))
            } catch (e) {
                dispatch(showInfoMessage('error', e.toString()))
            }
        }
        dispatch(fetchFinish())
    }
}

export function deleteTare(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(TareEndpoint.getDeleteTare(id));
            if (response.status === 204) {
                const items = [...getState().product.products];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
                localStorage.removeItem(LS_TARE_KEY)
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


function fetchStart() {
    return{
        type: TARE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: TARE_LOAD_FINISH
    }
}

function fetchSuccess(items: ITare[]) {
    return{
        type: TARE_LOAD_SUCCESS,
        items
    }
}

function deleteOk(items: ITare[]) {
    return{
        type: TARE_DELETE_OK,
        items
    }
}
