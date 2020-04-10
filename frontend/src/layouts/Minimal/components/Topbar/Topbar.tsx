import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

interface ITopbar {
    className: string
};

const useStyles = makeStyles((theme) => ({
    root: {
        boxShadow: 'none',
    },
    menuButton: {
        marginRight: theme.spacing(1)
    },
    title: {
        flexGrow: 1,
    },
}));

const Topbar = (props: ITopbar) => {
    const { className, ...rest } = props;

    const classes = useStyles();

    return (
        <AppBar
            {...rest}
            className={clsx(classes.root, className)}
            color="primary"
            position="fixed"
        >
            <Toolbar>
                <Typography variant="h6" className={classes.title}>
                    Lighthouse
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
