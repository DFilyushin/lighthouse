import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { EmployeeTable, EmployeeToolbar } from './components';
import mockData from './data';
import {IEmployeeTableItem} from 'types/Interfaces';

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
    const [employees] = useState<IEmployeeTableItem[]>(mockData);

    return (
        <div className={classes.root}>
            <EmployeeToolbar/>
            <div className={classes.content}>
                <EmployeeTable employees={employees} className={''}/>
            </div>
        </div>
    );
};

export default UserList;
