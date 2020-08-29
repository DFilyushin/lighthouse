import React, {useEffect} from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Badge, Hidden, IconButton, Box, Typography, colors, Avatar } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined'
import InputIcon from '@material-ui/icons/Input'
import logo from 'images/logo.png'
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "../../../../redux/rootReducer";
import {loadNotification} from "../../../../redux/actions/notificationAction";
import {MINUTES_30_TIMES} from "../../../../utils/AppConst";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    color: theme.palette.getContrastText(colors.common.black)
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  orange: {
    color: theme.palette.getContrastText(colors.common.white),
    backgroundColor: colors.common.white,
  },
}));

interface ITopbar {
  className?: string,
  onSidebarOpen?: any,
  onSignout?: any
}

const Topbar = (props: ITopbar) => {
  const { className, onSidebarOpen, onSignout, ...rest } = props;

  const classes = useStyles()
  const dispatch = useDispatch()

  const notices = useSelector((state: IStateInterface)=> state.notification.notices)

  const getNotification = () => {
    dispatch(loadNotification())
  }

  useEffect( ()=>{
    getNotification();
    setInterval(getNotification, MINUTES_30_TIMES);
  }, [] )

  return (
    <AppBar
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Toolbar>
        <Hidden lgUp>
          <IconButton
              color="inherit"
              onClick={onSidebarOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Avatar className={clsx(classes.large, classes.orange)} variant='circle' >
          <img src={logo} alt="Logo" height={32} width={32} />
          </Avatar>
        <Box display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }}>
          <Typography variant="h4" className={classes.title} >
            &nbsp; Lighthouse - Управление производством
          </Typography>
        </Box>
        <Box display={{ xs: 'block', md: 'none', lg: 'none', xl: 'none' }}>
          <Typography variant="h6" className={classes.title} >
            &nbsp; Lighthouse
          </Typography>
        </Box>
        <div className={classes.flexGrow} />

          <IconButton color="inherit">
            <Badge
              badgeContent={notices.length}
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton
            className={classes.signOutButton}
            color="inherit"
            onClick={onSignout}
          >
            <InputIcon />
          </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
