import React, {Fragment, useState, useEffect, SyntheticEvent} from 'react';
import {RouteComponentProps} from "react-router";
import moment from "moment";
import 'moment/locale/ru';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField, TableRow, TableCell
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
// import {useConfirm} from "material-ui-confirm";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {
    addNewContract, addNewSpecItem,
    changeContractItem, deleteContractSpecItem,
    loadContractItem,
    updateContract
} from "redux/actions/contractAction";
import {ContractSpecItem} from "../components";
import {IContractSpecItem} from "types/model/contract";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import { KeyboardDatePicker} from '@material-ui/pickers';
// import {useDialog} from "components/SelectDialog";
import Hidden from "@material-ui/core/Hidden";
import {IClientItemList} from "types/model/client";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {searchClients} from "redux/actions/clientAction";
import Skeleton from '@material-ui/lab/Skeleton';
import {INVALID_DATE_FORMAT} from "../../../utils/AppConst";

interface IContractItemProps extends RouteComponentProps{
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center'
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
    formControl: {
        margin: theme.spacing(1),
    },
    iconButton: {
        padding: 10,
    },
}));


const ContractItem = (props: IContractItemProps) => {
    const paramId = props.match.params.id;
    const contractId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = new URLSearchParams(props.location.search);
    const querySource = query.get('source') || 'contract'
    const querySourceId = query.get('id')

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [hasLoad, setLoad] = useState <boolean>(false)
    const contractItem = useSelector((state: IStateInterface) => state.contract.contractItem);
    const loading = useSelector((state: IStateInterface) => state.contract.isLoading);
    const clients = useSelector((state: IStateInterface)=> state.client.searchClients);
    const hasError = useSelector((state: IStateInterface)=> state.client.hasError);
    const [dataSource, setDataSource] = useState<IClientItemList[]>([])
    const [curClient, setCurClient] = useState<IClientItemList|null>(null)
    const [inputValue, setInputValue] = useState('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        const property: string = event.target.name;
        // @ts-ignore
        const typeOfProperty: string = typeof (contractItem[property]);
        if ( typeOfProperty === 'number') {
            value = parseFloat(event.target.value);
        }else{
            value =  event.target.value;
        }
        const item = {...contractItem, [event.target.name]: value};

        dispatch(changeContractItem(item))
    };

    const contractMenuButtonClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        if (contractId === 0) {
            await dispatch(addNewContract(contractItem));
        } else {
            await dispatch(updateContract(contractItem));
        }
        resolve();
    });

    /**
     * Выбор контракта
     * @param id
     */
    function onSelectContract(id: number){
        console.log('!onSelectContract')
        history.push(`/contracts/${id}`);
    }

    function onDeleteSpecItem(id: number) {
        console.log('onDeleteSpecItem')
        dispatch(deleteContractSpecItem(id))
    }

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        console.log('!saveHandler')
        event.preventDefault();
        saveItem(dispatch).then( ()=>{
                console.log('state', hasError);
                history.push('/contracts/');
            }
        )
    };

    useEffect( () => {
        const loadData = () => {
            setCurClient(contractItem.client);
        }
        if (!hasLoad) {
            setLoad(true);
            dispatch(loadContractItem(contractId, loadData));
        }

        if (contractItem.client.id !== 0 && curClient){
            setCurClient(contractItem.client);
        }


        if (inputValue.length < 4 || inputValue === curClient?.clientName) {
            return undefined;
        }else{
            const newClients: IClientItemList[] = [];
            dispatch(searchClients(inputValue));
            clients.forEach((value)=>{
                newClients.push(value);
            })
            setDataSource(newClients);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasLoad, inputValue, contractItem.client.id]);


    function onChangeClient(event: object, value: IClientItemList | null, reason: string) {
        console.log('onChangeClient', value)
        setCurClient(value);
        if (value){
            const newState = {...contractItem, 'client': value}
            dispatch(changeContractItem(newState));
        }
    }

    const handlePrint = () => {
        //печать ...

        setAnchorEl(null)
    }

    const handleClose = (event: SyntheticEvent) => {
        let url = '/contracts'
        if (querySource === 'client' && querySourceId){
            url = `/client/${querySourceId}`
        }
        history.push(url)
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    }

    const handleAddEmptySpecItem = ()=> {
        dispatch(addNewSpecItem())
    }

    const handleContractDateChange = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...contractItem, 'contractDate': strDate as string};
        dispatch(changeContractItem(item))
    }

    const handleEstDeliveryDateChange = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...contractItem, 'estDelivery': strDate as string};
        dispatch(changeContractItem(item))
    };
    const handleDeliveredDateChange = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...contractItem, 'delivered': strDate as string};
        dispatch(changeContractItem(item))
    };

    return (
        <div className={classes.root}>
            <Card
                {...rest}
                className={className}
            >
                <form
                    autoComplete="off"
                    onSubmit={saveHandler}
                >
                    <CardHeader
                        subheader=""
                        title="Контракт"
                        action={
                            <IconButton aria-label="settings" aria-controls="simple-menu" onClick={contractMenuButtonClick}>
                                <MoreVertIcon />
                            </IconButton>
                        }
                    />
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                    >
                        <MenuItem onClick={handlePrint}>Печать</MenuItem>
                    </Menu>
                    <Divider />
                    <CardContent>
                        {loading ? (
                            <Fragment>
                                <Skeleton animation="wave" height={200} width="100%" style={{ marginBottom: 2 }} />
                                <Skeleton animation="wave" height={100} width="100%" style={{ marginBottom: 2 }} />
                                <Skeleton animation="wave" height={200} width="100%" style={{ marginBottom: 2 }} />
                            </Fragment>) :(
                                <Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12}>
                                    <Autocomplete
                                        autoComplete
                                        getOptionLabel={option => option.clientName}
                                        options={dataSource as IClientItemList[]}
                                        onChange={onChangeClient}
                                        value={curClient}
                                        clearText={'Очистить'}
                                        renderOption={option => (
                                            <Grid container alignItems="center">
                                                <Grid item>
                                                    {option.clientName}
                                                </Grid>
                                                <Grid item xs>
                                                    <Typography variant="body2" color="textSecondary">
                                                        &nbsp;&nbsp;{option.clientEmployee}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        )}
                                        onInputChange={(event, newInputValue) => {
                                            setInputValue(newInputValue);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} margin="dense" label="Клиент" variant="outlined" fullWidth />
                                        )}
                                    />
                                </Grid>
                                <Grid item md={3} xs={3}>
                                    <KeyboardDatePicker
                                        className=''
                                        inputVariant="outlined"
                                        id="dp_contractdate"
                                        label="Дата контракта"
                                        format="dd/MM/yyyy"
                                        margin="dense"
                                        name="contractDate"
                                        value={contractItem?.contractDate || null}
                                        onChange={handleContractDateChange}
                                        invalidDateMessage={INVALID_DATE_FORMAT}
                                    />
                                </Grid>
                                <Grid item md={3} xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Номер"
                                        margin="dense"
                                        name="num"
                                        onChange={handleChange}
                                        required
                                        value={contractItem.num}
                                        variant="outlined"
                                        inputProps={{'maxLength': 8}}
                                    />
                                </Grid>
                                <Grid item md={3} xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Номер контракта по 1C"
                                        margin="dense"
                                        name="contractId"
                                        onChange={handleChange}
                                        value={contractItem.contractId}
                                        variant="outlined"
                                        inputProps={{'maxLength': 10}}
                                    />
                                </Grid>
                                <Grid item md={3} xs={3}>
                                    <TextField
                                        fullWidth
                                        label="Скидка по контракту"
                                        margin="dense"
                                        name="discount"
                                        onChange={handleChange}
                                        required
                                        value={contractItem.discount}
                                        variant="outlined"
                                        type={'number'}
                                        inputProps={{'maxLength': 12}}
                                    />
                                </Grid>
                                <Grid item md={3} xs={3}>
                                    <KeyboardDatePicker
                                        className=''
                                        inputVariant="outlined"
                                        id="estdelivery"
                                        label="Дата поставки"
                                        format="dd/MM/yyyy"
                                        margin="dense"
                                        name="estdelivery"
                                        value={contractItem.estDelivery || null}
                                        onChange={handleEstDeliveryDateChange}
                                        invalidDateMessage={INVALID_DATE_FORMAT}
                                    />
                                </Grid>
                                <Grid
                                    item
                                    md={3}
                                    xs={3}
                                >
                                    <KeyboardDatePicker
                                        className=''
                                        inputVariant="outlined"
                                        id="dp_contractdate"
                                        label="Отгружено"
                                        format="dd/MM/yyyy"
                                        margin="dense"
                                        name="delivered"
                                        value={contractItem.delivered || null}
                                        onChange={handleDeliveredDateChange}
                                        invalidDateMessage={INVALID_DATE_FORMAT}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="outlined-multiline-flexible"
                                        label="Дополнительно"
                                        multiline
                                        margin="dense"
                                        rows="5"
                                        name="comment"
                                        value={contractItem.comment}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                                </Fragment> )}
                            <Grid container spacing={1}>
                                {loading ?
                                    (
                                        <Fragment>
                                            <Skeleton animation="wave" height={100} style={{ marginBottom: 2 }} />
                                            <Skeleton animation="wave" height={100} width="100%" />
                                        </Fragment>
                                    ) : (
                                        <Fragment>
                                            <Grid item xs={11}>
                                                <Typography variant={"h5"}>
                                                    Спецификация контракта
                                                </Typography>
                                            </Grid>
                                        {
                                            <Grid item xs={1}>
                                            <Tooltip title={'Добавить новый продукт'}>
                                            <Fab color="default" aria-label="add" onClick={handleAddEmptySpecItem}>
                                            <AddIcon/>
                                            </Fab>
                                            </Tooltip>
                                            </Grid>
                                        }
                                            <Table size="small">

                                            <TableHead>
                                            <TableRow>
                                            <TableCell>Продукт</TableCell>
                                            <TableCell>Тара</TableCell>
                                            <TableCell>Количество</TableCell>
                                            <TableCell>Цена</TableCell>
                                            <TableCell>Скидка</TableCell>
                                            <TableCell>Итого</TableCell>
                                            <Hidden only={['xs', 'sm']}>
                                            <TableCell>Отгрузка</TableCell>
                                            <TableCell>Отгружен</TableCell>
                                            </Hidden>
                                            </TableRow>
                                            </TableHead>
                                            {
                                                contractItem.specs.map((specItem: IContractSpecItem) => (
                                                    <ContractSpecItem
                                                        className={''}
                                                        match={''}
                                                        item={specItem}
                                                        onDeleteItem={onDeleteSpecItem}
                                                        onChangeItem={onSelectContract}
                                                    />
                                                ))
                                            }
                                            </Table>
                                        </Fragment>
                                    )}
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={10} sm={10}>
                                    <TextField
                                        fullWidth
                                        disabled
                                        id="outlined-multiline-flexible"
                                        label="Договор зарегистрирован"
                                        margin="dense"
                                        name="agent"
                                        value={contractItem.agent.fio}
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2} sm={2}>
                                    <TextField
                                        disabled
                                        id="outlined-multiline-flexible"
                                        label="Дата"
                                        margin="dense"
                                        name="created"
                                        value={moment(contractItem.created).format('DD/MM/YYYY HH:MM')}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>

                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={handleClose}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default ContractItem;
