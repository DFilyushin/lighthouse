import React, {Fragment, useEffect, useState} from 'react';
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
    FormControlLabel,
    FormHelperText
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {addUser, changeUserItem, checkUserExist, getUserItem, saveUser} from "redux/actions/userAction";
import {Groups} from '../components'
import {IUserGroup} from "types/model/user";
import {validateEmail} from "utils/AppUtils";
import {showInfoMessage} from "redux/actions/infoAction";

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
    const accountItem = useSelector((state: IStateInterface)=> state.user.userAccount);
    const [userExist, setUserExist] = useState<boolean>(false)


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        if ( event.target.type === 'text' ){
            const item = {...accountItem, [name]: event.target.value}
            dispatch(changeUserItem(item))
        }else{
            const item = {...accountItem, [name]: event.target.checked}
            dispatch(changeUserItem(item))
        }
    };

    const handleChangeUserGroups = (group: IUserGroup, checked: boolean) => {
        const groups = [...accountItem.groups]
        if (checked) {
            groups.push(group)
        }
        else{
            const index = groups.findIndex(x=> x.name === group.name);
            groups.splice(index, 1)
        }
        const item = {...accountItem, groups: groups}
        dispatch(changeUserItem(item))
    }

    /**
     * Сохранение изменений
     * @param dispatch
     */
    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try {
            if (id === 'new') {
                await dispatch(addUser(accountItem));
            } else {
                await dispatch(saveUser(accountItem));
            }
            resolve();
        }catch (e) {
            reject()
        }
    });

    const isValid = () => {
        const retValue = validateEmail(accountItem.email);
        return retValue && !userExist;
    }

    const onLoginBur = (event: React.FocusEvent<HTMLInputElement>) => {
        console.log(event.target.value)
        checkUserExist(event.target.value).then((value1=> setUserExist(value1)))
    }

    const saveHandler = (event: React.SyntheticEvent) => {
        if (isValid()) {
            saveItem(dispatch).then(() => {
                    history.push('/admin/users/');
                }
            ).catch(() => {
                console.log('Error')
            }).finally(
                () => {
                    console.log('saveHandler_end');
                }
            );
        }
        else{
            dispatch(showInfoMessage('error', 'Проверьте введённые данные!'))
        }
        event.preventDefault();
    };

    // useEffect(()=> {
    //     dispatch(loadStaffs());
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

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
                    onSubmit={saveHandler}
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
                                        md={12}
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
                                            disabled={id !== 'new'}
                                            onBlur={onLoginBur}
                                            helperText={userExist ? "Логин уже существует" : ""}
                                            error={userExist}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={12}
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
                                        xs={12}
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
                                        xs={12}
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
                                    {id !== 'new' &&
                                        <Fragment>
                                    <Grid
                                        item
                                        xs={6}
                                    >
                                        <TextField
                                            fullWidth
                                            label="Создан"
                                            margin="dense"
                                            name="joined"
                                            onChange={handleChange}
                                            disabled
                                            value={moment(accountItem.joined).isValid() ? moment(accountItem.joined).format('DD/MM/YYYY HH:mm') : ""}
                                            variant="outlined"
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                        />
                                    </Grid>
                                        <Grid
                                        item
                                        xs={6}

                                        >
                                        <TextField
                                        fullWidth
                                        label="Последний вход"
                                        margin="dense"
                                        name="lastLogin"
                                        onChange={handleChange}
                                        disabled
                                        value={moment(accountItem.lastLogin).isValid() ? moment(accountItem.lastLogin).format('DD/MM/YYYY HH:mm') : ""}
                                        variant="outlined"
                                        InputProps={{
                                        readOnly: true,
                                    }}
                                        />
                                        </Grid>
                                        </Fragment>
                                            }
                                    <Grid
                                        item
                                        xs={6}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={accountItem.isAdmin}
                                                    onChange={handleChange}
                                                    name="isAdmin"
                                                    color="primary"
                                                />
                                            }
                                            label="Администратор"
                                        />
                                        <FormHelperText>возможность создавать пользователей</FormHelperText>
                                    </Grid>

                                    <Grid
                                        item
                                        xs={6}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={accountItem.active}
                                                    onChange={handleChange}
                                                    name="active"
                                                    color="primary"
                                                />
                                            }
                                            label="Активная учётная запись"
                                        />
                                        <FormHelperText>возможность входа в систему</FormHelperText>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                                <Groups userGroups={accountItem.groups} onChangeGroups={handleChangeUserGroups}/>
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
