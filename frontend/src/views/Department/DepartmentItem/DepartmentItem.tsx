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
import {
    addNewDepartment,
    changeDepartmentItem,
    loadDepartmentItem,
    updateDepartmentItem
} from "redux/actions/departmentAction"
import {NEW_RECORD_VALUE} from "../../../utils/AppConst";


interface IDepartmentItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const DepartmentItem = (props: IDepartmentItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const depId = paramId === 'new' ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const departmentItem  = useSelector((state: IStateInterface)=> state.department.departmentItem);
    const hasError = useSelector((state: IStateInterface) => state.department.hasError)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...departmentItem, [event.target.name]: event.target.value};
        dispatch(changeDepartmentItem(item))
    };

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
        if (depId === NEW_RECORD_VALUE) {
            dispatch(addNewDepartment(departmentItem));
        } else {
            dispatch(updateDepartmentItem(departmentItem));
        }
        if (!hasError) history.push('/org/structure');
    };

    useEffect( ()=> {
            dispatch(loadDepartmentItem(depId));
        }, [dispatch, depId]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Подразделение"
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
                                    value={departmentItem.name}
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
                            type={'submit'}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/org/structure'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default DepartmentItem;
