import React from 'react';
import {
    Typography,
    Grid,
    Fab,
    Tooltip
} from '@material-ui/core';
import {IEmployeeListItem} from "../../../../types/model/employee";
import AddIcon from "@material-ui/icons/Add";
import MemberItem from "../MemberItem/MemberItem";

interface IMembersTableProps {
    employees: IEmployeeListItem[];
    onChangeEmployee: (id: number) => void;
    onAddNewEmployee: () => void;
    onDeleteEmployee: (id: number) => void;
}


const MemberTable = (props: IMembersTableProps) => {
    const {employees, onAddNewEmployee, onChangeEmployee, onDeleteEmployee} = props

    const cellClicked = (itemId: number) => {
        onChangeEmployee(itemId);
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={1}>
                <Fab color="default" aria-label="add" onClick={(event) => {
                    onAddNewEmployee()
                }}>
                    <Tooltip title={'Добавить сотрудника'}>
                        <AddIcon/>
                    </Tooltip>
                </Fab>
            </Grid>
            <Grid item xs={12}>
                <Typography color={"primary"}>
                    Добавьте сотрудников в шаблон смены...
                </Typography>
            </Grid>
            {
                employees.map((item: IEmployeeListItem) => (
                    <MemberItem item={item} onDeleteItem={onDeleteEmployee} onChangeItem={cellClicked}/>
                ))
            }
        </Grid>
    );
};

export default MemberTable
