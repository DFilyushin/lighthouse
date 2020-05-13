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
    const unitId = paramId === 'new' ? 0 :parseInt(paramId);
    const { className, ...rest } = props;

    const unitItem  = useSelector((state: any) => state.unit.unitItem);
    const errorValue = useSelector((state: any) => state.unit.error);
    const hasError = useSelector((state: any) => state.unit.hasError)

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

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.MouseEvent) => {
        if (unitId === 0) {
            dispatch(addNewUnit(unitItem));
        } else {
            dispatch(updateUnit(unitItem));
        }
        console.log(hasError);
        if (!hasError) history.push('/catalogs/units');
    };

    useEffect( ()=> {
            if (unitId !== 0) dispatch(loadUnitItem(unitId));
        }, [dispatch]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" noValidate>
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
                            onClick={saveHandler}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={(event => history.push('/catalogs/tare'))}
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
