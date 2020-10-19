import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Grid,
    Button,
    TextField,
    Paper,
    IconButton
} from '@material-ui/core';
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useDialog} from "components/SelectDialog"
import Alert from '@material-ui/lab/Alert';
import {DIALOG_CANCEL_TEXT, DIALOG_SELECT_TEXT, NEW_RECORD_TEXT, NEW_RECORD_VALUE} from "utils/AppConst";
import {IStateInterface} from "redux/rootReducer";
import {
    addNewMember,
    changeTeamItem,
    deleteMember,
    loadTeamItem,
    newTeam,
    updateTeam
} from "../../../redux/actions/teamAction";
import {MemberTable} from "../components";
import {loadEmployeeList} from "redux/actions/employeeAction";
import {ITeam} from "types/model/team";
import {IEmployeeListItem} from "types/model/employee";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {loadWorkList} from "../../../redux/actions/workAction";


interface ITeamItemProps {
    className: string,
    match: any
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    }
}));

const TeamItem = (props: ITeamItemProps) => {
    const history = useHistory()
    const classes = useStyles()
    const dispatch = useDispatch()
    const selectDialog = useDialog()

    const paramId = props.match.params.id;
    const teamId = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE : parseInt(paramId);
    const {className, ...rest} = props;

    const teamItem = useSelector((state: IStateInterface) => state.team.teamItem);
    const errorValue = useSelector((state: IStateInterface) => state.tare.error);
    const hasError = useSelector((state: IStateInterface) => state.tare.hasError);
    const emplItems = useSelector((state: IStateInterface) => state.employee.employeeItems)
    const workItems = useSelector((state: IStateInterface) => state.works.workItems)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...teamItem, [event.target.name]: event.target.value};
        dispatch(changeTeamItem(item))
    };

    /**
     * Сохранить изменения с ожиданием
     * @param dispatch
     */
    const saveItem = (dispatch: any) => new Promise(async (resolve, reject) => {
        try {
            if (teamId === NEW_RECORD_VALUE) {
                await dispatch(newTeam(teamItem));
            } else {
                await dispatch(updateTeam(teamItem));
            }
            resolve();
        } catch (e) {
            reject()
        }
    });

    /**
     * Сохранить изменения
     * @param event
     */
    const saveHandler = (event: React.SyntheticEvent) => {
        event.preventDefault();
        saveItem(dispatch).then(() => {
                history.push('/catalogs/team_template');
            }
        ).catch(() => {
            console.log('Error')
        }).finally(
            () => {
                console.log('saveHandler_end');
            }
        );
    }

    useEffect(() => {
            dispatch(loadTeamItem(teamId))
            dispatch(loadEmployeeList())
            dispatch(loadWorkList())
        }, [dispatch, teamId]
    )

    const changeEmployeeHandler = (id: number) => {
        selectDialog(
            {
                title: 'Выбор сотрудника',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: emplItems,
                initKey: 0,
                valueName: 'fio'
            }
        ).then((value: any) => {
                const item: ITeam = {...teamItem}
                const index = item.members.findIndex((item: IEmployeeListItem) => {
                    return item.id === id
                });
                item.members[index].id = value.id;
                item.members[index].fio = value.name;
                dispatch(changeTeamItem(item));
            }
        );
    }

    const handleChangeWork = () => {
        selectDialog(
            {
                title: 'Выбор вида работ',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: workItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item: ITeam = {...teamItem}
                item.work.id = value.id;
                item.work.name = value.name;
                dispatch(changeTeamItem(item));
            }
        );
    }

    const addNewEmployeeHandler = () => {
        dispatch(addNewMember())
    }

    const deleteEmployeeHandler = (id: number) => {
        dispatch(deleteMember(id))
    }

    return (
        <div className={classes.root}>
            <Card {...rest} className={className}>
                <form autoComplete="off" onSubmit={saveHandler}>
                    <CardHeader
                        subheader=""
                        title="Шаблон смены"
                    />
                    <Divider/>
                    {hasError &&
                    <Paper elevation={0}>
                        <Alert severity="error">{errorValue}</Alert>
                    </Paper>
                    }

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Название шаблона"
                                    margin="dense"
                                    name="name"
                                    onChange={handleChange}
                                    required
                                    value={teamItem.name}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                            >
                                <Paper elevation={0} className={classes.paper_root}>
                                    <TextField
                                        fullWidth
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        label="Вид работы"
                                        margin="dense"
                                        name="unit"
                                        required
                                        value={teamItem.work.name}
                                        variant="outlined"
                                    />
                                    <IconButton color="primary" className={classes.iconButton} aria-label="directions"
                                                onClick={handleChangeWork}>
                                        <MenuOpenIcon/>
                                    </IconButton>
                                </Paper>
                            </Grid>
                        </Grid>
                        <MemberTable
                            employees={teamItem.members}
                            onChangeEmployee={changeEmployeeHandler}
                            onAddNewEmployee={addNewEmployeeHandler}
                            onDeleteEmployee={deleteEmployeeHandler}
                        />
                    </CardContent>
                    <Divider/>
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            type={"submit"}
                        >
                            Сохранить
                        </Button>
                        <Button
                            color="default"
                            variant="contained"
                            onClick={(event => history.push('/catalogs/team_template'))}
                        >
                            Отменить
                        </Button>
                    </CardActions>
                </form>
            </Card>
        </div>
    );
};

export default TeamItem;
