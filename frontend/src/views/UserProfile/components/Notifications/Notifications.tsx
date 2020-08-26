import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Divider,
  colors
} from '@material-ui/core';
import {IProfile} from "types/model/user";

interface INotificationsProps {
    className: string;
    profile: IProfile;
    changeData: any;
    saveData: any;
}
const useStyles = makeStyles(theme => ({
  root: {},
  item: {
    display: 'flex',
    flexDirection: 'column'
  },
  saveButton: {
    color: theme.palette.common.white,
    backgroundColor: colors.green[600],
    '&:hover': {
      backgroundColor: colors.green[900]
    }
  }
}));


const Notifications = (props: INotificationsProps) => {
    const { className, profile, changeData, saveData, ...rest } = props;

    const classes = useStyles();

    return (
<Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title="Уведомления" />
      <Divider />
      <CardContent>
        <form>
          <Grid
            container
            spacing={6}
            wrap="wrap"
          >
            <Grid
              className={classes.item}
              item
              md={4}
              sm={6}
              xs={12}
            >
              <Typography
                gutterBottom
                variant="h6"
              >
                Системные
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
              >
                Уведомления в приложении
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name='ntfPassword'
                    checked={profile.ntfPassword}
                    onChange={changeData}
                  />
                }
                label="Устаревший пароль"
              />

            </Grid>
            <Grid
              className={classes.item}
              item
              md={4}
              sm={6}
              xs={12}
            >
              <Typography
                gutterBottom
                variant="h6"
              >
                Приложение
              </Typography>
              <Typography
                gutterBottom
                variant="body2"
              >
                Уведомления в приложении
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name='ntfPayment'
                    checked={profile.ntfPayment}
                    onChange={changeData}
                  />
                }
                label="Срок оплаты контрактов"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="ntfClaim"
                    checked={profile.ntfClaim}
                    onChange={changeData}
                  />
                }
                label="Контроль претензионной работы"
              />
              <FormControlLabel
                control={
                  <Checkbox
                     color="primary"
                     name="ntfCtlContract"
                     checked={profile.ntfCtlContract}
                     onChange={changeData}
                  />
                  }
                  label="Контроль контрактов"
                  />
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          className={classes.saveButton}
          variant="contained"
          onClick={saveData}
        >
          Сохранить
        </Button>
      </CardActions>
    </Card>
    )
}

export default Notifications