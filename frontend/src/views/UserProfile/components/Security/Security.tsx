import React, {useState} from "react";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Grid,
    Button,
    Divider,
    TextField,
    colors
} from '@material-ui/core';
import {useDispatch} from "react-redux";
import {changePassword} from "../../../../redux/actions/userAction";
import Alert from '@material-ui/lab/Alert';
import {showInfoMessage} from "../../../../redux/actions/infoAction";

interface ISecurityProps {
    className: string
}

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
    },
    saveButton: {
        color: theme.palette.common.white,
        backgroundColor: colors.green[600],
        '&:hover': {
            backgroundColor: colors.green[900]
        }
    }
}));

const Security = (props: ISecurityProps) => {

    const { className, ...rest } = props;

    const classes = useStyles();
    const [errors, setErrors] = useState([])
    const [values, setValues] = useState({
        password: '',
        confirm: ''
    })

    const dispatch = useDispatch();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        })
    }

    const valid = values.password && values.password === values.confirm

    const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            await dispatch( changePassword(values.password) )
            resolve()
        }catch (e) {
            reject(e)
        }
    })


    /**
     * Установка пароля
     */
    const handleSavePassword = () => {
        saveItem(dispatch).then( ()=> {
            dispatch(showInfoMessage("success", 'Новый пароль успешно установлен!'))
            setErrors([])
            setValues(
                {
                    password: '',
                    confirm: ''
                }
            )
            }
        ).catch( (e)=> {
            setErrors(e.message.split(','))
            }
        )
    }

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <CardHeader title="Смена пароля" />
            <Divider />
            <CardContent>
                {
                    errors.map(item => (
                        <Alert severity="error" className={classes.root}>{item}</Alert>
                    ))
                }
                <form autoComplete={'off'}>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            md={4}
                            sm={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Пароль"
                                name="password"
                                onChange={handleChange}
                                type="password"
                                value={values.password}
                                variant="outlined"
                                autoComplete={'nope'}
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            sm={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Подтверждение пароля"
                                name="confirm"
                                onChange={handleChange}
                                type="password"
                                value={values.confirm}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
            <Divider />
            <CardActions>
                <Button
                    className={classes.saveButton}
                    disabled={!valid}
                    variant="contained"
                    onClick={handleSavePassword}
                >
                    Сохранить
                </Button>
            </CardActions>
        </Card>
    )
}

export default Security