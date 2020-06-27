import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { UsersToolbar, UsersTable } from '../components/index';
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {loadUserList} from "redux/actions/userAction";
import {useHistory} from "react-router-dom";
import {SearchInput} from "components";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
    searchInput: {
        marginRight: theme.spacing(1)
    }
}));

const UserList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const users = useSelector((state: IStateInterface) => state.user.userItems);

    useEffect(()=>{
        dispatch(loadUserList(true, ''))
    }, [dispatch])

    function onClickTableItem(login: string){
        const newItemUrl = `/admin/users/${login}`;
        //console.log(newItemUrl)
        history.push(newItemUrl);
    }

    function onKeyDownHandler (event: any) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim();
            onFindHandler(findText);
        }
    }

    function onNewAccount() {
        history.push('/admin/users/new')
    }

    async function onFindHandler(findText: string){
        dispatch(loadUserList(true, findText))
    }

  return (
    <div className={classes.root}>
      <UsersToolbar
        onNewRecord={onNewAccount}
      />
        <SearchInput
            className={classes.searchInput}
            onEnterKeyDown={onKeyDownHandler}
            placeholder='Поиск по логину'
        />
      <div className={classes.content}>
        <UsersTable
            users={users}
            className={''}
            onClickItem={onClickTableItem}
        />
      </div>
    </div>
  );
};

export default UserList;
