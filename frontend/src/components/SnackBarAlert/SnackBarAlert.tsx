import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps, Color } from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

interface ISnackBarAlert {
    typeMessage: Color,
    messageText: string,
    isOpen: boolean,
    onSetOpenState: any
}

export default function SnackBarAlert (props: ISnackBarAlert) {
    const classes = useStyles();
    const { typeMessage, messageText, isOpen, onSetOpenState } = props;

    // const [open, setOpen] = React.useState(isOpen);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        onSetOpenState(false);
    };

    return (
        <div className={classes.root}>
            <Snackbar open={isOpen} autoHideDuration={2000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={typeMessage}>
                    {messageText}
                </Alert>
            </Snackbar>
        </div>
    );
}
