import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import { PriceTable } from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import {DefaultToolbar} from 'components';
import SnackBarAlert from 'components/SnackBarAlert';
import { useConfirm } from "material-ui-confirm";
import {
    DIALOG_ASK_DELETE,
    DIALOG_NO,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES
} from "../../../utils/AppConst";
import {deletePriceList, loadPriceListByProduct} from "../../../redux/actions/priceAction";
import {IStateInterface} from "../../../redux/rootReducer";
import {ReactComponent as Price2} from "../../../images/barcode.svg";
import {Button} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    },
    row: {
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        margin: theme.spacing(1),
    },
    buttonGroup: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    spacer: {
        flexGrow: 1
    },
}))

interface IPriceListHistoryProps {
    className: string,
    match: any
}

const PriceListHistory = (props: IPriceListHistoryProps) => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();

    const paramId = props.match.params.id;
    const productId = parseInt(paramId);

    const priceList = useSelector((state: IStateInterface) => state.price.priceListHistory);
    const isLoading = useSelector((state: IStateInterface) => state.price.isLoading);
    const errorValue = useSelector((state: IStateInterface) => state.price.error);
    const alertType = useSelector((state: any) => state.product.typeMessage);
    const hasError = useSelector((state: IStateInterface) => state.price.hasError);
    const [selected, setSelected] = useState<number[]>([]);


    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {

    };

    useEffect( ()=>{
            dispatch(loadPriceListByProduct(productId))
        }, [dispatch, productId]
    );

    async function onFindProductHandler(findText: string){

    }

    function onDeleteHandle() {
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            selected.forEach(async (item) => {
                dispatch(deletePriceList(item))
            })
        )
        ;
    }

    function onClickTableItem(id: number){
        history.push(`/price/${id}`);
    }

    function onClickReturn(){
        history.push(`/price/`);
    }

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'История изменения цен'}
                newItemTitle={'Новый прайс'}
                newItemUrl={'/price/new'}
                findCaption={'Поиск продукции'}
                showDelete={false}
                onFind={onFindProductHandler}
                onDelete={onDeleteHandle}
                icon={<Price2 color={"primary"}/>}
            />
            <div className={classes.buttonGroup}>
                <span className={classes.spacer} />
                <Button color="primary" variant="contained" onClick={onClickReturn}>Вернуться</Button>
            </div>
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <PriceTable
                        items={priceList}
                        showHistory={false}
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

export default PriceListHistory;
