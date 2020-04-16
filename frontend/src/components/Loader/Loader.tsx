import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const SPINNER_SIZE = 40;
const THICKNESS = 4;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& > * + *': {
                marginLeft: theme.spacing(2),
            },
        },
        topMargin: {
            '& > * + *': {
                marginTop: theme.spacing(4),
            }
        }
    }),
);

export default function CircularIndeterminate() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography component="div">
            <Box textAlign="center" m={1}>
                Подождите, пожалуйста, данные загружаются...
            </Box>
                <Box textAlign="center" className={classes.topMargin} m={4}>
                    <CircularProgress size={SPINNER_SIZE} thickness={THICKNESS}/>
                </Box>
            </Typography>
        </div>
    );
}
