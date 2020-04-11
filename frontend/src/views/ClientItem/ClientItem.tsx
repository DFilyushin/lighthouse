import React, { useState } from 'react';
import clsx from 'clsx';
import moment from "moment";
import { makeStyles } from '@material-ui/core/styles';
import {SearchInput} from 'components';
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

interface IClientItem {
    className: string
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    }
}));

const ClientItem = (props: IClientItem) => {
    const { className, ...rest } = props;

    const classes = useStyles();

    const [values, setValues] = useState({
        id: 7,
        created: '2020-02-01',
        name: 'ИП Матвеева И.А.',
        addr_reg: 'свх им Тельмана, Районная 1',
        employee: 'Анна Матвеева',
        agent: 'Егорова',
        phone: '8-701-565621',
        email: 'matv@mail.ru',
        fax: '562365',
        req_bin: '123456789120',
        req_account: '12345678901234567890',
        req_bank: 'Народный банк Казахстана',
        req_bik: 'NKNAZXN',
        comment: 'Покупала в прошлом году, всё отлично. Опаздала с оплатой. Брала с рассрочкой',
        clientid: '134'
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
                    title="Клиент"
                />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                label="Наименование клиента"
                                margin="dense"
                                name="name"
                                onChange={handleChange}
                                required
                                value={values.name}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid
                            item
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
                            md={8}
                            xs={8}
                        >
                            <TextField
                                fullWidth
                                label="Контактный сотрудник"
                                margin="dense"
                                name="employee"
                                onChange={handleChange}
                                value={values.employee}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={4}
                        >
                            <TextField
                                fullWidth
                                label="Контактный телефон"
                                margin="dense"
                                name="phone"
                                onChange={handleChange}
                                value={values.phone}
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
                                label="Факс"
                                margin="dense"
                                name="fax"
                                onChange={handleChange}
                                value={values.fax}
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
                                value={values.email}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="БИН"
                                margin="dense"
                                name="req_bin"
                                onChange={handleChange}
                                required
                                value={values.req_bin}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="Лиц. счёт"
                                margin="dense"
                                name="req_account"
                                onChange={handleChange}
                                required
                                value={values.req_account}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={2}
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="БИК"
                                margin="dense"
                                name="req_bik"
                                onChange={handleChange}
                                required
                                value={values.req_bik}
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
                                label="Банк"
                                margin="dense"
                                name="req_bank"
                                onChange={handleChange}
                                required
                                value={values.req_bank}
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
                            id="outlined-multiline-flexible"
                            label="Дополнительно"
                            multiline
                            margin="dense"
                            rowsMax="5"
                            name="comment"
                            value={values.comment}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        </Grid>
                        <Grid
                            item
                            xs={1}
                        >
                            <TextField
                                fullWidth
                                disabled
                                name="created"
                                margin="dense"
                                id="filled-disabled"
                                label="Создан"
                                value={values.created}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            xs={11}
                        >
                            <TextField
                                fullWidth
                                disabled
                                name="agent"
                                margin="dense"
                                id="filled-disabled"
                                label="Агент"
                                value={values.agent}
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

export default ClientItem;
