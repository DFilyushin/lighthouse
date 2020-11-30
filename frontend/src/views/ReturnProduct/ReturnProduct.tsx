import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {IStateInterface} from "../../redux/rootReducer";
import CircularIndeterminate from "../../components/Loader/Loader";
import ReturnsToolbar from "./components/ReturnsToolbar";
import ReturnsTable from "./components/ReturnsTable";
import {loadReturnsList} from "../../redux/actions/returnsAction";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));


const ReturnProduct = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()

    const returnItems = useSelector((state: IStateInterface) => state.returnsProduct.returnItems);
    const isLoading = useSelector((state: IStateInterface) => state.returnsProduct.isLoading);


    /**
     * Переход к детализированной информации
     * @param contractId
     */
    function onClickTableItem(id: number){
        history.push(`/store/returns/${id}`);
    }

    /**
     * Поиск по продукции
     * @param findText
     */
    async function onFindHandler(findText: string){

    }

    /**
     * Обновление данных
     * @param startDate
     * @param endDate
     */
    function refreshItems(startDate: string, endDate: string) {
        dispatch(loadReturnsList(startDate, endDate))
    }

    return (
        <div className={classes.root}>
            <ReturnsToolbar
                className={''}
                onFind={onFindHandler}
                onRefresh={refreshItems}
            />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <ReturnsTable
                        returnItems={returnItems}
                        onClickItem={onClickTableItem}
                        className={''}
                    />
                }
            </div>
        </div>
    )
}

export default ReturnProduct
