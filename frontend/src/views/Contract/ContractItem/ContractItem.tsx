import React, {useState, useEffect, SyntheticEvent} from 'react';
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
import {useConfirm} from "material-ui-confirm";
import {
    addNewContract, addNewSpecItem,
    changeContractItem, deleteContractSpecItem,
    loadContractItem,
    updateContract
} from "../../../redux/actions/contractAction";
import {ContractSpecItem} from "../components";
import {IContract, IContractSpecItem} from "../../../types/model/contract";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import { KeyboardDatePicker} from '@material-ui/pickers';
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import {useDialog} from "../../../components/SelectDialog";
import Hidden from "@material-ui/core/Hidden";
import {IClientItemList} from "../../../types/model/client";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {searchClients} from "../../../redux/actions/clientAction";
import {CONTRACT_CHANGE_ITEM} from "../../../redux/actions/types";

const PAGE_MAIN = 0;
const PAGE_SPEC = 1;

interface IContractItemProps {
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
    const confirm = useConfirm();
    const selectDialog = useDialog();


    const [hasLoad, setLoad] = useState <boolean>(false)
    const contractItem = useSelector((state: IStateInterface) => state.contract.contractItem);
    const clients = useSelector((state: IStateInterface)=> state.client.searchClients);
    const hasError = useSelector((state: IStateInterface)=> state.client.hasError);
    const [dataSource, setDataSource] = useState<IClientItemList[]>([])
    const [curClient, setCurClient] = useState<IClientItemList|null>(null)
    const [inputValue, setInputValue] = useState('')

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...contractItem, [event.target.name]: event.target.value};
        dispatch(changeContractItem(item))
    };

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

    /**
     * Изменение клиента
     */
    function handleChangeClient() {

    }


    useEffect( () => {
        console.log('isLoading', hasLoad);
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
            console.log('search by ', inputValue);
            dispatch(searchClients(inputValue))
            clients.map((value, index, array)=> {
                newClients.push(value)
            })
            setDataSource(newClients);
        }
    }, [hasLoad, inputValue, contractItem.client.id]);


    function onChangeClient(event: object, value: IClientItemList | null, reason: string) {
        console.log('onChangeClient', value)
        setCurClient(value);
        if (value){
            const newState = {...contractItem, 'client': value}
            dispatch(changeContractItem(newState));
            console.log('newState', newState);
        }
        // const newState = {...contractItem, 'client': value};
        // if (!value) {setInputValue('')}
        // console.log('newState',newState);
        // //setCurClient(value)
        //
        // dispatch(changeContractItem(newState as IContract));
    }


    function a11yProps(index: any) {
        return {
            id: `scrollable-force-tab-${index}`,
            'aria-controls': `scrollable-force-tabpanel-${index}`,
        };
    }

    const handleDeliveryDateChange = (date: Date | null) => {

    };

    const handleAddEmptySpecItem = ()=> {
        dispatch(addNewSpecItem())
    }

    const handleContractDateChange = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...contractItem, 'contractDate': strDate as string};
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
                    <CardHeader subheader="" title="Контракт"/>
                    <Divider />
                    <CardContent>
                            <Grid
                                container
                                spacing={3}
                            >
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
                                        required
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
                                        inputProps={{'maxLength': 12}}
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
                                        label="Дата поставки"
                                        format="dd/MM/yyyy"
                                        margin="dense"
                                        name="contractDate"
                                        value={contractItem.estDelivery || null}
                                        onChange={handleContractDateChange}
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
                                        onChange={handleContractDateChange}
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

                            <Grid container spacing={1}>
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
                                    contractItem.specs.map((specItem: IContractSpecItem) =>(
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
                            onClick={(event => history.push('/contracts'))}
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
