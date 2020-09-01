import StaffEndpoint from "services/endpoints/StaffEndpoint"
import {IStaff} from 'types/model/staff'
import {
    STAFF_CLEAR_ERROR,
    STAFF_DELETE_OK,
    STAFF_SET_ERROR,
    STAFF_LOAD_FINISH,
    STAFF_LOAD_START,
    STAFF_LOAD_SUCCESS,
    STAFF_UPDATE_OBJECT,
    STAFF_ITEM_SUCCESS
} from "./types";
import authAxios from "../../services/axios-api";
import {NEW_RECORD_VALUE} from "../../utils/AppConst";
import {showInfoMessage} from "./infoAction";


//FIXME Вынести управление ошибками и сообщениями в стор ошибок

/**
 * Загрузить список продукции
 * @param search поисковая строка
 * @param limit лимит вывода
 * @param offset сдвиг
 */
export function loadStaffs(search?: string, limit?: number, offset?: number) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStaff[] = [];
        dispatch(fetchStart());
        try{
            const url = StaffEndpoint.getStaffList(search, limit, offset);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push(response.data[key])
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
            const response = await authAxios.delete(StaffEndpoint.deleteItem(id));
            if (response.status === 204) {
                const items = [...getState().staff.staffs];
                const index = items.findIndex((elem)=>{return elem.id === id});
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
export function loadStaffItem(id: number){
    return async (dispatch: any, getState: any) => {
        let item: IStaff = {id: 0, name: ""};
        dispatch(fetchStart());
        if (id === NEW_RECORD_VALUE) {
            dispatch(rawLoadItemSuccess(item))
        }else {
            try {
                const response = await authAxios.get(StaffEndpoint.getStaffItem(id));
                item = response.data
                dispatch(rawLoadItemSuccess(item))
            } catch (e) {
                dispatch(fetchError(e))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Добавить новую запись должности
 * @param item Объект записи
 */
export function addNewStaff(item: IStaff) {
    return async (dispatch: any, getState: any) => {
        dispatch(clearError());
        try{
            const response = await authAxios.post(StaffEndpoint.newStaff(), item)
            const items: IStaff[] = [...getState().staff.staffs]
            items.push({...item, 'id': response.data['id']})
            items.sort(function (a, b) {
                const nameA=a.name.toLowerCase()
                const nameB=b.name.toLowerCase()
                if (nameA < nameB) //сортируем строки по возрастанию
                    return -1
                if (nameA > nameB)
                    return 1
                return 0 // Никакой сортировки
            })
            dispatch(fetchSuccess(items))
            return Promise.resolve()
        }catch (e) {
            console.log('Error update staff. Error:', e.toString())
            const  errorMessage = `Не удалось добавить новую должность по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            return Promise.reject()
        }
    }
}

export function changeItem(item: IStaff) {
    return {
        type: STAFF_UPDATE_OBJECT,
        item: item
    }
}

/**
 * Сохранить изменения
 * @param item Объект
 */
export function updateStaffItem(item: IStaff) {
    return async (dispatch: any, getState: any) => {
        try{
            await authAxios.put(StaffEndpoint.saveStaff(item.id), item)
            return Promise.resolve()
        }catch (e) {
            console.log('Error update staff. Error:', e.toString())
            const  errorMessage = `Не удалось сохранить изменения по причине: ${e.response.data.message}`
            dispatch(showInfoMessage('error', errorMessage))
            return Promise.reject()
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

function deleteOk(items: IStaff[]) {
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

function fetchSuccess(items: IStaff[]) {
    return{
        type: STAFF_LOAD_SUCCESS,
        items
    }
}

function rawLoadItemSuccess(item: IStaff) {
    return{
        type: STAFF_ITEM_SUCCESS,
        item: item
    }
}
