import React, {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import CircularIndeterminate from "components/Loader/Loader";
import {ContractTable, ContractToolbar} from '../components';
import SnackBarAlert from 'components/SnackBarAlert';
import { Color } from '@material-ui/lab/Alert';
import {deleteContract, loadContractList} from "redux/actions/contractAction";
import {useDispatch, useSelector} from "react-redux";
import {DefaultToolbar} from "components";
import {IStateInterface} from "redux/rootReducer";
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import Avatar from '@material-ui/core/Avatar';
import WorkOutlineOutlinedIcon from '@material-ui/icons/WorkOutlineOutlined';

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
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState('');
    const [typeAlert, setTypeAlert] = useState<Color>('success');
    const [contractStatus, setContractStatus] = useState(0);


    useEffect(() => {
        dispatch(loadContractList(contractStatus))
    }, [dispatch]);

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
            <SnackBarAlert
                typeMessage={typeAlert}
                messageText={messageAlert}
                isOpen={showAlert}
                onSetOpenState={setShowAlert}
            />
        </div>
    );
};

export default ContractList;
