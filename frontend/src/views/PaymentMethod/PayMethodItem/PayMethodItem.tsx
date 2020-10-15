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
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst"


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
    const payMethodId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId)
    const { className } = props

    const payMethodItem  = useSelector((state: IStateInterface)=> state.payMethod.payMethodItem)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...payMethodItem, [event.target.name]: event.target.value}
        dispatch(changePayMethod(item))
    };


    /**
     * Сохранить изменения с ожиданием
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (payMethodId === NEW_RECORD_VALUE) {
                await dispatch(addNewPayMethod(payMethodItem));
            } else {
                await dispatch(updatePayMethod(payMethodItem));
            }
            resolve();
        }catch (e) {
            reject()
        }
    });

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
        event.preventDefault();
        saveItem(dispatch).then( ()=>{
                history.push('/catalogs/paymethod');
            }
        ).catch(()=>{
            console.log('Error')
        }).finally(
            ()=>{
                console.log('saveHandler_end');
            }
        );
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
