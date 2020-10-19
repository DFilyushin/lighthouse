import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { FormulaTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import { DefaultToolbar} from 'components';
import SnackBarAlert from 'components/SnackBarAlert';
import {deleteFormula, loadFormula} from "redux/actions/formulaAction";
import { useConfirm } from "material-ui-confirm";
import {
    DIALOG_ASK_DELETE,
    DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES
} from "utils/AppConst";
import {IStateInterface} from "../../../redux/rootReducer";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const FormulaList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const formulas = useSelector((state: IStateInterface) => state.formula.formulas);
    const isLoading = useSelector((state: IStateInterface) => state.formula.isLoading);
    const errorValue = useSelector((state: any) => state.formula.error);
    const alertType = useSelector((state: any) => state.formula.typeMessage);
    const hasError = useSelector((state: IStateInterface) => state.formula.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        //dispatch(clearError())
    };

    useEffect( ()=>{
            dispatch(loadFormula())
        }, [dispatch]
    );

    async function onFindProductHandler(findText: string){
        dispatch(loadFormula(findText))
    }

    function onDeleteHandle() {
        if (selected.length === 0 ) return;
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            selected.forEach(async (item) => {
                dispatch(deleteFormula(item))
            })
        )

    }

    function onClickTableItem(rawId: number){
        const newItemUrl = `/catalogs/formula/${rawId}`;
        history.push(newItemUrl);
    };

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Рецептура'}
                newItemTitle={'Новая рецептура'}
                newItemUrl={'/catalogs/formula/new'}
                findCaption={'Поиск рецептуры'}
                showDelete={true}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}/>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <FormulaTable
                        formulas={formulas}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
            <SnackBarAlert
                typeMessage={alertType}
                messageText={errorValue}
                isOpen={hasError}
                onSetOpenState={handleClose}
            />
        </div>
    );
};

export default FormulaList;
