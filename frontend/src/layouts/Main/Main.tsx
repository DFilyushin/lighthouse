import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { Sidebar, Topbar } from './components';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import AuthenticationService from 'services/Authentication.service'
import {useHistory} from "react-router-dom";
import SnackBarAlert from "../../components/SnackBarAlert/SnackBarAlert";
import {useDispatch, useSelector} from "react-redux";
import {hideInfoMessage} from "../../redux/actions/infoAction";
import {IStateInterface} from "../../redux/rootReducer";

const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: 56,
        height: '100%',
        [theme.breakpoints.up('sm')]: {
            paddingTop: 64
        }
    },
    shiftContent: {
        paddingLeft: 200
    },
    content: {
        height: '100%'
    }
}));

interface IMainProps {
    children: React.ReactNode
}

const Main = (props: IMainProps) => {
    const history = useHistory();
    const { children } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
        defaultMatches: true
    });
    const dispatch = useDispatch();
    const messageText = useSelector((state: IStateInterface) => state.info.messageText);
    const messageType = useSelector((state:IStateInterface) => state.info.messageType);
    const hasError = useSelector((state:any) => state.info.hasMessage);
    const handleCloseAlert = (event?: React.SyntheticEvent, reason?: string) => {
        dispatch(hideInfoMessage())
    };
    const [open, setOpen] = React.useState(false);
    const [openSidebar, setOpenSidebar] = useState(false);
    const userGroups =  AuthenticationService.getUserGroups()

    const handleSidebarOpen = () => {
        setOpenSidebar(true);
    };

    const handleSidebarClose = () => {
        setOpenSidebar(false);
    };

    const handleSignout = () => {
        handleClickOpen()
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseOk = () => {
        setOpen(false);
        AuthenticationService.logout();
        history.push("/");
    };
    const handleClose = () => {
        setOpen(false);
    };

    const shouldOpenSidebar = isDesktop ? true : openSidebar;

    return (
        <div
            className={clsx({
                [classes.root]: true,
                [classes.shiftContent]: isDesktop
            })}
        >
            <Topbar onSidebarOpen={handleSidebarOpen} onSignout={handleSignout} />
            <Sidebar
                onClose={handleSidebarClose}
                groups={userGroups}
                open={shouldOpenSidebar}
                variant={isDesktop ? 'persistent' : 'temporary'}
            />
            <main className={classes.content}>
                {children}
            </main>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Подтверждение"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Выйти из приложения?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Отменить
                    </Button>
                    <Button onClick={handleCloseOk} color="primary" autoFocus>
                        Ок
                    </Button>
                </DialogActions>
            </Dialog>
            <SnackBarAlert
                typeMessage={messageType}
                messageText={messageText}
                isOpen={hasError}
                onSetOpenState={handleCloseAlert}
            />
        </div>
    );
};

export default Main;
