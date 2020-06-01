import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
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
import {IOrganization} from 'types/model/org';
import axios from "axios";
import OrganizationEndpoint from 'services/endpoints/OrgEndpoint';
import { useHistory } from "react-router-dom";
import SnackBarAlert from 'components/SnackBarAlert';
import {Color} from "@material-ui/lab/Alert";


const useStyles = makeStyles(() => ({
  root: {}
}));


const nullOrganization =  {
  name: '',
  addrReg: '',
  contactEmail: '',
  contactPhone: '',
  contactFax: '',
  reqBank: '',
  reqBin: '',
  reqAccount: '',
  reqBik: '',
  bossName: ''
};

interface IAccountDetails {
  className: string
}

const AccountDetails = (props: IAccountDetails) => {
  const { className, ...rest } = props;
  const classes = useStyles();
  const history = useHistory();
  const [values, setValues] = useState<IOrganization>(nullOrganization);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  async function loadData() {
    const response = await axios.get(OrganizationEndpoint.getOrg());
    const data = await response.data;
    setValues(data);
  };

  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState('');
  const [typeAlert, setTypeAlert] = useState<Color>('success');

  async function saveOrg() {
    const saveUrl = OrganizationEndpoint.putOrg();
    try{
      const response = await axios.put(saveUrl, values);
      if (response.status === 200){
        setMessageAlert('Реквизиты сохранены');
        setShowAlert(true);
      }else{
        setTypeAlert('error')
        setMessageAlert('Ошибка при сохранении данных!')
        console.log(response.statusText)
      }
    }
    catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    loadData();
  }, []);


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
                value={values?.name}
                variant="outlined"
                inputProps={{'maxLength': 255 }}
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
                name="addrReg"
                onChange={handleChange}
                required
                value={values?.addrReg}
                variant="outlined"
                inputProps={{'maxLength': 512 }}
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
                name="contactPhone"
                onChange={handleChange}
                required
                value={values?.contactPhone}
                variant="outlined"
                inputProps={{'maxLength': 100 }}
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
                name="contactEmail"
                onChange={handleChange}
                required
                value={values?.contactEmail}
                variant="outlined"
                inputProps={{'maxLength': 100 }}
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
                  name="contactFax"
                  onChange={handleChange}
                  required
                  value={values?.contactFax}
                  variant="outlined"
                  inputProps={{'maxLength': 100 }}
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
                  name="reqBin"
                  onChange={handleChange}
                  required
                  value={values?.reqBin}
                  variant="outlined"
                  inputProps={{'maxLength': 12 }}
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
                  name="reqAccount"
                  onChange={handleChange}
                  required
                  value={values?.reqAccount}
                  variant="outlined"
                  inputProps={{'maxLength': 20 }}
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
                  name="reqBank"
                  onChange={handleChange}
                  required
                  value={values?.reqBank}
                  variant="outlined"
                  inputProps={{'maxLength': 255 }}
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
                  name="reqBik"
                  onChange={handleChange}
                  required
                  value={values?.reqBik}
                  variant="outlined"
                  inputProps={{'maxLength': 10 }}
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
                  name="bossName"
                  onChange={handleChange}
                  required
                  value={values?.bossName}
                  variant="outlined"
                  inputProps={{'maxLength': 255 }}
              />
            </Grid>

          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={saveOrg}
          >
            Сохранить
          </Button>
          <Button
              color="secondary"
              variant="contained"
              onClick={(event => history.push('/'))}
          >
            Отменить
          </Button>
        </CardActions>
      </form>
      <SnackBarAlert
          typeMessage={typeAlert}
          messageText={messageAlert}
          isOpen={showAlert}
          onSetOpenState={setShowAlert}
      />
    </Card>
  );
};

export default AccountDetails;