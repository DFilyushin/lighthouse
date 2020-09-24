import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField,
    Typography
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {
    addNewRecordToStoreMovement, changeItemMovement,
    deleteRecordFromStoreMovement,
    newStoreMovement, saveRawMovement, updateItemMovement
} from "redux/actions/storeAction";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import StoreMovementItem from "../components/StoreMovementItem";
import {
    DIALOG_ASK_DELETE,
    DIALOG_CANCEL_TEXT, DIALOG_NO,
    DIALOG_SELECT_TEXT,
    DIALOG_TYPE_CONFIRM,
    DIALOG_YES
} from "utils/AppConst";
import {useDialog} from "components/SelectDialog";
import {loadRaws} from "redux/actions/rawAction";
import {useConfirm} from "material-ui-confirm";
import {IStoreMaterialItem} from "types/model/store";
import {DatePicker} from "@material-ui/pickers";
import {ITare} from "../../../types/model/tare";
import {loadTare} from "../../../redux/actions/tareAction";
import {showInfoMessage} from "../../../redux/actions/infoAction";

interface IStoreNewItemsProps {
    className: string;
    match: any;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },

    iconButton: {
        padding: 10,
    },
    // paper: {
    //     width: '80%',
    //     maxHeight: 435,
    // },
    dividerInset: {
        margin: `5px 0 0 ${theme.spacing(9)}px`,
    },
}));

const StoreNewItems = (props: IStoreNewItemsProps) => {
    const {className, ...rest} = props

    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const selectDialog = useDialog()
    const confirm = useConfirm()

    const newMovementItem = useSelector((state: IStateInterface) => state.store.storeMovement)
    const materialItems = useSelector((state: IStateInterface) => state.raw.raws)
    const tareItems = useSelector((state: IStateInterface) => state.tare.tareItems)

    useEffect(() => {
        dispatch(newStoreMovement())
        dispatch(loadRaws())
        dispatch(loadTare())
    }, [dispatch]);

    const handleAddNewItem = () => {
        dispatch(addNewRecordToStoreMovement(newMovementItem))
    }

    /**
     * Изменить материала
     * @param id Код записи
     */
    const handleChangeItem = (id: number) => {
        selectDialog(
            {
                'title': 'Выбор сырья',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: materialItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = {...newMovementItem};
                const index = item.items.findIndex((item: IStoreMaterialItem) => {
                    return item.id === id
                });
                item.items[index].material.id = value.id;
                item.items[index].material.name = value.name;
                dispatch(changeItemMovement(id, item.items[index]));
            }
        );
    };

    /**
     * Удалить запись
     * @param id
     */
    const handleDeleteItem = (id: number) => {
        confirm(
            {
                'title': DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteRecordFromStoreMovement(id))
        );
    };


    const saveItem = (dispatch: any) => new Promise(async (resolve, reject) => {
        try {
            await dispatch(saveRawMovement())
            resolve();
        } catch (e) {
            reject()
        }
    })

    /**
     * Проверка введённых данных
     */
    const isValid = () => {
        const okMaterial = newMovementItem.items.filter((item) => item.material.id === 0).length === 0
        const okTare = newMovementItem.items.filter((item) => item.tare.id === 0).length === 0
        const okCountMaterial = newMovementItem.items.filter((item) => item.count === 0).length === 0

        return okTare && okCountMaterial && okMaterial
    }


    const saveHandler = (event: React.SyntheticEvent) => {
        event.preventDefault();
        if (isValid()){
            saveItem(dispatch).then(() => {
                    history.push('/store/journal');
                }
            ).catch(() => {
                console.log('Error')
            }).finally(
                () => {
                    console.log('saveHandler_end');
                }
            );
        }else{
            dispatch(showInfoMessage('error', 'Проверьте введённые данные!'))
        }
    }

    /**
     * Изменить дату прихода
     * @param date
     */
    const handleDateChange = (date: Date | null) => {
        const strDate = date?.toISOString().slice(0, 19);
        const item = {...newMovementItem, 'date': strDate as string};
        dispatch(updateItemMovement(item))
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...newMovementItem, [event.target.name]: event.target.value}
        dispatch(updateItemMovement(item))
    }


    //TODO Реализовать в виде отдельного компонента
    const handleChangeTareItem = (id: number) => {
        selectDialog(
            {
                'title': 'Выбор тары',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: tareItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = {...newMovementItem}
                const index = item.items.findIndex((item: IStoreMaterialItem) => {
                    return item.id === id
                });
                item.items[index].tare.id = value.id;
                item.items[index].tare.name = value.name;
                const tareIndex = tareItems.findIndex((elem: ITare) => {
                    return elem.id === value.id
                });
                item.items[index].tare.v = tareItems[tareIndex].v
                dispatch(changeItemMovement(id, item.items[index]));
            }
        );
    };

    return (
        <div className={classes.root}>
            <Card
                {...rest}
            >
                <form
                    autoComplete="off"
                    onSubmit={saveHandler}
                >
                    <CardHeader
                        subheader={'Приход сырья'}
                        title="Добавление материалов на склад"
                    />
                    <Divider/>
                    <CardContent>


                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid item xs={3}>
                                <DatePicker
                                    inputVariant="outlined"
                                    format="dd/MM/yyyy"
                                    id="date"
                                    label="Дата прихода"
                                    name="date"
                                    required
                                    margin="dense"
                                    value={newMovementItem?.date}
                                    onChange={handleDateChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="outlined-multiline-static"
                                    label="Комментарий к приходу сырья"
                                    name={'comment'}
                                    multiline
                                    rows={4}
                                    fullWidth
                                    value={newMovementItem.comment}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography> Добавьте необходимые позиции сырья в список </Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={1}>
                            <Grid item xs={11}>
                                <Typography variant={"h5"}>
                                    Список материалов на приход
                                </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Tooltip title={'Добавить материал'}>
                                    <Fab color="default" aria-label="add" onClick={(event => handleAddNewItem())}>
                                        <AddIcon/>
                                    </Fab>
                                </Tooltip>
                            </Grid>
                            {newMovementItem.items.map((item: any) => (
                                <StoreMovementItem
                                    key={item.id}
                                    item={item}
                                    onChangeItemRaw={handleChangeItem}
                                    onChangeItemTare={handleChangeTareItem}
                                    onDeleteItem={handleDeleteItem}
                                />
                            ))}
                        </Grid>
                    </CardContent>
                    <Divider/>

                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            type="submit"
                        >
                            Провести
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/store/journal/'))}
                        >
                            Закрыть
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default StoreNewItems;
