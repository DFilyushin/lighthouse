import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UsersToolbar, UsersTable } from '../components/index';
import mockData from '../data';
import {IUserData} from 'types/model/user';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const UserList = () => {
  const classes = useStyles();

  // @ts-ignore
    const [users] = useState<IUserData[]>(mockData);

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable users={users} className={''}/>
      </div>
    </div>
  );
};

export default UserList;
