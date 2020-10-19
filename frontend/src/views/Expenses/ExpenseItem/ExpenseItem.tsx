import React, {SyntheticEvent, useEffect, useState} from 'react'
import {RouteComponentProps} from "react-router"
import { makeStyles } from '@material-ui/core/styles'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    IconButton,
    TextField,
    Typography,
    Paper,
    Link
} from '@material-ui/core'
import { useHistory } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "redux/rootReducer"
import {
    DIALOG_CANCEL_TEXT,
    DIALOG_SELECT_TEXT, NEW_RECORD_TEXT,
    NEW_RECORD_VALUE
} from "utils/AppConst"
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {useDialog} from "components/SelectDialog";
import {addExpenseItem, changeExpense, loadExpenseItem, updateExpenseItem} from "../../../redux/actions/expenseAction";
import {getFlatCostList} from "../../../redux/actions/costAction";

interface IExpenseItemProps extends RouteComponentProps{
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    iconButton: {
        padding: 10,
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
}))

const ExpenseItem = (props: IExpenseItemProps) => {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const selectDialog = useDialog()

    const paramId = props.match.params.id
    const expenseId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId)

    const { className } = props

    const expenseItem  = useSelector((state: IStateInterface)=> state.expense.item)
    const costItems  = useSelector((state: IStateInterface)=> state.cost.costFlatItems)

    const [hasTotalSumError, setTotalSumError] = useState(false)
    const [hasCostId, setCostId] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...expenseItem, [event.target.name]: event.target.value}
        dispatch(changeExpense(item))
    }

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try {
            if (expenseId === NEW_RECORD_VALUE) {
                await dispatch(addExpenseItem(expenseItem))
            } else {
                await dispatch(updateExpenseItem(expenseItem))
            }
            resolve()
        }catch (e) {
            reject()
        }
    })

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: SyntheticEvent) => {
        event.preventDefault()
        if (isValid()) {
            saveItem(dispatch).then(() => {
                    history.push('/expense/')
                }
            )
        }
    }

    /**
     * Возврат назад
     * @param event
     */
    const closeHandler = (event: React.MouseEvent) => {
        history.push('/expense/?source=return')
    }

    useEffect( ()=> {
        dispatch(loadExpenseItem(expenseId))
        dispatch(getFlatCostList())
        }, [dispatch, expenseId]
    )


    //TODO Реализовать в виде отдельного компонента
    /**
     * Сменить метод оплаты
     */
    const handleChangeCost = () => {
        selectDialog(
            {
                title: 'Выбор статьи затраты',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: costItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value:any) => {
                const item = {...expenseItem, cost: {id: value.id, name: value.name, childs: [], parent: 0}}
                dispatch(changeExpense(item))
            }
        );
    }

    /**
     * Проверка валидности формы
     */
    function isValid() : boolean {
        const hasTotalSum = expenseItem.total === 0
        const hasCost = expenseItem.cost.id === 0
        setTotalSumError(hasTotalSum)
        setCostId(hasCost)
        return !hasTotalSum && !hasCost
    }

    return (
        <div className={classes.root}>
            <Card className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Карточка затрат"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            {expenseId === NEW_RECORD_VALUE &&
                            <Grid item xs={12}>
                                <Typography>
                                    Расходы по приобретению сырья вносятся через <Link href="/store/raw/new">
                                    журнал операций
                                </Link>
                                </Typography>
                            </Grid>
                            }
                            <Grid item xs={12}>
                                <Paper  elevation={0} className={classes.paper_root}>
                                    <TextField
                                        fullWidth
                                        label="Статья затрат"
                                        margin="dense"
                                        name="product"
                                        onChange={handleChange}
                                        required
                                        value={expenseItem.cost.name}
                                        variant="outlined"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        helperText={hasCostId ? "Обязательное поле" : ""}
                                        error={hasCostId}
                                    />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeCost}>
                                        <MenuOpenIcon />
                                    </IconButton>
                                </Paper>
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <TextField
                                    fullWidth
                                    label="Дата документа"
                                    margin="dense"
                                    name="date"
                                    type="date"
                                    onChange={handleChange}
                                    required
                                    value={expenseItem.date}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={2}
                            >
                                <TextField
                                    fullWidth
                                    label="Сумма"
                                    margin="dense"
                                    name="total"
                                    onChange={handleChange}
                                    required
                                    value={expenseItem.total}
                                    variant="outlined"
                                    helperText={hasTotalSumError ? "Обязательное поле" : ""}
                                    error={hasTotalSumError}
                                />
                            </Grid>
                            <Grid
                                item
                                md={12}
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    id="outlined-multiline-flexible"
                                    label="Дополнительно"
                                    multiline
                                    margin="dense"
                                    rows="5"
                                    name="comment"
                                    value={expenseItem.comment}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Сотрудник"
                                    margin="dense"
                                    name="num"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    value={expenseItem.employee.fio}
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
                            type={"submit"}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={closeHandler}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default ExpenseItem;
