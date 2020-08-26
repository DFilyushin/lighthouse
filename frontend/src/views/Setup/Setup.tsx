import React, {useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
    Typography,
    Divider,
    colors,
    Grid,
    TextField,
    Card,
    CardContent,
    CardActions,
    Button
} from '@material-ui/core'
import {Page} from "components"
import {useDispatch, useSelector} from "react-redux"
import {IStateInterface} from "../../redux/rootReducer"
import {
    changeNdsValue,
    changeReserveInterval,
    getSetupNdsRate,
    getSetupReserveInterval,
    updateSetupNdsRate
} from "../../redux/actions/setupAction"
import clsx from "clsx";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(4)
    },
    content: {
        paddingTop: 150,
        textAlign: 'center'
    },
    image: {
        marginTop: 50,
        display: 'inline-block',
        maxWidth: '100%',
        width: 560
    },
    divider: {
        backgroundColor: colors.grey[300],
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(3)
    },
    markdownContainer: {
        maxWidth: '100%'
    },
}));

const Setup = () => {
    const classes = useStyles()

    const dispatch = useDispatch()
    const history = useHistory()
    const ndsValue  = useSelector((state: IStateInterface)=> state.setup.nds)
    const reserveInterval  = useSelector((state: IStateInterface)=> state.setup.reserveInterval)

    useEffect(() => {
        dispatch(getSetupNdsRate())
        dispatch(getSetupReserveInterval())
    }, [dispatch])

    function onChangeNdsHandler(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(changeNdsValue(parseFloat(event.target.value)))
    }

    function onChangeReserveHandler(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(changeReserveInterval(parseInt(event.target.value)))
    }

    function saveHandler(event: React.SyntheticEvent) {
        dispatch(updateSetupNdsRate())
    }

    return (
        <Page
            className={classes.root}
            title="Changelog"
        >
            <Typography
                gutterBottom
                variant="overline"
            >
                Администрирование
            </Typography>
            <Typography variant="h3">Настройка приложения</Typography>
            <Divider className={classes.divider} />
                <div className={classes.markdownContainer}>
                </div>
            <Card
                className={clsx(classes.root)}

            >
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="Ставка НДС"
                                margin="dense"
                                name="nds"
                                onChange={onChangeNdsHandler}
                                required
                                value={ndsValue}
                                variant="outlined"
                            />
                        </Grid>

                        <Grid
                            item
                            xs={2}
                        >
                            <TextField
                                fullWidth
                                label="Дни резерва"
                                margin="dense"
                                name="reserve"
                                onChange={onChangeReserveHandler}
                                required
                                value={reserveInterval}
                                variant="outlined"
                            />
                        </Grid>

                    </Grid>
                </CardContent>
                <Divider />
                <CardActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={saveHandler}
                    >
                        Сохранить
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={(event => history.push('/'))}
                    >
                        Отменить
                    </Button>
                </CardActions>
            </Card>
        </Page>
    );
};

export default Setup;

