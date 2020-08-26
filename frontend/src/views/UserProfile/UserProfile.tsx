import React, {useEffect, useState} from "react";
import {Page} from "../../components";
import {makeStyles} from "@material-ui/core/styles";
import {
    colors,
    Tabs,
    Tab,
    Divider
} from "@material-ui/core";
import {General, Notifications, Security} from "./components";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "../../redux/rootReducer";
import {changeProfile, loadUserProfile, saveUserProfile} from "../../redux/actions/userAction";
import {IProfile} from "../../types/model/user";
import {showInfoMessage} from "../../redux/actions/infoAction";

interface IUserProfileProps {
    login: string
}

const useStyles = makeStyles(theme => ({
    root: {
        width: theme.breakpoints.values.lg,
        maxWidth: '100%',
        margin: '0 auto',
        padding: theme.spacing(3)
    },
    tabs: {
        marginTop: theme.spacing(3)
    },
    divider: {
        backgroundColor: colors.grey[300]
    },
    content: {
        marginTop: theme.spacing(3)
    }
}));

const tabs = [
    { value: 'main', label: 'Основное' },
    { value: 'notifications', label: 'Уведомления' },
    { value: 'security', label: 'Безопасность' }
];

const UserProfile = (props: IUserProfileProps) => {

    const classes = useStyles();
    const [tab, setTab] = useState('main')

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setTab(newValue)
    };

    const dispatch = useDispatch()
    const profile = useSelector((state: IStateInterface) => state.user.userProfile);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const newItem: IProfile = {...profile, [event.target.name]: event.target.type === 'checkbox'
            ? event.target.checked
            : event.target.value}
            dispatch(changeProfile(newItem))
    }


    const saveProfile= (dispatch:any) => new Promise(async (resolve, reject) => {
        try{
            await dispatch( saveUserProfile({...profile}))
            resolve()
        }catch (e) {
            reject(e)
        }
    })

    const saveChange = () => {
        saveProfile(dispatch).then( ()=>{
                console.log('ok')
            }
        ).catch( (e)=> {
                console.log('Ошибка при сохранении:', e.message)
                dispatch(showInfoMessage('error', 'Данные не были сохранены!'))
            }
        )
    }

    useEffect(()=> {
        dispatch(loadUserProfile())
    }, [dispatch])

    return (
        <Page
            className={classes.root}
            title="Settings"
        >

            <Tabs
                className={classes.tabs}
                onChange={handleTabChange}
                scrollButtons="auto"
                value={tab}
                variant="scrollable"
            >
                {tabs.map(tab => (
                    <Tab
                        key={tab.value}
                        label={tab.label}
                        value={tab.value}
                    />
                ))}
            </Tabs>
            <Divider className={classes.divider} />
            <div className={classes.content}>
                {tab === 'main' && <General className={''} profile={profile} changeData={handleChange} saveData={saveChange}/>}
                {tab === 'notifications' && <Notifications profile={profile} className={''} changeData={handleChange} saveData={saveChange}/>}
                {tab === 'security' && <Security className={''} />}
            </div>
        </Page>
    )
}

export default UserProfile