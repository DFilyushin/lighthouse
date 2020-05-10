import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
import { SearchInput } from 'components';
import { useHistory } from "react-router-dom";

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
    onDelete: any
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
            <Typography variant="h5">{title}</Typography>
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
