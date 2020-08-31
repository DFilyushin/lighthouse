import {IFactoryLineState} from 'types/state/factorylines';
import {
    FACTORY_LINE_LOAD_START,
    FACTORY_LINE_LOAD_FINISH,
    FACTORY_LINE_LOAD_SUCCESS,
    FACTORY_CLEAR_ERROR,
    FACTORY_LINE_LOAD_ITEM,
    FACTORY_LINE_DELETE_OK,
    FACTORY_LINE_SET_ERROR, FACTORY_LINE_UPDATE
} from 'redux/actions/types'

const getInitState = () => ({
    lineItems: [],
    lineItem: {id: 0, name: ''},
    isLoading: false,
    error: '',
    typeMessage: '',
    hasError: false
});


export const factoryLineReducer =  (state: IFactoryLineState = getInitState(), action: any) => {
    switch (action.type) {
        case FACTORY_LINE_LOAD_START:
            return {...state, isLoading: true};
        case FACTORY_LINE_LOAD_FINISH:
            return {...state, isLoading: false};
        case FACTORY_LINE_SET_ERROR:
            return {...state, hasError: true, error: action.error};
        case FACTORY_LINE_LOAD_SUCCESS:
            return {...state, lineItems: action.items};
        case FACTORY_LINE_LOAD_ITEM:
            return {...state, lineItem: action.item};
        case FACTORY_CLEAR_ERROR:
            return {...state, hasError: false, error: ''};
        case FACTORY_LINE_UPDATE:
            return {...state, lineItem: action.item};
        case FACTORY_LINE_DELETE_OK:
            return {...state, lineItems: action.items};
        default: return state;
    }
};