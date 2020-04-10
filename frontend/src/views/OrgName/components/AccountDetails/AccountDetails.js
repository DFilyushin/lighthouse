import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
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

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  const [values, setValues] = useState({
    orgName: 'Павлодарский агрохимический комплекс',
    orgAddress: 'Павлодар, Промышленная 5 строение 1',
    email: 'agromprom@agrohim.kz',
    phone: '8-7182-554501',
    fax: '536655',
    bank: 'АО Народный банк Казахстана',
    bin: '012345678911',
    account: 'MMBN3012 0000 0000 0000 0000',
    bik: 'KZNARNAK',
    boss: 'Первый руководитель предприятия'
  });

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          subheader="Регистрационные данные"
          title="Профиль организации"
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
                helperText="Полное наименование предприятия"
                label="Наименование"
                margin="dense"
                name="name"
                onChange={handleChange}
                required
                value={values.orgName}
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
                value={values.orgAddress}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                label="Контактные телефоны"
                margin="dense"
                name="cont_phone"
                onChange={handleChange}
                required
                value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email"
                margin="dense"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
                item
                md={4}
                xs={12}
            >
              <TextField
                  fullWidth
                  label="Факс"
                  margin="dense"
                  name="fax"
                  onChange={handleChange}
                  required
                  value={values.fax}
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
                  label="БИН"
                  margin="dense"
                  name="req_bin"
                  onChange={handleChange}
                  required
                  value={values.bin}
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
                  label="Лицевой счёт"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.account}
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
                  label="Банк"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.bank}
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
                  label="БИК"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.bik}
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
                  label="Руководитель"
                  margin="dense"
                  name="email"
                  onChange={handleChange}
                  required
                  value={values.boss}
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
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
