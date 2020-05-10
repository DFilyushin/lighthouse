import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Drawer } from '@material-ui/core';
import { Profile } from './components';
import Navigation from "components/Navigation";
import navigationConfig from './navigationsConfig';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    overflowY: 'auto'
  },
  drawer: {
    width: 260,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  content: {
    padding: theme.spacing(2)
  },
  profile: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  },
  divider: {
    marginTop: theme.spacing(2)
  },
  navigation: {
    marginTop: theme.spacing(2)
  }
}));

interface ISidebar {
  open: boolean,
  variant: 'permanent' | 'persistent' | 'temporary',
  onClose: any,
  className?: string,
  comps?: any
}

const Sidebar = (props:ISidebar) => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();

  return (

    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div className={classes.content}>
          <Profile />


        <Divider className={classes.divider} />

        <nav className={classes.navigation}>
          {navigationConfig.map(list => (
              <Navigation
                  component="div"
                  key={list.title}
                  pages={list.pages}
                  title={list.title}
              />
          ))}
        </nav>
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebar;
