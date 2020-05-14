import axios from 'axios'
import StaffEndpoint from "services/endpoints/StaffEndpoint"
import {Staff} from 'types/model/staff'
import {
    STAFF_CLEAR_ERROR,
    STAFF_DELETE_OK,
    STAFF_SET_ERROR,
    STAFF_LOAD_FINISH,
    STAFF_LOAD_START,
    STAFF_LOAD_SUCCESS,
    STAFF_UPDATE_OBJECT, STAFF_ITEM_SUCCESS
} from "./types";

//FIXME При добавлении и удалении не обновляется результирующий стор
//FIXME Вынести управление ошибками и сообщениями в стор ошибок

/**
 * Загрузить список продукции
 * @param search поисковая строка
 * @param limit лимит вывода
 * @param offset сдвиг
 */
export function loadStaffs(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        const itemList: Staff[] = [];
        dispatch(fetchStart());
        try{
            const url = StaffEndpoint.getStaffList(search, limit, offset);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push({
                    id: response.data[key]['id'],
                    name: response.data[key]['name'],
                })
            });
            dispatch(fetchSuccess(itemList))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки списка!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить должность
 * @param id Код записи
 */
export function deleteStaff(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const response = await axios.delete(StaffEndpoint.deleteItem(id));
            if (response.status === 204) {
                const items = [...getState().raw.raws];
                const index = items.findIndex((elem, index, array)=>{return elem.id === id});
                items.splice(index, 1);
                dispatch(deleteOk(items));
            }
            else {
                dispatch(fetchError('Не удалось удалить запись!'))
            }
        }catch (e) {
            dispatch(fetchError('Не удалось удалить запись!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить сырьё по коду
 * @param id Код сырья
 */
export function loadItem(id: number){
    return async (dispatch: any, getState: any) => {
        let item: Staff = {id: 0, name: ""};
        dispatch(fetchStart());
        try{
            const response = await axios.get(StaffEndpoint.getStaffItem(id));
            item.id = response.data['id'];
            item.name = response.data['name'];
            dispatch(rawLoadItemSuccess(item))
        }catch (e) {
            dispatch(fetchError(e))
        }
        dispatch(fetchFinish())
    }
}

export function addNew(item: Staff) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            console.log(item);
            await axios.post(StaffEndpoint.newStaff(), item);
            dispatch(rawLoadItemSuccess(item))
        }catch (e) {
            dispatch(fetchError('Не удалось добавить новую запись!'))
        }
    }
}

export function changeItem(item: Staff) {
    return {
        type: STAFF_UPDATE_OBJECT,
        item: item
    }
}

/**
 * Сохранить изменения
 * @param item Объект
 */
export function updateItem(item: Staff) {
    return async (dispatch: any, getState: any) => {
        try{
            await axios.put(StaffEndpoint.saveStaff(item.id), item);
        }catch (e) {
            dispatch(fetchError(e))
        }
    }
}


export function clearError() {
    return{
        type: STAFF_CLEAR_ERROR
    }
}
function fetchStart() {
    return {
        type: STAFF_LOAD_START
    }
}

function deleteOk(items: Staff[]) {
    return{
        type: STAFF_DELETE_OK,
        items
    }
}

function fetchFinish() {
    return {
        type: STAFF_LOAD_FINISH
    }
}

function fetchError(error: string) {
    return{
        type: STAFF_SET_ERROR,
        error: error
    }
}

function fetchSuccess(items: Staff[]) {
    return{
        type: STAFF_LOAD_SUCCESS,
        items
    }
}

function rawLoadItemSuccess(item: Staff) {
    return{
        type: STAFF_ITEM_SUCCESS,
        item: item
    }
}
