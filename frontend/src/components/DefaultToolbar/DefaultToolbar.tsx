import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { SearchInput } from 'components';
import { useHistory } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

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

interface IDefaultToolbar {
    className: string,
    title: string,
    newItemTitle: string,
    newItemUrl: string,
    findCaption: string,
    showDelete: boolean,
    onFind: any,
    onDelete: any,
    icon?: any
}

const DefaultToolbar = (props: IDefaultToolbar) => {
    const history = useHistory();
    const { className, title, newItemTitle, newItemUrl, onFind, onDelete, findCaption, showDelete, ...rest } = props;

    const classes = useStyles();

    function onKeyDownHandler (event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim();
            onFind(findText);
        }
    }

    function onNewItemButtonHandler() {
        history.push(newItemUrl);
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

            <div className={classes.buttonGroup}>
                <span className={classes.spacer} />
                <Button color="primary" variant="contained" onClick={onNewItemButtonHandler}>{newItemTitle}</Button>
                {showDelete && <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>}
            </div>
            <div className={classes.row}>
                <SearchInput
                    className={classes.searchInput}
                    onEnterKeyDown={onKeyDownHandler}
                    placeholder={findCaption}
                />
            </div>
        </div>
    );
};

export default DefaultToolbar;
