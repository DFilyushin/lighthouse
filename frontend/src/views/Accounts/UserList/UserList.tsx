import React, {useEffect, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { UsersToolbar, UsersTable } from '../components/index'
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "redux/rootReducer"
import {deleteUser, loadUserList} from "redux/actions/userAction"
import {useHistory} from "react-router-dom"
import {SearchInput} from "components"
import {
    Switch,
    FormControlLabel
} from '@material-ui/core'
import CircularIndeterminate from "../../../components/Loader/Loader";
import {useConfirm} from "material-ui-confirm";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "../../../utils/AppConst";

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
    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const confirm = useConfirm()

    const users = useSelector((state: IStateInterface) => state.user.userItems)
    const isLoading = useSelector((state: IStateInterface) => state.user.isLoading);
    const [showHidden, setShowHidden] = useState(false)

    useEffect(()=>{
        dispatch(loadUserList(!showHidden, ''))
    }, [dispatch, showHidden])


    function onClickTableItem(login: string){
        const newItemUrl = `/admin/users/${login}`
        history.push(newItemUrl)
    }

    /**
     * Удалить пользователя
     * @param login
     */
    function onDeleteTableItem(login: string){
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteUser(login))
        )

    }

    function onKeyDownHandler (event: any) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim()
            onFindHandler(findText)
        }
    }

    function onNewAccount() {
        history.push('/admin/users/new')
    }

    async function onFindHandler(findText: string){
        dispatch(loadUserList(true, findText))
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowHidden(event.target.checked);
    };

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
        <FormControlLabel
            control={
                <Switch
                    checked={showHidden}
                    onChange={handleChange}
                    color="primary"
                />
            }
            label="Отображать  блокированных"
        />

        <div className={classes.content}>

            {isLoading ? <CircularIndeterminate/>
                :
                <UsersTable
                    users={users}
                    className={''}
                    onClickItem={onClickTableItem}
                    onDeleteItem={onDeleteTableItem}
                />
            }
      </div>
    </div>
  );
};

export default UserList;
