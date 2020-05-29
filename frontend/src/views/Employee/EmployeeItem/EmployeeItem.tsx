import React, {useEffect} from 'react';
import moment from "moment";
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
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {
    addNewEmployeeItem,
    changeEmployeeItem,
    loadEmployeeItem,
    updateEmployeeItem
} from "redux/actions/employeeAction";
import {useDialog} from "components/SelectDialog";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {loadStaffs} from "redux/actions/staffAction";
import { docType } from 'types/model/employee';

interface IEmployeeItem {
    className: string;
    match: any;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    }
}));

const EmployeeItem = (props: IEmployeeItem) => {
    const { className, ...rest } = props;

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const paramId = props.match.params.id;
    const id = paramId === 'new' ? 0 :parseInt(paramId);
    const employeeItem = useSelector((state: IStateInterface)=> state.employee.employeeItem);
    const staffItems = useSelector((state:IStateInterface)=> state.staff.staffs);
    const hasError = useSelector((state: IStateInterface)=> state.employee.hasError);
    const selectDialog = useDialog();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...employeeItem, [event.target.name]: event.target.value};
        dispatch(changeEmployeeItem(item))
    };

    /**
     * Сохранение изменений
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        // do anything here
        if (id === 0) {
            await dispatch(addNewEmployeeItem(employeeItem));
        } else {
            await dispatch(updateEmployeeItem(employeeItem));
        }
        resolve();
    });

    const saveHandler = (event: React.MouseEvent) => {
        saveItem(dispatch).then( ()=>{
                console.log('state', hasError);
                history.push('/org/employee');
            }
        );
    };

    const handleChangeStaff =  (event: React.MouseEvent) => {
        selectDialog(
            {
                'title': 'Выбор должности',
                description: '.',
                confirmationText:'Выбрать',
                cancellationText: 'Отменить',
                dataItems: staffItems,
                initKey: employeeItem.staff.id
            }
        ).then((value:any) => {
                const item = {...employeeItem};
                item.staff.id = value.id;
                item.staff.name = value.name;
                dispatch(changeEmployeeItem(item));
            }
        );
    };

    useEffect(()=> {
        dispatch(loadEmployeeItem(id));
        dispatch(loadStaffs());
    }, [dispatch]);


    return (
        <div className={classes.root}>
        <Card
            {...rest}
            className={className}
        >
            <form
                autoComplete="off"
                noValidate
            >
                <CardHeader
                    subheader=""
                    title="Личная карточка сотрудника"
                />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={1}
                        >
                            <TextField
                                fullWidth
                                label="Таб.номер"
                                margin="dense"
                                name="tabNum"
                                onChange={handleChange}
                                required
                                value={employeeItem.tabNum}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={11}
                        >
                            <TextField
                                fullWidth
                                label="Фамилия/Имя/Отчество сотрудника"
                                margin="dense"
                                name="fio"
                                onChange={handleChange}
                                required
                                value={employeeItem.fio}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Paper  elevation={0} className={classes.paper_root}>
                                <TextField
                                    fullWidth
                                    label="Должность"
                                    margin="dense"
                                    name="product"
                                    onChange={handleChange}
                                    required
                                    value={employeeItem.staff.name}
                                    variant="outlined"
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />
                                <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleChangeStaff}>
                                    <MenuOpenIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                        <Grid
                            item
                            xs={3}
                        >
                            <TextField
                                fullWidth
                                label="Дата рождения"
                                margin="dense"
                                name="dob"
                                onChange={handleChange}
                                required
                                value={employeeItem.dob}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={3}
                        >
                            <TextField
                                fullWidth
                                label="ИИН"
                                margin="dense"
                                name="iin"
                                onChange={handleChange}
                                required
                                value={employeeItem.iin}
                                variant="outlined"
                                inputProps={
                                    {
                                        maxLength: 12,
                                    }
                                }
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={6}
                        >
                            <TextField
                                fullWidth
                                label="Контактный телефон"
                                margin="dense"
                                name="contactPhone"
                                onChange={handleChange}
                                required
                                value={employeeItem.contactPhone}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={6}
                        >
                            <TextField
                                fullWidth
                                label="Email"
                                margin="dense"
                                name="contactEmail"
                                onChange={handleChange}
                                required
                                value={employeeItem.contactEmail}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={3}
                            xs={3}
                        >
                            <TextField
                                fullWidth
                                label="Тип документа"
                                margin="dense"
                                name="docType"
                                onChange={handleChange}
                                required
                                select
                                // eslint-disable-next-line react/jsx-sort-props
                                SelectProps={{ native: true }}
                                value={employeeItem.docType}
                                variant="outlined"
                            >
                                {docType.map(option => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid
                            item
                            md={3}
                            xs={3}
                        >
                            <TextField
                                fullWidth
                                label="№ документа"
                                margin="dense"
                                name="docNum"
                                onChange={handleChange}
                                required
                                value={employeeItem.docNum}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={3}
                            xs={4}
                        >
                            <TextField
                                fullWidth
                                label="Дата выдачи"
                                margin="dense"
                                name="docDate"
                                onChange={handleChange}
                                required
                                value={moment(employeeItem.docDate).format('DD/MM/YYYY')}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={3}
                            xs={4}
                        >
                            <TextField
                                fullWidth
                                label="Выдан"
                                margin="dense"
                                name="docAuth"
                                onChange={handleChange}
                                required
                                value={employeeItem.docAuth}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Адрес регистрации"
                                margin="dense"
                                name="addrRegistration"
                                onChange={handleChange}
                                required
                                value={employeeItem.addrRegistration}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Адрес проживания"
                                margin="dense"
                                name="addrResidence"
                                onChange={handleChange}
                                required
                                value={employeeItem.addrResidence}
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
                        color="default"
                        variant="contained"
                        onClick={(event => history.push('/org/employee/'))}
                    >
                        Отменить
                    </Button>
                </CardActions>
            </form>
        </Card>
        </div>
    );
};

export default EmployeeItem;
