import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField
} from '@material-ui/core'
import { useHistory } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "redux/rootReducer"
import {addNewPayMethod, changePayMethod, loadPayMethodItem, updatePayMethod} from "redux/actions/payMethodAction"
import {NEW_RECORD_VALUE} from "utils/AppConst"


interface IPayMethodItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}))

const PayMethodItem = (props: IPayMethodItemProps) => {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const paramId = props.match.params.id
    const payMethodId = paramId === 'new' ? NEW_RECORD_VALUE :parseInt(paramId)
    const { className } = props

    const payMethodItem  = useSelector((state: IStateInterface)=> state.payMethod.payMethodItem)
    const hasError = useSelector((state: IStateInterface) => state.payMethod.hasError)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...payMethodItem, [event.target.name]: event.target.value}
        dispatch(changePayMethod(item))
    };

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
        if (payMethodId === NEW_RECORD_VALUE) {
            dispatch(addNewPayMethod(payMethodItem))
        } else {
            dispatch(updatePayMethod(payMethodItem))
        }
        if (!hasError) history.push('/catalogs/paymethod');
    };

    useEffect( ()=> {
            dispatch(loadPayMethodItem(payMethodId));
        }, [dispatch, payMethodId]
    );

    return (
        <div className={classes.root}>
            <Card className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Методы оплат"
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid
                                item
                                xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Наименование"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={payMethodItem.name}
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
                            onClick={(event => history.push('/catalogs/paymethod'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default PayMethodItem;
