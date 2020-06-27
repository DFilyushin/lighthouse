import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {ContractTable, ContractToolbar} from '../components';
import {deleteContract, loadContractList} from "redux/actions/contractAction";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const ContractList = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    // @ts-ignore
    const isLoading = useSelector((state: IStateInterface) => state.contract.isLoading);
    const clients = useSelector((state: IStateInterface) => state.contract.items);
    const [selected, setSelected] = useState<number[]>([]);

    // eslint-disable-next-line
    const [contractStatus, setContractStatus] = useState(0);

    useEffect(() => {
        dispatch(loadContractList(contractStatus))
    }, [dispatch, contractStatus]);

    function onClickTableItem(contractId: number){
        history.push(`/contracts/${contractId}`);
    }

    async function onFindClientHandler(findNum: number){
        dispatch(loadContractList(findNum))
    }

    function onDeleteHandle() {
        selected.forEach(async (item, i, selected) => {
            dispatch(deleteContract(item))
        });
    }

    return (
        <div className={classes.root}>
            <ContractToolbar
                className={''}
                onFind={onFindClientHandler}
                onDelete={onDeleteHandle}
            />
            <div className={classes.content}>
                {
                    isLoading ? <CircularIndeterminate/>
                        : <ContractTable
                            contracts={clients}
                            className={''}
                            onClickItem={onClickTableItem}
                            onChangeSelected={setSelected}
                        />
                }
            </div>
        </div>
    );
};

export default ContractList;
