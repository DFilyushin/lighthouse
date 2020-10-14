import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import {Typography, Button, List, ListItem, Avatar} from '@material-ui/core';
import {SearchInput} from 'components';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {},
    buttonGroup: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    row: {
        height: '42px',
        display: 'flex',
        alignItems: 'center',
        marginTop: theme.spacing(1),
        margin: theme.spacing(1),
    },
    spacer: {
        flexGrow: 1
    },
    importButton: {
        marginRight: theme.spacing(1)
    },
    exportButton: {
        marginRight: theme.spacing(1)
    },
    searchInput: {
        marginRight: theme.spacing(1)
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
    white: {
        color: theme.palette.grey["100"],
        backgroundColor: theme.palette.background.default
    }

}));

interface IStoreToolbar {
    className: string,
    title: string,
    onFind?: any,
    icon?: any,
    onFindCaption?: string
    onReturn?: string
}

const StoreToolbar = (props: IStoreToolbar) => {
    const {className, title, onFind, onFindCaption, onReturn, ...rest} = props;
    const classes = useStyles();
    const history = useHistory();

    function onKeyDownHandler(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            const findText = event.currentTarget.value.trim();
            onFind(findText);
        }
    }

    function onReturnClick() {
        history.goBack()
    }

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={clsx(classes.large, classes.white)}> {rest.icon} </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">{title}</Typography>
                </ListItem>
            </List>

            {onFind &&
            <div className={classes.row}>
                <SearchInput
                    className={classes.searchInput}
                    onEnterKeyDown={onKeyDownHandler}
                    placeholder={onFindCaption}
                />
            </div>
            }

            {
                onReturn &&
                <Button
                    variant="contained"
                    color={"primary"}
                    onClick={onReturnClick}
                >
                    Вернуться
                </Button>
            }
        </div>
    );
};

export default StoreToolbar;
