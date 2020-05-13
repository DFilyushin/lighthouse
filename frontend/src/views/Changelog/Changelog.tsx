import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    content: {
        paddingTop: 150,
        textAlign: 'center'
    },
    image: {
        marginTop: 50,
        display: 'inline-block',
        maxWidth: '100%',
        width: 560
    }
}));

const Changelog = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid
                container
                justify="center"
                spacing={4}
            >
                <Grid
                    item
                    lg={6}
                    xs={12}
                >
                    <div className={classes.content}>
                        <Typography variant="h2">
                            Изменения
                        </Typography>
                        <Typography variant="subtitle2">
                            ...
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default Changelog;
