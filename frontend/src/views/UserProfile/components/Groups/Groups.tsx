import React from 'react';
import clsx from 'clsx';
import {makeStyles} from "@material-ui/core/styles";
import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    Divider,
    colors
} from '@material-ui/core';
import {IUserGroup} from "../../../../types/model/user";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';


interface IGroupSettingsProps {
    className: string;
    groups: IUserGroup[];
}

const useStyles = makeStyles(theme => ({
    root: {},
    saveButton: {
        color: theme.palette.common.white,
        backgroundColor: colors.green[600],
        '&:hover': {
            backgroundColor: colors.green[900]
        }
    }
}));

const Groups = (props: IGroupSettingsProps) => {
    const {groups, className, ...rest } = props;

    const classes = useStyles();

    return (
        <Card
            {...rest}
            className={clsx(classes.root, className)}
        >
                <CardHeader title="Группы" />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={4}
                    >
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                            <List component="nav" aria-label="main mailbox folders">
                            {
                                groups.map(item=>(
                                        <ListItem button key={item.name}>{item.name}</ListItem>
                                ))
                            }
                            </List>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
        </Card>
    );
}

export default Groups
