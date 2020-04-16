import React, { useState } from 'react';
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

interface IEmployeeItem {
    className: string
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const docType = [
    {
        value: 0,
        label: 'УДЛ'
    },
    {
        value: 1,
        label: 'Паспорт гражданина РК'
    },
    {
        value: 2,
        label: 'Паспорт иностранного гражданина'
    }
];

const EmployeeItem = (props: IEmployeeItem) => {
    const { className, ...rest } = props;

    const classes = useStyles();

    const [values, setValues] = useState({
        tab_num: '1520',
        fio: 'Сулейменов Серик Велесович',
        dob: '1985-05-05',
        iin: '123456789012',
        doc_type: 2,
        doc_num: '562315',
        doc_date: '2010-05-06',
        doc_auth: 'МВД РК',
        addr_reg: 'Павлодар, ул. Астана 45, кв.2',
        addr_res: 'Павлодар, ул. Короленко 123, кв.2',
        contact_phone: '+7 596 6565 120',
        contact_email: 'asdasdasd@mail.ru',
        fired: null
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };


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
                                name="tab_num"
                                onChange={handleChange}
                                required
                                value={values.tab_num}
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
                                value={values.fio}
                                variant="outlined"
                            />
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
                                value={values.dob}
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
                                value={values.iin}
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
                                label="Контактный телефон"
                                margin="dense"
                                name="phone"
                                onChange={handleChange}
                                required
                                value={values.contact_phone}
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
                                name="email"
                                onChange={handleChange}
                                required
                                value={values.contact_email}
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
                                name="doc_type"
                                onChange={handleChange}
                                required
                                select
                                // eslint-disable-next-line react/jsx-sort-props
                                SelectProps={{ native: true }}
                                value={values.doc_type}
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
                                name="doc_num"
                                onChange={handleChange}
                                required
                                value={values.doc_num}
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
                                name="doc_date"
                                onChange={handleChange}
                                required
                                value={moment(values.doc_date).format('DD/MM/YYYY')}
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
                                name="doc_auth"
                                onChange={handleChange}
                                required
                                value={values.doc_auth}
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
                                name="addr_reg"
                                onChange={handleChange}
                                required
                                value={values.addr_reg}
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
                                name="addr_res"
                                onChange={handleChange}
                                required
                                value={values.addr_res}
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
                    >
                        Сохранить
                    </Button>
                </CardActions>
            </form>
        </Card>
        </div>
    );
};

export default EmployeeItem;
