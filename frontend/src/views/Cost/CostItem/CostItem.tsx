import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, TextField} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Paper from '@material-ui/core/Paper';
import Alert from '@material-ui/lab/Alert';
import {IStateInterface} from "redux/rootReducer";
import {addNewCost, changeCost, getCostItem, getFirstLevelCost, updateCost} from "redux/actions/costAction";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";

interface ICostItemProps {
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

const CostItem = (props: ICostItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const costId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE : parseInt(paramId);
    const {className, ...rest} = props;


    const costItem = useSelector((state: IStateInterface) => state.cost.costItem);
    const firstLevel = useSelector((state: IStateInterface) => state.cost.parentItems);
    const errorValue = useSelector((state: IStateInterface) => state.cost.error);
    const hasError = useSelector((state: IStateInterface) => state.cost.hasError);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        value = event.target.value;
        const item = {...costItem, [event.target.name]: value};
        dispatch(changeCost(item))
    };

    const handleLevelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const item = {...costItem, 'parent': event.target.value as number}
        dispatch(changeCost(item))
    };

    /**
     * Сохранить изменения с ожиданием
     * @param dispatch
     */
    const saveItem = (dispatch: any) => new Promise(async (resolve, reject) => {
        try {
            if (costId === NEW_RECORD_VALUE) {
                await dispatch(addNewCost(costItem));
            } else {
                await dispatch(updateCost(costItem));
            }
            resolve();
        } catch (e) {
            reject()
        }
    });


    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.MouseEvent) => {
        event.preventDefault();
        saveItem(dispatch).then(() => {
                history.push('/catalogs/cost');
            }
        ).catch(() => {
            console.log('Error')
        }).finally(
            () => {
                console.log('saveHandler_end');
            }
        );
    };

    useEffect(() => {
        dispatch(getFirstLevelCost());
    }, [dispatch])

    useEffect(() => {
            dispatch(getCostItem(costId));
        }, [dispatch, costId]
    );


    return (

        <div className={classes.root}>
            {console.log(costItem)}
            <Card {...rest} className={className}>
                <form autoComplete="off" noValidate>
                    <CardHeader
                        subheader=""
                        title="Статья расходов"
                    />
                    <Divider/>
                    {hasError &&
                    <Paper elevation={0}>
                        <Alert severity="error">{errorValue}</Alert>
                    </Paper>
                    }

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Select
                                    fullWidth
                                    margin="dense"
                                    name="parent"
                                    value={costItem.parent}
                                    variant="outlined"
                                    onChange={handleLevelChange}
                                >
                                    <MenuItem value=""><em>Первый уровень</em></MenuItem>
                                    {
                                        firstLevel && firstLevel.map((item) => {
                                            return (
                                                <MenuItem value={item.id}>{item.name}</MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Наименование"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={costItem.name}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>

                    </CardContent>
                    <Divider/>
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={saveHandler}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/catalogs/cost'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default CostItem;
