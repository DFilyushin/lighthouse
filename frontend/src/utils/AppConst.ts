export const NEW_RECORD_VALUE = -1
export const NEW_RECORD_TEXT = 'new'

export const STORE_IN = 0
export const STORE_OUT = 1

export const MINUTES_30_TIMES = 1000 * 60 * 30 // 30 минут
export const FORMULA_DEFAULT_CALC_AMOUNT = 1000
export const FORMULA_DEFAULT_RAW_CONCENTRATION = 100

export const SELECT_RAW = 0
export const SELECT_PRODUCT = 1
export const SELECT_STOCK = 2

export enum AccessGroups {
    ALL = "all",
    ADMIN = "admin",
    FACTORY = "factory",
    MANAGER = "manager",
    TECHNOLOGIST = 'technologist',
    REPORT = 'report',
    BOSS = 'boss',
    FINANCE = 'finance',
    BUH = 'accountant'
}

export const DIALOG_TYPE_CONFIRM = 'Подтверждение'
export const DIALOG_SELECT_TEXT = 'Выбрать'
export const DIALOG_CANCEL_TEXT = 'Отменить'
export const DIALOG_YES = 'Да'
export const DIALOG_NO = 'Нет'

export const NO_SELECT_VALUE = -1

export const DIALOG_ASK_DELETE = 'Удалить выбранные записи?'

export const INVALID_DATE_FORMAT = 'Некорректно указан формат даты'

export const rowsPerPageArray = [5, 10, 25, 50, 100]

export enum TypeOperationStore {
    Add = STORE_IN, // приход материалов
    Remove = STORE_OUT // расход/списание материалов
}
