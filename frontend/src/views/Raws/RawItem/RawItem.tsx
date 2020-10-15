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
import {addNewRaw, changeRaw, loadRawItem, updateRaw} from "redux/actions/rawAction";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";
import {IStateInterface} from "../../../redux/rootReducer";


interface IRawItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const RawItem = (props: IRawItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const rawId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const rawItem  = useSelector((state: IStateInterface)=> state.raw.rawItem);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = {...rawItem, [event.target.name]: event.target.value};
        dispatch(changeRaw(raw))
    };

    /**
     * Сохранить изменения с ожиданием
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (rawId === NEW_RECORD_VALUE) {
                await dispatch(addNewRaw(rawItem));
            } else {
                await dispatch(updateRaw(rawItem));
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
        saveItem(dispatch).then( () => {
                history.push('/catalogs/raw');
            }
        )
    };

    useEffect( ()=> {
        dispatch(loadRawItem(rawId));
    }, [dispatch, rawId]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Сырьё"
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
                                    label="Наименование сырья"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={rawItem.name}
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
                            onClick={(event => history.push('/catalogs/raw'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default RawItem;
