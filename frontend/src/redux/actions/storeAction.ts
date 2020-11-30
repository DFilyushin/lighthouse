import StoreEndpoint from "services/endpoints/StoreEndpoint"
import {
    IStoreJournal,
    IStoreJournalItem,
    IStoreListReserveProduct,
    IStoreMaterialItem,
    IStoreNewMovement,
    IStoreProduct,
    IStoreRaw,
    IStoreReserveProduct, IStoreReturnProduct,
    IStoreStock
} from "../../types/model/store"
import {
    STORE_CHANGE_ITEM,
    STORE_CLEAR_ERROR,
    STORE_ITEM_MOVEMENT_CHANGE,
    STORE_ITEM_MOVEMENT_DELETE,
    STORE_JOURNAL_ITEM_SUCCESS,
    STORE_JOURNAL_MATERIAL_SUCCESS,
    STORE_JOURNAL_SUCCESS,
    STORE_LOAD_FINISH,
    STORE_LOAD_PRODUCT_SUCCESS,
    STORE_LOAD_RAW_SUCCESS,
    STORE_LOAD_START,
    STORE_LOAD_STOCK_SUCCESS,
    STORE_NEW_MOVEMENT,
    STORE_NEW_MOVEMENT_ITEM,
    STORE_RESERVE_CHANGE_ITEM,
    STORE_RESERVE_LOAD_ITEM_SUCCESS,
    STORE_RESERVE_LOAD_SUCCESS,
    STORE_RESERVE_NEW_ITEM, STORE_RETURNS_LOAD_ITEM_SUCCESS,
    STORE_SET_ERROR
} from "./types"
import CostEndpoint from "services/endpoints/CostEndpoint"
import {nullEmployeeItem} from "../../types/model/employee"
import {addDays, getRandomInt, MAX_RANDOM_VALUE} from "../../utils/AppUtils"
import {nullTare} from "../../types/model/tare"
import AuthenticationService from "../../services/Authentication.service"
import {showInfoMessage} from "./infoAction"
import authAxios from "../../services/axios-api";
import {IContract} from "../../types/model/contract";
import {TypeOperationStore} from "../../utils/AppConst";

/**
 * Загрузить актуальное состояние склада ТМЦ
 */
export function loadStockStore(search?: string) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreStock[] = [];
        dispatch(fetchStart());
        try{
            const dateStore = getState().store.stockStoreOnDate;
            const url = StoreEndpoint.getStoreStock(dateStore, search);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push(response.data[key])
            });
            dispatch(fetchSuccessStockStore(itemList))
        }catch (e) {
            if (e.response) {
                dispatch(fetchError(`Ошибка загрузки списка! Сообщение: ${e.response.statusText}`))
            }else{
                dispatch(fetchError(`Ошибка загрузки списка!`))
            }
        }
        dispatch(fetchFinish())
    }
}

/**
 * Загрузить актуальное состояние склада сырья
 */
export function loadRawStore(search?: string) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreRaw[] = [];
        dispatch(fetchStart());
        try{
            const dateStore = getState().store.rawStoreOnDate;
            const url = StoreEndpoint.getStoreRaw(dateStore, search);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                itemList.push(response.data[key])
            });
            dispatch(fetchSuccessRawStore(itemList))
        }catch (e) {
            if (e.response) {
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
export function loadProductStore(search?: string) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreRaw[] = [];
        dispatch(fetchStart());
        try{
            const dateStore = getState().store.rawStoreOnDate;
            const url = StoreEndpoint.getStoreProduct(dateStore, search);
            const response = await authAxios.get(url);
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
 * Загрузить список резервирования продукции
 */
export function loadStoreReserveList(search?: string) {
    return async (dispatch: any, getState: any)=> {
        const items: IStoreListReserveProduct[] = []
        dispatch(fetchStart())

        try{
            const url = StoreEndpoint.getProductReserved(search);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                items.push(response.data[key])
            });
            dispatch(fetchSuccessLoadReserveList(items))
        }catch (e) {
            dispatch(fetchError('Ошибка загрузки списка!'))
        }
        dispatch(fetchFinish())
    }
}

/**
 * Удалить продукцию из резерва
 * @param id Код резерва
 */
export function deleteReserve(id: number) {
    return async (dispatch: any, getState: any)=> {
        dispatch(fetchStart())
        try{
            const url = StoreEndpoint.deleteProductReserve(id);
            console.log(url)
            await authAxios.delete(url);
            const items = [...getState().store.storeReservedList]
            const findIndex = items.findIndex((item: IStoreListReserveProduct)=>{ return item.id === id })
            items.splice(findIndex, 1)
            dispatch(fetchSuccessLoadReserveList(items))
        }catch (e) {
            dispatch(fetchError('Ошибка удаления записи!'))
        }
        dispatch(fetchFinish())
    }
}

function fetchSuccessLoadReserveList(items: IStoreListReserveProduct[]) {
    return{
        type: STORE_RESERVE_LOAD_SUCCESS,
        items
    }
}

/**
 * Загрузить журнал складских операций
 * @param date1 Начальная дата формирования журнала
 * @param date2 Конечная дата формирования журнала
 * @param operType Тип операции (приход, расход)
 * @param materialType Тип материала (сырьё, продукция)
 */
export function loadStoreJournal(date1: string, date2: string, operType: number, materialType: number) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreJournal[] = [];
        dispatch(fetchStart());
        try{
            const url = StoreEndpoint.getStoreJournal(date1.slice(0,10), date2.slice(0, 10), operType, materialType);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                const item: IStoreJournal = {
                    id: response.data[key]['id'],
                    count: response.data[key]['value'],
                    date: response.data[key]['date'],
                    tare: response.data[key]['tare'],
                    name: response.data[key]['material'],
                    type: response.data[key]['type'],
                    price: response.data[key]['price'],
                    total: 0,
                    factoryId: response.data[key]['factoryId'],
                    costId: response.data[key]['costId'],
                    tareV: response.data[key]['tare_v']
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
 * Загрузка журнала движения материала
 * @param material Код материала
 * @param onDate Дата, на которую формируется журнал
 */
export function loadStoreByMaterial(material: number, onDate: string) {
    return async (dispatch: any, getState: any) => {
        const itemList: IStoreJournal[] = [];
        dispatch(fetchStart());
        try{
            const url = StoreEndpoint.getStoreByMaterial(material, onDate);
            const response = await authAxios.get(url);
            Object.keys(response.data).forEach((key, index)=>{
                const item: IStoreJournal = {
                    id: response.data[key]['id'],
                    count: response.data[key]['value'],
                    date: response.data[key]['date'],
                    tare: response.data[key]['tare'],
                    name: response.data[key]['material'],
                    type: response.data[key]['type'],
                    price: response.data[key]['price'],
                    total: response.data[key]['value'],
                    factoryId: response.data[key]['factoryId'],
                    costId: response.data[key]['costId'],
                    tareV: response.data[key]['tare_v']
                }
                itemList.push(item)
            });
            dispatch(fetchSuccessJournalMaterial(itemList))
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
            await authAxios.put(CostEndpoint.updateCost(item.id), item);
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
            const response = await authAxios.get(url);
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

function fetchSuccessJournalMaterial(items: IStoreJournal[]) {
    return{
        type: STORE_JOURNAL_MATERIAL_SUCCESS,
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

function fetchSuccessStockStore(items: IStoreStock[]) {
    return{
        type: STORE_LOAD_STOCK_SUCCESS,
        items
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
        const findIndex = newItem.items.findIndex((item: IStoreMaterialItem)=>{ return item.id === id })
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
        const findIndex = newItem.items.findIndex((item: IStoreMaterialItem)=>{return item.id === id})
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
 * Движение материалов на складе
 */
export function materialMovementStore(operation: TypeOperationStore) {
    return async (dispatch: any, getState: any) => {
        const storeMovement = {...getState().store.storeMovement} as IStoreNewMovement
        let data = {
            'date': storeMovement.date.slice(0, 10),
            'employee': AuthenticationService.currentEmployeeId(),
            'comment': storeMovement.comment,
            'id_operation': operation,
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
        const url = StoreEndpoint.movementMaterial()
        try{
            await authAxios.post(url, data)
            dispatch(showInfoMessage('info', 'Данные обработаны'))
        }catch (e) {
            const errMessage = e.response.data.message
            const detailMessage = e.response.data.detail
            console.log(`Error save movement to store. Error message: ${errMessage}, detail: ${detailMessage}`)
            dispatch(showInfoMessage('error', errMessage))
            throw e
        }

    }
}

/**
 * Загрузить запись о резерве продукции
 * @param id
 */
export function getReserveItem(id: number) {
    return async (dispatch: any, getState: any) => {
        const url = StoreEndpoint.getReserveItem(id)
        try {
            const response = await authAxios.get(url)
            dispatch(fetchReserveItem(response.data))
        } catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }
}

/**
 * Получить возврат продукции по коду записи
 * @param id Код записи
 */
export function getStoreReturnItem(id: number) {
    return async (dispatch: any, getState: any) => {
        const url = StoreEndpoint.getStoreReturnItem(id)
        try {
            const response = await authAxios.get(url)
            dispatch(fetchStoreReturnItemSuccess(response.data))
        }catch (e) {
            dispatch(showInfoMessage('error', e.toString()))
        }
    }

}

function fetchStoreReturnItemSuccess(item: IStoreReturnProduct) {
    return{
        type: STORE_RETURNS_LOAD_ITEM_SUCCESS,
        item
    }
}

function fetchReserveItem(item: IStoreReserveProduct) {
    return{
        type: STORE_RESERVE_LOAD_ITEM_SUCCESS,
        item
    }
}

/**
 * Добавить новый элемент резерва
 * @param id Код спецификации в контракте
 */
export function addNewReserveByContractSpecPosition(id: number) {
    return async (dispatch: any, getState: any) => {
        const contractItem: IContract = {...getState().contract.contractItem}
        const daysReserveInterval: number = getState().setup.reserveInterval
        console.log(daysReserveInterval)
        const specIndex = contractItem.specs.findIndex(item => item.id === id)
        const specItem = contractItem.specs[specIndex]
        const currentDate = (new Date()).toISOString().slice(0, 10)
        const reserveItem: IStoreReserveProduct = {
            id: 0,
            value: specItem.itemCount,
            tare: specItem.tare,
            contract: {
                id: contractItem.id,
                client: contractItem.client.clientName,
                date: contractItem.contractDate,
                num: contractItem.num
            },
            employee: {
                id: AuthenticationService.currentEmployeeId(),
                fio: AuthenticationService.currentEmployee(),
                staff: '',
                tabNum: '',
                fired: ''
            },
            start: currentDate,
            end: addDays(currentDate, daysReserveInterval).toISOString().slice(0, 10),
            material: specItem.product
        }
        dispatch(fetchNewReserveItem(reserveItem))
    }
}

/**
 * Сохранить новый элемент резерва
 */
export function addReserveItem() {
    return async (dispatch: any, getState: any)=> {
        const newItem = {...getState().store.storeReserveItem}
        const url = StoreEndpoint.newReserveItem()
        try {
            await authAxios.post(url, newItem)
        }catch (e) {
            console.log('Error add new reserve item. Error message: ', e.response)
            throw e
        }
    }
}

/**
 * Обновить элемент резерва
 */
export function updateReserveItem() {
    return async (dispatch: any, getState: any)=> {
        const newItem = {...getState().store.storeReserveItem}
        const url = StoreEndpoint.updateReserveItem(newItem.id)
        try {
            await authAxios.put(url, newItem)
        }catch (e) {
            console.log('Error update reserve item. Error message: ', e.response)
            throw e
        }
    }
}

function fetchNewReserveItem(item: IStoreReserveProduct) {
    return{
        type: STORE_RESERVE_NEW_ITEM,
        item
    }
}


/**
 * Изменение элемента резерва
 * @param item
 */
export function changeReserveItem(item: IStoreReserveProduct) {
    return{
        type: STORE_RESERVE_CHANGE_ITEM,
        item: item
    }
}
