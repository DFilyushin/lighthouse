import StoreEndpoint from "services/endpoints/StoreEndpoint"
import axios from "axios"
import {
    IStoreJournal,
    IStoreJournalItem,
    IStoreMaterialItem,
    IStoreNewMovement,
    IStoreProduct,
    IStoreRaw
} from "../../types/model/store"
import {
    STORE_CLEAR_ERROR,
    STORE_LOAD_FINISH,
    STORE_LOAD_PRODUCT_SUCCESS,
    STORE_LOAD_RAW_SUCCESS,
    STORE_LOAD_START,
    STORE_SET_ERROR,
    STORE_JOURNAL_SUCCESS,
    STORE_JOURNAL_ITEM_SUCCESS,
    STORE_CHANGE_ITEM,
    STORE_NEW_MOVEMENT,
    STORE_NEW_MOVEMENT_ITEM,
    STORE_ITEM_MOVEMENT_DELETE,
    STORE_ITEM_MOVEMENT_CHANGE
} from "./types"
import CostEndpoint from "services/endpoints/CostEndpoint"
import {nullEmployeeItem} from "../../types/model/employee"
import {getRandomInt, MAX_RANDOM_VALUE} from "../../utils/AppUtils"
import {nullTare} from "../../types/model/tare"
import AuthenticationService from "../../services/Authentication.service"
import {showInfoMessage} from "./infoAction"


/**
 * Загрузить актуальное состояние склада сырья
 */
export function loadRawStore() {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreRaw[] = [];
        dispatch(fetchStart());
        try{
            const dateStore = getState().store.rawStoreOnDate;
            console.log('state', getState().store);
            const url = StoreEndpoint.getStoreRaw(dateStore);
            console.log('url', url);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push(response.data[key])
            });
            dispatch(fetchSuccessRawStore(itemList))
        }catch (e) {
            if (e.response) {
                console.log(e.response)
                dispatch(fetchError(`Ошибка загрузки списка! Сообщение: ${e.response.statusText}`))
            }else{
                dispatch(fetchError(`Ошибка загрузки списка!`))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить состояние склада готовой продукции на выбранную дату
 */
export function loadProductStore() {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreRaw[] = [];
        dispatch(fetchStart());
        try{
            const dateStore = getState().store.rawStoreOnDate;
            console.log('state', getState().store);
            const url = StoreEndpoint.getStoreProduct(dateStore);
            console.log('url', url);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push(response.data[key])
            });
            dispatch(fetchSuccessProductStore(itemList))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки списка!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить журнал складских операций
 */
export function loadStoreJournal(date1: string, date2: string, operType: number, materialType: number) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreJournal[] = [];
        dispatch(fetchStart());
        try{
            const url = StoreEndpoint.getStoreJournal(date1.slice(0,10), date2.slice(0, 10), operType, materialType);
            const response = await axios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                const item: IStoreJournal = {
                    id: response.data[key]['id'],
                    count: response.data[key]['value'],
                    date: response.data[key]['date'],
                    tare: response.data[key]['tareId'],
                    name: response.data[key]['materialId']['name'],
                    type: response.data[key]['type'],
                    employee: response.data[key]['employee'],
                    price: response.data[key]['price'],
                    total: 0,
                    factoryId: response.data[key]['factoryId'],
                    costId: response.data[key]['costId'],
                    material: response.data[key]['materialId']
                }
                itemList.push(item)
            });
            dispatch(fetchSuccessJournal(itemList))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки журнала!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Изменение записи
 * @param item Объект складской записи
 */
export function changeStoreItem(item: IStoreJournalItem) {
    return{
        type: STORE_CHANGE_ITEM,
        item
    }
}

/**
 * Сохранить изменения в БД
 * @param item
 */
export function updateStoreItem(item: IStoreJournalItem) {
    return async (dispatch: any, getState: any) => {
        try{
            await axios.put(CostEndpoint.updateCost(item.id), item);
        }catch (e) {
            dispatch(fetchError(e.toString()))
        }
    }
}

/**
 * Загрузить одну запись журнала складских операций
 * @param id Код записи
 */
export function loadStoreItem(id: number) {
    return async (dispatch: any, getState: any) => {
        dispatch(fetchStart());
        try{
            const url = StoreEndpoint.getStoreItem(id);
            const response = await axios.get(url);
                const item: IStoreJournalItem = {
                    id: response.data['id'],
                    count: response.data['value'],
                    date: response.data['date'],
                    tare: response.data['tareId'],
                    material: response.data['materialId'],
                    name: response.data['materialId']['name'],
                    type: response.data['type'],
                    creator: response.data['employee'],
                    created: response.data['created'],
                    price: response.data['price'],
                    total: 0,
                    factoryId: response.data['factoryId'],
                    costId: response.data['costId'],
                    factory: response.data['factory']
                }
            dispatch(fetchSuccessJournalItem(item))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки журнала!'))
        }
        dispatch(fetchFinish())
    }
}

function fetchSuccessJournalItem(item: IStoreJournalItem) {
    return{
        type: STORE_JOURNAL_ITEM_SUCCESS,
        item
    }
}

function fetchSuccessJournal(items: IStoreJournal[]) {
    return{
        type: STORE_JOURNAL_SUCCESS,
        items
    }
}

function fetchStart() {
    return{
        type: STORE_LOAD_START
    }
}

function fetchFinish() {
    return{
        type: STORE_LOAD_FINISH
    }
}

function fetchSuccessRawStore(items: IStoreRaw[]) {
    return{
        type: STORE_LOAD_RAW_SUCCESS,
        items
    }
}

function fetchSuccessProductStore(items: IStoreProduct[]) {
    return{
        type: STORE_LOAD_PRODUCT_SUCCESS,
        items
    }
}

function fetchError(error: string) {
    return{
        type: STORE_SET_ERROR,
        error
    }
}

export function clearStoreError() {
    return{
        type: STORE_CLEAR_ERROR
    }
}


/**
 * Сформировать новую запись для добавления в журнал сырья
 */
export function newStoreMovement() {
    return{
        type: STORE_NEW_MOVEMENT,
        item: {
            date: (new Date()).toISOString().slice(0, 10),
            employee: {...nullEmployeeItem},
            items: [],
            comment: ''
        }
    }
}

/**
 * Добавить новую позицию в список добавляемых записей
 * @param item
 */
export function addNewRecordToStoreMovement(item: IStoreNewMovement) {
    const newItem = {...item}
    const newItems = [...item.items]
    newItems.push({
        id: -getRandomInt(MAX_RANDOM_VALUE),
        material: {id: 0, name: ''},
        count: 0,
        price: 0,
        total:0,
        tare: {...nullTare}
    })
    newItem.items = newItems
    console.log(newItem)
    return{
        type: STORE_NEW_MOVEMENT_ITEM,
        item: {...newItem}
    }
}


/**
 * Удалить одну запись из списка на приход
 * @param id Код записи
 */
export function deleteRecordFromStoreMovement(id: number) {
    return async (dispatch: any, getState: any) => {
        const newItem = {...getState().store.storeMovement}
        const findIndex = newItem.items.findIndex((item: IStoreMaterialItem, index: number, array: IStoreMaterialItem[])=>{ return item.id === id })
        newItem.items.splice(findIndex, 1);
        dispatch(deleteItemMovement(newItem))
    }
}


function deleteItemMovement(item: IStoreNewMovement) {
    return{
        type: STORE_ITEM_MOVEMENT_DELETE,
        item
    }
}

/**
 * Изменение значений записи из списка на приход
 * @param id Код записи
 * @param item ОБъект значения
 */
export function changeItemMovement(id: number, item: IStoreMaterialItem) {
    return async (dispatch: any, getState: any) => {
        const newItem = {...getState().store.storeMovement}
        const findIndex = newItem.items.findIndex((item: IStoreMaterialItem, index: number, array: IStoreMaterialItem[])=>{return item.id === id})
        newItem.items[findIndex] = item
        dispatch(changeItemMovementElement(newItem))
    }
}

export function updateItemMovement(item: IStoreNewMovement) {
    return async (dispatch: any, getState: any) => {
        dispatch(changeItemMovementElement(item))
    }
}

function changeItemMovementElement(item: IStoreNewMovement) {
    return {
        type: STORE_ITEM_MOVEMENT_CHANGE,
        item
    }
}

/**
 * Сохранить изменения по приходу сырья на склад
 */
export function saveRawMovement() {
    return async (dispatch: any, getState: any) => {
        const storeMovement = {...getState().store.storeMovement} as IStoreNewMovement
        let data = {
            'date': storeMovement.date,
            'employee': AuthenticationService.currentEmployeeId(),
            'comment': storeMovement.comment,
            'items': storeMovement.items.map((value: IStoreMaterialItem)=> {
                return(
                    {
                    'material': value.material.id,
                    'tare': value.tare.id,
                    'count': value.count,
                    'price': value.price
                    }
                )
            })
        }
        console.log(JSON.stringify(data))
        const url = StoreEndpoint.addRawStoreItems()
        try{
            await axios.post(url, data)
            dispatch(showInfoMessage('info', 'Данные обработаны'))
            return Promise.resolve()
        }catch (e) {
            dispatch(showInfoMessage('error', e.response.toString()))
            return Promise.reject()
        }

    }
}