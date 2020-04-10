import React from 'react';
import { makeStyles } from '@material-ui/styles';

import { Topbar } from './components';

const useStyles = makeStyles(() => ({
    root: {
        paddingTop: 64,
        height: '100%'
    },
    content: {
        height: '100%'
    }
}));

interface IMinimal {
    children: React.ReactNode,
    classname: string
}

const Minimal = (props:IMinimal) => {
    const { children, classname } = props;

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Topbar className={classname}/>
            <main className={classes.content}>{children}</main>
        </div>
    );
};

export default Minimal;
