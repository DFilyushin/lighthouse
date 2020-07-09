import {
    IProductionList,
    IProduction,
    IProductionTeam, IProductionCalc, IProductionTare
}
    from "../model/production";

export interface IProductionState {
    prodCardList: IProductionList[];
    prodCardItem: IProduction;
    prodCardTeam: IProductionTeam[];
    prodCardCalc: IProductionCalc[];
    prodCardTare: IProductionTare[];
    prodCardOriginalCalc: IProductionCalc[];
    isLoading: boolean;
    error: string;
    typeMessage: string;
    hasError: boolean;
    canRedirect: boolean;
}
