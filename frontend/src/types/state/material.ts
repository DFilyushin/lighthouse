import {IMaterial} from 'types/model/material'

export interface IMaterialState {
    /**
     * Список материалов
     */
    materialItems: IMaterial[];
    /**
     * Признак загрузки
     */
    isLoading: boolean;
}
