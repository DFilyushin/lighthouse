import React, {useEffect} from 'react'
import clsx from 'clsx'
import { SearchInput } from 'components'
import { useHistory } from "react-router-dom"
import {
    makeStyles,
    Select,
    List,
    Avatar,
    ListItem,
    ListItemAvatar,
    FormControl,
    MenuItem,
    InputLabel,
    Button,
    Grid,
    Typography
} from '@material-ui/core'
import {NO_SELECT_VALUE} from "utils/AppConst"
import {IEmployeeListItem} from "../../../../types/model/employee";
import { ReactComponent as Price2 } from 'images/barcode.svg';


const useStyles = makeStyles(theme => ({
    root: {},
    buttonGroup: {
        '& > *': {
            margin: theme.spacing(1),
        }
    },
    row: {
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
    formControl: {
        margin: theme.spacing(1),
    },
    formControlWidth: {
        minWidth: 250
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

interface IPriceToolbarProps {
    className: string;
    newItemUrl: string;
    onFind: any;
    onDelete: any;
    employees: IEmployeeListItem[];
    onRefresh: (employee: number) => void;
    onNewItemByTemplate: () => void;
}

//FIXME состояние выбранного сотрудника хранить в Redux


const PriceToolbar = (props: IPriceToolbarProps) => {
    const classes = useStyles()
    const history = useHistory()
    const { className, newItemUrl, onFind, onDelete, employees, onRefresh, onNewItemByTemplate, ...rest } = props
    const [employee, setEmployee] = React.useState<number>(NO_SELECT_VALUE)


    const handleChangeEmployee = (event: React.ChangeEvent<{ value: unknown }>)=>{
        const employeeId = event.target.value as number;
        setEmployee(employeeId);
        onRefresh(employeeId)
    }


    useEffect(()=> {
        onRefresh(NO_SELECT_VALUE)
        // eslint-disable-next-line
    }, [])


    /**
     * Поиск по Enter
     * @param event
     */
    function onKeyDownHandler (event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === 'Enter'){
            const findText = event.currentTarget.value.trim();
            onFind(findText);
        }
    }

    /**
     * Новая прайсовая цена
     */
    function onNewPriceHandler() {
        history.push(newItemUrl);
    }

    /**
     * Новый прайс по шаблону
     */
    function onNewPriceByTemplateHandler() {
        onNewItemByTemplate()
    }

    return (
        <div
            {...rest}
            className={clsx(classes.root, className)}
        >
            <List className={classes.root}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar className={clsx(classes.large, classes.white)}> <Price2 color={"primary"}/> </Avatar>
                    </ListItemAvatar>
                    <Typography variant="h4">Прайс-лист</Typography>
                </ListItem>
            </List>
            <Grid
                container
                spacing={3}
            >
                <Grid
                    item
                    lg={3}
                    sm={6}
                    xs={12}
                >
                <div className={classes.buttonGroup}>
                    <Button color="primary" variant="contained" onClick={onNewPriceHandler}>Новый прайс</Button>
                    <Button color="primary" variant="contained" onClick={onNewPriceByTemplateHandler}>По шаблону</Button>
                    <Button color="secondary" variant="contained" onClick={onDelete}>Удалить</Button>
                </div>
                </Grid>
            </Grid>
                    <Grid
                        container
                        spacing={3}
                        className={classes.row}
                    >
                        <Grid
                            item
                            lg={3}
                            sm={6}
                            md={6}
                            xs={12}
                        >
                            <SearchInput
                                className={classes.searchInput}
                                onEnterKeyDown={onKeyDownHandler}
                                placeholder='Поиск по продукции'
                            />
                        </Grid>
                        <Grid
                            item
                            lg={4}
                            sm={6}
                            md={6}
                            xs={12}
                        >
                            <FormControl className={clsx(classes.formControl)}>
                                <InputLabel id="select-payment-method-label">По менеджеру</InputLabel>
                                <Select
                                    labelId="select-payment-method-label"
                                    id="demo-simple-select-helper"
                                    value={employee}
                                    onChange={handleChangeEmployee}
                                >
                                    <MenuItem key={-1} value={NO_SELECT_VALUE}>
                                        <em>общий прайс-лист</em>
                                    </MenuItem>
                                    {
                                        employees.map(item=>(
                                            <MenuItem key={item.id} value={item.id}>{item.fio}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid
                            item
                            lg={2}
                            sm={6}
                            md={6}
                            xs={12}
                        >

                        </Grid>

                    </Grid>

        </div>
    );
};

export default PriceToolbar
