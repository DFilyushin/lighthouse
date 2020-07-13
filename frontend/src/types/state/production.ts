import {
    IProductionList,
    IProduction,
    IProductionTeam, IProductionCalc, IProductionTare, IProductionMaterial
}
    from "../model/production";

export interface IProductionState {
    prodCardList: IProductionList[];
    prodCardItem: IProduction;
    prodCardTeam: IProductionTeam[];
    prodCardCalc: IProductionCalc[];
    prodCardTare: IProductionTare[];
    prodCardMaterial: IProductionMaterial[];
    prodCardOriginalCalc: IProductionCalc[];
    isLoading: boolean;
    error: string;
    typeMessage: string;
    hasError: boolean;
    canRedirect: boolean;
}
