import {
    IProductionList,
    IProduction,
    IProductionTeam, IProductionCalc
}
    from "../model/production";

export interface IProductionState {
    prodCardList: IProductionList[];
    prodCardItem: IProduction;
    prodCardTeam: IProductionTeam[];
    prodCardCalc: IProductionCalc[];
    isLoading: boolean;
    error: string;
    typeMessage: string;
    hasError: boolean
}