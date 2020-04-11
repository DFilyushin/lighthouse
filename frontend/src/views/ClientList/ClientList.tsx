import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { ClientTable, ClientToolbar } from './components';
import mockData from './data';
import {IClientItem} from '../../IInterfaces';


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const ClientList = () => {
    const classes = useStyles();

    // @ts-ignore
    const [clients] = useState<IClientItem[]>(mockData);

    return (
        <div className={classes.root}>
            <ClientToolbar/>
            <div className={classes.content}>
                <ClientTable clients={clients} className={''}/>
            </div>
        </div>
    );
};

export default ClientList;
