export const SETUP_NDS = 'NDS'
export const SETUP_RESERVE_INTERVAL = 'RESERVE_PERIOD'


export interface ISetupState {
    /**
     * значение НДС
     */
    nds: number;
    /**
     * Количество дней по умолчанию для установки резерва продукции
     */
    reserveInterval: number;
    loaded: string | null;
}
