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
    TextField,
    Switch,
    FormControlLabel
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
import {getUserItem} from "../../../redux/actions/userAction";

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

const AccountDetails = (props: IEmployeeItem) => {
    const { className, ...rest } = props;

    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const id = props.match.params.user;
    //const id = paramId === 'new' ? 0 :parseInt(paramId);
    const accountItem = useSelector((state: IStateInterface)=> state.user.userAccount);
    const hasError = useSelector((state: IStateInterface)=> state.employee.hasError);
    const selectDialog = useDialog();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...accountItem, [event.target.name]: event.target.value};
        //dispatch(changeEmployeeItem(item))
    };


    /**
     * Сохранение изменений
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        // do anything here
        // if (id === 0) {
        //     await dispatch(addNewEmployeeItem(accountItem));
        // } else {
        //     await dispatch(updateEmployeeItem(accountItem));
        // }
        // resolve();
    });

    const saveHandler = (event: React.MouseEvent) => {
        saveItem(dispatch).then( ()=>{
                console.log('state', hasError);
                history.push('/org/employee');
            }
        );
    };




    useEffect(()=> {
        dispatch(loadStaffs());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(()=> {
        dispatch(getUserItem(id));
    }, [dispatch, id]);


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
                        title="Пользователь"
                    />
                    <Divider />
                    <CardContent>
                        <Grid
                            container
                            spacing={1}
                        >
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Grid container spacing={3}>
                                    <Grid
                                        item
                                        xs={12}
                                        sm={12}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Логин"
                                            margin="dense"
                                            name="login"
                                            onChange={handleChange}
                                            required
                                            value={accountItem.login}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            margin="dense"
                                            name="email"
                                            onChange={handleChange}
                                            required
                                            value={accountItem.email}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Имя"
                                            margin="dense"
                                            name="firstName"
                                            onChange={handleChange}
                                            required
                                            value={accountItem.firstName}
                                            variant="outlined"
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        md={4}
                                        xs={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Фамилия"
                                            margin="dense"
                                            name="lastName"
                                            onChange={handleChange}
                                            required
                                            value={accountItem.lastName}
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
                                            label="Создан"
                                            margin="dense"
                                            name="contactPhone"
                                            onChange={handleChange}
                                            required
                                            value={moment(accountItem.joined).isValid() ? moment(accountItem.joined).format('DD/MM/YYYY HH:mm'): ""}
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
                                            label="Последний вход"
                                            margin="dense"
                                            name="lastLogin"
                                            onChange={handleChange}
                                            required
                                            value={moment(accountItem.lastLogin).isValid() ? moment(accountItem.lastLogin).format('DD/MM/YYYY HH:mm'): ""}
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
                                            label="№ документа"
                                            margin="dense"
                                            name="docNum"
                                            onChange={handleChange}
                                            required
                                            value={accountItem.active}
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
                                            value={moment(accountItem.joined).format('DD/MM/YYYY')}
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
                                            value={accountItem.email}
                                            variant="outlined"
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        md={12}
                                        xs={12}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={accountItem.active}
                                                    onChange={handleChange}
                                                    name="checkedB"
                                                    color="primary"
                                                />
                                            }
                                            label="Активная"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}></Grid>

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
                            onClick={(event => history.push('/admin/users/'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default AccountDetails;
