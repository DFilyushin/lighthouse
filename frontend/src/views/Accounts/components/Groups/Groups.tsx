import React, {useEffect, Fragment} from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    Checkbox
}from '@material-ui/core';
import {IUserGroup} from "types/model/user";
import {useDispatch, useSelector} from "react-redux";
import {loadGroupList} from "redux/actions/userAction";
import {IStateInterface} from "redux/rootReducer";

interface IGroupProps {
    userGroups: IUserGroup[];
    onChangeGroups: any
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        formControl: {
            margin: theme.spacing(3),
        },
    }),
);

const Groups = (props: IGroupProps) => {
    const { userGroups, onChangeGroups } = props;

    const classes = useStyles();
    const dispatch = useDispatch();

    const availableGroups = useSelector((state: IStateInterface)=> state.user.groups);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedGroup = availableGroups.find(x=>x.name === event.target.name)
        onChangeGroups(selectedGroup, event.target.checked)
    };

    useEffect(()=>{
        dispatch(loadGroupList())
    }, [dispatch])

    function getGroupState(groupName: string): boolean {
        return userGroups.some(item=> item.name === groupName)
    }

    return (
        <div className={classes.root}>
            <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Пользовательские группы</FormLabel>
                <FormGroup>
                    {availableGroups.map(group=>
                        (
                            <Fragment>
                                <FormControlLabel key={group.name}
                                    control={<Checkbox checked={getGroupState(group.name)} name={group.name} onChange={handleChange} />}
                                    label={group.description}
                                />
                            </Fragment>
                        )
                    )}
                </FormGroup>
            </FormControl>
        </div>
    )
}

export default Groups
