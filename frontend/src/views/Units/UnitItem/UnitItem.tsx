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
import {addNewUnit, changeUnit, loadUnitItem, updateUnit} from "redux/actions/unitAction";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";

interface IUnitItemProps {
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
}));

const UnitItem = (props: IUnitItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const unitId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const unitItem  = useSelector((state: any) => state.unit.unitItem);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value: any = null;
        if (typeof (unitItem[event.target.name]) === 'number') {
            value = parseFloat(event.target.value);
        }else{
            value =  event.target.value;
        }
        const item = {...unitItem, [event.target.name]: value};
        dispatch(changeUnit(item))
    };

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (unitId === NEW_RECORD_VALUE) {
                console.log('new___')
                await dispatch(addNewUnit(unitItem));
            } else {
                await dispatch(updateUnit(unitItem));
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
    const saveHandler = (event: React.SyntheticEvent) => {
        event.preventDefault()
        saveItem(dispatch).then( () => {
            history.push('/catalogs/units');
        }
        )
    };

    useEffect( ()=> {
            dispatch(loadUnitItem(unitId));
        }, [dispatch, unitId]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Единицы измерения"
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
                                    value={unitItem.name}
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
                            onClick={(event => history.push('/catalogs/units'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default UnitItem;
