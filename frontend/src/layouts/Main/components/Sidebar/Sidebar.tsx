import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import StorageIcon from '@material-ui/icons/Storage';
import { Profile, SidebarNav } from './components';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import BusinessIcon from '@material-ui/icons/Business';
import LibraryBooksOutlinedIcon from '@material-ui/icons/LibraryBooksOutlined';
import FactorySVGIcon from "../../../../components/icons/Factory";
import ContractSvgIcon from "../../../../components/icons/Contract";
import EmployeeSvgIcon from "../../../../components/icons/Employee";

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    //backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
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

  const pages = [
    {
      title: 'Монитор дел',
      href: '/dashboard',
      icon: <DashboardIcon />
    },
    {
      title: 'Каталоги',
      href: '/catalogs',
      icon: <StorageIcon />
    },
    {
      title: 'Договоры',
      href: '/products',
      icon: <LibraryBooksOutlinedIcon />
    },
    {
      title: 'Клиенты',
      href: '/clients',
      icon: <GroupOutlinedIcon />
    },
    {
      title: 'Производство',
      href: '/factory',
      icon: <FactorySVGIcon/>
    },
    {
      title: 'Контракты',
      href: '/contracts',
      icon: <ContractSvgIcon />
    },
    {
      title: 'Заказы',
      href: '/orders',
      icon: <EmployeeSvgIcon />
    },
    {
      title: 'Организация',
      href: '/org',
      icon: <BusinessIcon />
    },
    {
      title: 'Сотрудники',
      href: '/employees',
      icon: <PeopleIcon />
    },
    {
      title: 'Сотрудник',
      href: '/employee',
      icon: <PeopleIcon />
    }
  ];

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
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

export default Sidebar;
