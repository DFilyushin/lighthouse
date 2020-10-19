import React, {Fragment, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom'
import moment from "moment";
import {makeStyles} from '@material-ui/core/styles';
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
    FormHelperText,
    InputAdornment,
    IconButton,
    Paper
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {addUser, changeUserItem, checkUserExist, getUserItem, saveUser} from "redux/actions/userAction";
import {Groups} from '../components'
import {IUserGroup} from "types/model/user";
import {makeRandomString, validateEmail, validateLatin} from "utils/AppUtils";
import {showInfoMessage} from "redux/actions/infoAction";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {DIALOG_CANCEL_TEXT, DIALOG_SELECT_TEXT, NEW_RECORD_TEXT} from "../../../utils/AppConst";
import {useDialog} from "components/SelectDialog"
import {loadEmployeeWithoutLogins} from "../../../redux/actions/employeeAction";
import Alert from '@material-ui/lab/Alert';


interface IAccountDetailsProps {
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

const AccountDetails = (props: IAccountDetailsProps) => {
    const {className, ...rest} = props

    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const selectDialog = useDialog()

    const id = props.match.params.user;
    const isNewUser = id === NEW_RECORD_TEXT;
    const accountItem = useSelector((state: IStateInterface) => state.user.userAccount)
    const userNotFound = useSelector((state: IStateInterface) => state.user.userNotFound)
    const employees = useSelector((state: IStateInterface) => state.employee.employeeWithoutLogins)
    const [userExist, setUserExist] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [showPassword, setShowPassword] = useState(false)
    const [badEmail, setBadEmail] = useState(false)
    const [badPass, setBadPass] = useState(false)
    const [badLogin, setBadLogin] = useState(false)
    const [badEmployee, setBadEmployee] = useState(false)
    const [badGroup, setBadGroup] = useState(false)

    const handleClickShowPassword = () => setShowPassword(!showPassword)
    const handleMouseDownPassword = () => setShowPassword(!showPassword)

    /**
     * Изменение пароля
     * @param event
     */
    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const passValue = event.target.value
        setPassword(passValue)
        const newItem = {...accountItem, password: passValue}
        dispatch(changeUserItem(newItem))
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.name;
        if (event.target.type === 'text') {
            const item = {...accountItem, [name]: event.target.value}
            dispatch(changeUserItem(item))
        } else {
            const item = {...accountItem, [name]: event.target.checked}
            dispatch(changeUserItem(item))
        }
    };

    const handleChangeUserGroups = (group: IUserGroup, checked: boolean) => {
        const groups = [...accountItem.groups]
        if (checked) {
            groups.push(group)
        } else {
            const index = groups.findIndex(x => x.name === group.name);
            groups.splice(index, 1)
        }
        const item = {...accountItem, groups: groups}
        dispatch(changeUserItem(item))
        setBadGroup(false)
    }

    /**
     * Сохранение изменений
     * @param dispatch
     */
    const saveItem = (dispatch: any) => new Promise(async (resolve, reject) => {
        try {
            if (isNewUser) {
                await dispatch(addUser(accountItem));
            } else {
                await dispatch(saveUser(accountItem));
            }
            resolve();
        } catch (e) {
            reject()
        }
    });

    /**
     * Проверка формы
     */
    const isValid = () => {
        const checkLoginLatin = validateLatin(accountItem.login)
        setBadLogin(!checkLoginLatin)
        const checkEmail = validateEmail(accountItem.email)
        setBadEmail(!checkEmail)
        const checkPass = (password.length > 7 && (password !== '') && (isNewUser)) || (!isNewUser)
        setBadPass(!checkPass)
        const checkEmployee = (accountItem.employee.id !== 0)
        setBadEmployee(!checkEmployee)
        const checkGroup = accountItem.groups.length > 0
        setBadGroup(!checkGroup)
        return checkLoginLatin && checkEmail && !userExist && checkPass && checkEmployee && checkGroup;
    }

    const onLoginBur = (event: React.FocusEvent<HTMLInputElement>) => {
        checkUserExist(event.target.value).then((value1 => setUserExist(value1)))
    }

    const saveHandler = (event: React.SyntheticEvent) => {
        event.preventDefault();
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
        } else {
            dispatch(showInfoMessage('error', 'Проверьте введённые данные!'))
        }
        event.preventDefault();
    }

    const generatePass = () => {
        const pass = makeRandomString(8)
        setPassword(pass)
        const item = {...accountItem, password: pass}
        dispatch(changeUserItem(item))
    }

    /**
     * Выбор сотрудника
     * @param event
     */
    const handleChangeEmployee = (event: React.MouseEvent) => {
        selectDialog(
            {
                title: 'Выбор сотрудника',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: employees,
                initKey: accountItem.employee.id,
                valueName: 'fio'
            }
        ).then((value: any) => {
            const item = {...accountItem}
            item.employee.id = value.id
            item.employee.fio = value.name
            item.firstName = value.name.split(' ')[1] || ''
            item.lastName = value.name.split(' ')[0] || ''
            dispatch(changeUserItem(item))
            setBadEmployee(false)
            }
        );

    }

    useEffect(() => {
        dispatch(getUserItem(id))
        dispatch(loadEmployeeWithoutLogins())
    }, [dispatch, id]);

    if (userNotFound) {
        return (
            <div>
                <Redirect to={'/NotFound'}/>
            </div>
        )
    } else {
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
                        <Divider/>
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
                                                disabled={!isNewUser}
                                                onBlur={onLoginBur}
                                                helperText={
                                                    userExist
                                                        ? "Логин уже существует"
                                                        : badLogin
                                                        ? 'Имя пользователя должно быть уникальным, начинаться с латинского символа, ' +
                                                        'иметь не менее 4 символов, допускается использование цифр ' +
                                                        'после символов' : ""
                                                }
                                                error={userExist || badLogin}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={12}
                                        >
                                            <Paper elevation={0} className={classes.paper_root}>
                                                <TextField
                                                    fullWidth
                                                    label="Сотрудник"
                                                    margin="dense"
                                                    name="product"
                                                    onChange={handleChange}
                                                    required
                                                    value={accountItem.employee.fio}
                                                    variant="outlined"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    helperText={badEmployee ? "Не указан сотрудник" : ""}
                                                    error={badEmployee}
                                                />
                                                <IconButton color="primary" className={classes.iconButton}
                                                            aria-label="directions" onClick={handleChangeEmployee}>
                                                    <MenuOpenIcon/>
                                                </IconButton>
                                            </Paper>
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
                                                helperText={badEmail ? "Некорректно указан email" : ""}
                                                error={badEmail}
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

                                        <Grid
                                            item
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label='Пароль'
                                                variant="outlined"
                                                type={showPassword ? "text" : "password"}
                                                onChange={handleChangePassword}
                                                size={"small"}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    )
                                                }}
                                                helperText={badPass ? "Пароль должен быть не менее 8 символов" : ""}
                                                error={badPass}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                        >
                                            <Button variant="contained" onClick={generatePass}>Сгенерировать</Button>
                                        </Grid>

                                        {id !== NEW_RECORD_TEXT &&
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
                                    {badGroup &&
                                    <Alert variant="outlined" severity="error">
                                        Укажите доступные пользователю группы
                                    </Alert>
                                    }
                                    <Groups
                                        userGroups={accountItem.groups}
                                        onChangeGroups={handleChangeUserGroups}
                                    />
                                </Grid>

                            </Grid>
                        </CardContent>
                        <Divider/>
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
        )
    }
}

export default AccountDetails;
