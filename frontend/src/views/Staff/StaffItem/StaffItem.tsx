import React, {SyntheticEvent, useEffect} from 'react';
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
import {addNewStaff, changeItem, loadStaffItem, updateStaffItem} from "redux/actions/staffAction";
import {NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "../../../utils/AppConst";
import {IStateInterface} from "../../../redux/rootReducer";

interface IStaffItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const StaffItem = (props: IStaffItemProps) => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const staffId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE :parseInt(paramId);
    const { className, ...rest } = props;

    const staffItem  = useSelector((state: IStateInterface)=> state.staff.staffItem);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const raw = {...staffItem, [event.target.name]: event.target.value};
        dispatch(changeItem(raw))
    };

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            if (staffId === NEW_RECORD_VALUE) {
                await dispatch(addNewStaff(staffItem));
            } else {
                await dispatch(updateStaffItem(staffItem));
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
            history.push('/org/staff');
            }
        )
    }

    useEffect( ()=> {
            dispatch(loadStaffItem(staffId));
        }, [dispatch, staffId]
    );

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Должность"
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
                                    label="Наименование должности"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={staffItem.name}
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
                            onClick={(event => history.push('/org/staff'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default StaffItem;
