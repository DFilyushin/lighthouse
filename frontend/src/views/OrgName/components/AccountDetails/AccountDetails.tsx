import React, {useEffect, SyntheticEvent} from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core'
import {IOrganization} from 'types/model/org'
import { useHistory } from "react-router-dom"
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "redux/rootReducer"
import {changeOrganization, loadOrganization, saveOrganization} from "redux/actions/organizationAction"



const useStyles = makeStyles(() => ({
  root: {}
}));

interface IAccountDetails {
  className: string
}

const AccountDetails = (props: IAccountDetails) => {
  const { className, ...rest } = props
  const classes = useStyles()
  const history = useHistory()
  const dispatch = useDispatch()

  const orgItem  = useSelector((state: IStateInterface)=> state.org.org)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const item:IOrganization = {
      ...orgItem,
      [event.target.name]: event.target.value
    }
    dispatch(changeOrganization(item))
  }


  const saveItem = (dispatch:any) => new Promise(async (resolve, reject) => {
    try {
        await dispatch(saveOrganization(orgItem))
      resolve()
    }catch (e) {
      reject()
    }
  })

  /**
   * Сохранить изменения
   * @param event
   */
  const saveHandler = (event: SyntheticEvent) => {
    event.preventDefault()
      saveItem(dispatch).then(() => {
          }
      )
  }

  useEffect(() => {
    dispatch(loadOrganization())
  }, [dispatch])


  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        onSubmit={saveHandler}
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
                value={orgItem.name}
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
                value={orgItem.addrReg}
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
                value={orgItem.contactPhone}
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
                value={orgItem.contactEmail}
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
                  value={orgItem.contactFax}
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
                  value={orgItem.reqBin}
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
                  value={orgItem.reqAccount}
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
                  value={orgItem.reqBank}
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
                  value={orgItem.reqBik}
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
                  value={orgItem.bossName}
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
            type={'submit'}
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
    </Card>
  );
};

export default AccountDetails;