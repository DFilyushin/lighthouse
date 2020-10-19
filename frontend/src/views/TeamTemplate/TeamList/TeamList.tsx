import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {TeamTable} from '../components';
import CircularIndeterminate from "components/Loader/Loader";
import {DefaultToolbar} from 'components';
import {IStateInterface} from "redux/rootReducer";
import FilterNoneIcon from '@material-ui/icons/FilterNone';
import {useConfirm} from "material-ui-confirm";
import {DIALOG_ASK_DELETE, DIALOG_NO, DIALOG_TYPE_CONFIRM, DIALOG_YES} from "utils/AppConst";
import {deleteTeam, loadTeamTemplateList} from "../../../redux/actions/teamAction";


const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(3)
    },
    content: {
        marginTop: theme.spacing(2)
    }
}));

const TeamList = () => {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();
    const confirm = useConfirm();


    const teamTemplates = useSelector((state: IStateInterface) => state.team.teamItems);
    const isLoading = useSelector((state: IStateInterface) => state.team.isLoading);
    const [selected, setSelected] = useState<number[]>([]);

    useEffect(() => {
            dispatch(loadTeamTemplateList())
        }, [dispatch]
    );

    async function onFindTemplateHandler(findText: string) {
        dispatch(loadTeamTemplateList(findText))
    }

    function onDeleteHandle() {
        if (selected.length === 0) return;
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            selected.forEach(async (item) => {
                dispatch(deleteTeam(item))
            })
        )
    }

    function onClickTableItem(teamId: number) {
        const newItemUrl = `/catalogs/team_template/${teamId}`;
        history.push(newItemUrl);
    }

    return (
        <div className={classes.root}>
            <DefaultToolbar
                className={''}
                title={'Шаблоны смен'}
                newItemTitle={'Новый шаблон'}
                newItemUrl={'/catalogs/team_template/new'}
                findCaption={'Поиск шаблона'}
                showDelete={true}
                onFind={onFindTemplateHandler}
                onDelete={onDeleteHandle}
                icon={<FilterNoneIcon color={"primary"} />}
            />
            <div className={classes.content}>
                {isLoading ? <CircularIndeterminate/>
                    :
                    <TeamTable
                        teamItems={teamTemplates}
                        onClickItem={onClickTableItem}
                        className={''}
                        onChangeSelected={setSelected}
                    />
                }
            </div>
        </div>
    )
}

export default TeamList;
