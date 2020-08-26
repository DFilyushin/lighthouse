import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {makeStyles} from "@material-ui/core/styles";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Grid,
    Divider,
    TextField,
    colors
} from '@material-ui/core';
import {IProfile} from "types/model/user";


interface IGeneralSettingsProps {
    className: string;
    profile: IProfile;
    changeData: any;
    saveData: any;
}

const useStyles = makeStyles(theme => ({
    root: {},
    saveButton: {
        color: theme.palette.common.white,
        backgroundColor: colors.green[600],
        '&:hover': {
            backgroundColor: colors.green[900]
        }
    }
}));

const GeneralSettings = (props: IGeneralSettingsProps) => {
    const { profile, changeData, className, saveData,...rest } = props;

    const classes = useStyles();
    const [values, setValues] = useState({...profile});

    useEffect(()=> {
        setValues(profile)
    }, [profile])

    const handleSubmit = (event: React.SyntheticEvent) => {
        event.preventDefault();
        saveData();
    };

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
            <form onSubmit={handleSubmit}>
                <CardHeader title="Профиль" />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={4}
                    >
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                helperText="Укажите своё имя"
                                label="Имя"
                                name="firstName"
                                onChange={changeData}
                                required
                                value={values.firstName}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Фамилия"
                                name="lastName"
                                onChange={changeData}
                                required
                                value={values.lastName}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Почта"
                                name="mail"
                                onChange={changeData}
                                required
                                value={values.mail}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Телефон"
                                name="phone"
                                onChange={changeData}
                                type="text"
                                value={values.phone}
                                variant="outlined"
                            />
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Button
                        className={classes.saveButton}
                        type="submit"
                        variant="contained"
                    >
                        Сохранить
                    </Button>
                </CardActions>
            </form>
        </Card>
    );
}

export default GeneralSettings