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
import { useDispatch, useSelector } from "react-redux";
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import {addNewWorks, changeWork, loadWorkItem, updateWorks} from "redux/actions/workAction";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";
import {IStateInterface} from "../../../redux/rootReducer";


interface IWorkItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    }
}));

const WorkItem = (props: IWorkItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();

    const paramId = props.match.params.id;
    const idItem = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const workItem  = useSelector((state: any) => state.works.workItem);
    const errorValue = useSelector((state: IStateInterface) => state.works.error);
    const hasError = useSelector((state: IStateInterface) => state.works.hasError);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        if (typeof (workItem[event.target.name]) === 'number') {
            value = parseFloat(event.target.value);
        }else{
            value = event.target.value;
        }
        const item = {...workItem, [event.target.name]: value};
        dispatch(changeWork(item))
    };

    /**
     * Сохранить изменения с ожиданием
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (idItem === NEW_RECORD_VALUE) {
                await dispatch(addNewWorks(workItem));
            } else {
                await dispatch(updateWorks(workItem));
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
            history.push('/catalogs/works');
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
            dispatch(loadWorkItem(idItem));
        }, [dispatch, idItem]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Вид выполняемой работы"
                    />
                    <Divider />
                    {hasError &&
                    <Paper elevation={0}>
                        <Alert severity="error">{errorValue}</Alert>
                    </Paper>
                    }

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Наименование"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={workItem.name}
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
                            onClick={(event => history.push('/catalogs/works/'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default WorkItem;
