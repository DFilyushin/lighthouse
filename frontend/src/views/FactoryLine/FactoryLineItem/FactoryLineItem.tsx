import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField
} from '@material-ui/core';
import { useHistory } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {
    addNewFactoryItem,
    changeFactoryItem,
    loadFactoryItem,
    updateFactoryItem
} from "redux/actions/factoryLineAction";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "../../../utils/AppConst";


interface IFactoryLineProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const FactoryLineItem = (props: IFactoryLineProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const id = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const factoryLineItem  = useSelector((state: IStateInterface)=> state.factoryLine.lineItem);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...factoryLineItem, [event.target.name]: event.target.value};
        dispatch(changeFactoryItem(item))
    };


    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (id === NEW_RECORD_VALUE) {
                await dispatch(addNewFactoryItem(factoryLineItem));
            } else {
                await dispatch(updateFactoryItem(factoryLineItem));
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
        event.preventDefault()
        saveItem(dispatch).then( ()=>{
                history.push('/catalogs/lines');
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
            dispatch(loadFactoryItem(id));
        }, [dispatch, id]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Линия производства"
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
                                    value={factoryLineItem.name}
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
                            onClick={(event => history.push('/catalogs/lines'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default FactoryLineItem;
