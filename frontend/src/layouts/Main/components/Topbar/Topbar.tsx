import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Badge, Hidden, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { common } from '@material-ui/core/colors';
import Box from "@material-ui/core/Box";
import {ReactComponent as Lighthouse} from "images/logo.svg"
import {ReactComponent as Lighthouse1} from "images/lighthouse_1.svg";
import {ReactComponent as Lighthouse2} from "images/lighthouse_2.svg";
import {ReactComponent as Lighthouse3} from "images/lighthouse_3.svg";
import {ReactComponent as Lighthouse4} from "images/lighthouse_4.svg";
import {ReactComponent as Lighthouse5} from "images/lighthouse_5.svg";
import {ReactComponent as Lighthouse6} from "images/lighthouse_6.svg";
import {ReactComponent as Lighthouse7} from "images/lighthouse_7.svg";
import {ReactComponent as Lighthouse8} from "images/lighthouse_8.svg";

const useStyles = makeStyles(theme => ({
  root: {
    boxShadow: 'none'
  },
  flexGrow: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
  },
  signOutButton: {
    marginLeft: theme.spacing(1)
  },
  large: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  orange: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
  },
}));

interface ITopbar {
  className?: string,
  onSidebarOpen?: any,
  onSignout?: any
}

const Topbar = (props: ITopbar) => {
  const { className, onSidebarOpen, onSignout, ...rest } = props;

  const classes = useStyles();

  const [notifications] = useState([]);

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
          <Lighthouse6 />
          </Avatar>
        <Box display={{ xs: 'none', md: 'block', lg: 'block', xl: 'block' }}>
          <Typography variant="h6" className={classes.title} >
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
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
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
