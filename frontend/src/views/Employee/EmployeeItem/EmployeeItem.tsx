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
    Tab,
    Tabs,
    Paper,
    IconButton
} from '@material-ui/core';
import {Redirect, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IStateInterface} from "redux/rootReducer";
import {
    addEmployeeProduct,
    addNewEmployeeItem,
    changeEmployeeItem, deleteEmployeeProduct,
    loadEmployeeItem, loadEmployeeWorkTimeTable,
    updateEmployeeItem
} from "redux/actions/employeeAction";
import {useDialog} from "components/SelectDialog";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import {loadStaffs} from "redux/actions/staffAction";
import {docType} from 'types/model/employee';
import {
    DIALOG_ASK_DELETE,
    DIALOG_CANCEL_TEXT, DIALOG_NO,
    DIALOG_SELECT_TEXT,
    DIALOG_TYPE_CONFIRM, DIALOG_YES, NEW_RECORD_TEXT,
    NEW_RECORD_VALUE
} from "utils/AppConst";
import TabPanel from "../../Production/components/TabPanel";
import WorkTimeToolbar from "../components/WorkTimeToolbar";
import {PROD_PERIOD_END, PROD_PERIOD_START} from "../../../types/Settings";
import WorkTimeTable from "../components/WorkTimeTable/WorkTimeTable";
import EmployeeProducts from "../components/EmployeeProducts";
import {useConfirm} from "material-ui-confirm";
import {IProduct} from "../../../types/model/product";
import {loadProduct} from "../../../redux/actions/productAction";

const PAGE_MAIN = 0
const PAGE_TIME = 1
const PAGE_PRODUCTS = 2

interface IEmployeeItem {
    className: string;
    match: any;
}

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2)
    },
    paper_root: {
        display: 'flex',
        alignItems: 'center',
    },
    paper_bar: {
        flexGrow: 1,
        padding: 1
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
    iconButton: {
        padding: 10,
    },
    paper: {
        width: '80%',
        maxHeight: 435,
    }
}));

const EmployeeItem = (props: IEmployeeItem) => {
    const {className, ...rest} = props;

    const classes = useStyles()
    const history = useHistory()
    const dispatch = useDispatch()
    const selectDialog = useDialog()
    const confirm = useConfirm()

    const paramId = props.match.params.id
    const id = paramId === NEW_RECORD_TEXT ? NEW_RECORD_VALUE : parseInt(paramId)
    const employeeItem = useSelector((state: IStateInterface) => state.employee.employeeItem)
    const staffItems = useSelector((state: IStateInterface) => state.staff.staffs)
    const workTimeItems = useSelector((state: IStateInterface) => state.employee.workTimeItems)
    const productItems = useSelector((state: IStateInterface) => state.product.products)
    const notFoundEmployee = useSelector((state: IStateInterface) => state.employee.notFound)

    const [tab, setTab] = React.useState(PAGE_MAIN);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const item = {...employeeItem, [event.target.name]: event.target.value};
        dispatch(changeEmployeeItem(item))
    };

    /**
     * Сохранение изменений
     * @param dispatch
     */
    const saveItem = (dispatch: any) => new Promise(async (resolve, reject) => {
        if (id === NEW_RECORD_VALUE) {
            await dispatch(addNewEmployeeItem(employeeItem));
        } else {
            await dispatch(updateEmployeeItem(employeeItem));
        }
        resolve();
    })

    const saveHandler = (event: React.SyntheticEvent) => {
        event.preventDefault()
        saveItem(dispatch).then(() => {
                history.push('/org/employee');
            }
        );
    };

    function handleRefresh(startDate: Date | null, endDate: Date | null, product?: number, state?: number) {
        const date1 = startDate!.toISOString().slice(0, 10);
        const date2 = endDate!.toISOString().slice(0, 10);
        localStorage.setItem(PROD_PERIOD_START, date1);
        localStorage.setItem(PROD_PERIOD_END, date2);
        dispatch(loadEmployeeWorkTimeTable(id, date1, date2))
    }

    const handleChangeStaff = (event: React.MouseEvent) => {
        selectDialog(
            {
                title: 'Выбор должности',
                description: '',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: staffItems,
                initKey: employeeItem.staff.id,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item = {...employeeItem};
                item.staff.id = value.id;
                item.staff.name = value.name;
                dispatch(changeEmployeeItem(item));
            }
        )
    }

    /**
     * Изменение вкладки
     * @param event
     * @param newValue - Индекс новой вкладки
     */
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
        switch (newValue) {
            case PAGE_MAIN:
                break;
            case PAGE_TIME:
                break;
        }
    };

    useEffect(() => {
        dispatch(loadStaffs())
        dispatch(loadProduct())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        dispatch(loadEmployeeItem(id));
    }, [dispatch, id]);

    function a11yProps(index: any) {
        return {
            id: `scrollable-force-tab-${index}`,
            'aria-controls': `scrollable-force-tabpanel-${index}`,
        };
    }

    /**
     * Удалить продукт из списка доступных сотруднику
     * @param id Код записи
     */
    function deleteProduct(id: number) {
        confirm(
            {
                title: DIALOG_TYPE_CONFIRM,
                description: DIALOG_ASK_DELETE,
                confirmationText: DIALOG_YES,
                cancellationText: DIALOG_NO
            }
        ).then(() =>
            dispatch(deleteEmployeeProduct(id))
        )
    }

    function addProductItem() {
        selectDialog(
            {
                title: 'Выбор продукции',
                description: 'Выбранный продукт будет доступен для формирования прайс-листа',
                confirmationText: DIALOG_SELECT_TEXT,
                cancellationText: DIALOG_CANCEL_TEXT,
                dataItems: productItems,
                initKey: 0,
                valueName: 'name'
            }
        ).then((value: any) => {
                const item: IProduct = {id: value.id, name: value.name};
                dispatch(addEmployeeProduct(item));
            }
        );
    }

    if (notFoundEmployee){
        return (
            <div>
                <Redirect to={'/NotFound'}/>
            </div>
        )
    }else {
        return (
            <div className={classes.root}>
                <Card
                    {...rest}
                    className={className}
                >
                    <CardHeader
                        subheader=""
                        title="Личная карточка сотрудника"
                    />
                    <CardContent>
                        <Paper className={classes.paper_bar}>
                            <Tabs
                                value={tab}
                                onChange={handleTabChange}
                                scrollButtons="on"
                                indicatorColor="primary"
                                textColor="primary"
                                aria-label="scrollable force tabs example"
                                centered
                            >
                                <Tab label="Основное" {...a11yProps(PAGE_MAIN)} />
                                <Tab label="Смены"  {...a11yProps(PAGE_TIME)} />
                                <Tab label="Прайс-лист"  {...a11yProps(PAGE_PRODUCTS)} />
                            </Tabs>
                        </Paper>
                        <TabPanel value={tab} index={PAGE_MAIN}>
                            <form
                                autoComplete="off"
                                onSubmit={saveHandler}
                            >

                                <Divider/>
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
                                                label="Таб.номер"
                                                margin="dense"
                                                name="tabNum"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.tabNum}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            xs={10}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Фамилия/Имя/Отчество сотрудника"
                                                margin="dense"
                                                name="fio"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.fio}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Paper elevation={0} className={classes.paper_root}>
                                                <TextField
                                                    fullWidth
                                                    label="Должность"
                                                    margin="dense"
                                                    name="product"
                                                    onChange={handleChange}
                                                    required
                                                    value={employeeItem.staff.name}
                                                    variant="outlined"
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                />
                                                <IconButton color="primary" className={classes.iconButton}
                                                            aria-label="directions" onClick={handleChangeStaff}>
                                                    <MenuOpenIcon/>
                                                </IconButton>
                                            </Paper>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={3}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Дата рождения"
                                                margin="dense"
                                                name="dob"
                                                onChange={handleChange}
                                                required
                                                type="date"
                                                value={employeeItem.dob}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={4}
                                            xs={3}
                                        >
                                            <TextField
                                                fullWidth
                                                label="ИИН"
                                                margin="dense"
                                                name="iin"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.iin}
                                                variant="outlined"
                                                inputProps={
                                                    {
                                                        maxLength: 12,
                                                    }
                                                }
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={6}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Контактный телефон"
                                                margin="dense"
                                                name="contactPhone"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.contactPhone}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={6}
                                            xs={6}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Email"
                                                margin="dense"
                                                name="contactEmail"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.contactEmail}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={3}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Тип документа"
                                                margin="dense"
                                                name="docType"
                                                onChange={handleChange}
                                                required
                                                select
                                                // eslint-disable-next-line react/jsx-sort-props
                                                SelectProps={{native: true}}
                                                value={employeeItem.docType}
                                                variant="outlined"
                                            >
                                                {docType.map(option => (
                                                    <option
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={3}
                                        >
                                            <TextField
                                                fullWidth
                                                label="№ документа"
                                                margin="dense"
                                                name="docNum"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.docNum}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={4}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Дата выдачи"
                                                margin="dense"
                                                name="docDate"
                                                onChange={handleChange}
                                                required
                                                type="date"
                                                value={employeeItem.docDate}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={3}
                                            xs={4}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Выдан"
                                                margin="dense"
                                                name="docAuth"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.docAuth}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={12}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Адрес регистрации"
                                                margin="dense"
                                                name="addrRegistration"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.addrRegistration}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={12}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Адрес проживания"
                                                margin="dense"
                                                name="addrResidence"
                                                onChange={handleChange}
                                                required
                                                value={employeeItem.addrResidence}
                                                variant="outlined"
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Divider/>
                                <CardActions>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        type={'submit'}
                                    >
                                        Сохранить
                                    </Button>
                                    <Button
                                        color="default"
                                        variant="contained"
                                        onClick={(event => history.push('/org/employee/'))}
                                    >
                                        Отменить
                                    </Button>
                                </CardActions>
                            </form>

                        </TabPanel>
                        <TabPanel value={tab} index={PAGE_TIME}>
                            <CardContent>
                                <WorkTimeToolbar className={''} onRefresh={handleRefresh}/>
                                <WorkTimeTable className={''} timeItems={workTimeItems}/>
                            </CardContent>
                        </TabPanel>
                        <TabPanel index={PAGE_PRODUCTS} value={tab}>
                            <EmployeeProducts
                                className={''}
                                items={employeeItem.empllink}
                                onAddProduct={addProductItem}
                                onDeleteProduct={deleteProduct}
                            />
                        </TabPanel>

                    </CardContent>
                </Card>
            </div>
        )
    }
};

export default EmployeeItem;
