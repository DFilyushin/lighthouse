import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const options = [
    {id: 0, name: 'None'},
    {id: 1, name: 'Atria'},
    {id: 2, name: 'Callisto'},
    {id: 3, name: 'Dione'},
    {id: 4, name: 'Ganymede'},
    {id: 5, name: 'Hangouts Call'},
    {id: 6, name: 'Luna'},
    {id: 7, name: 'Oberon'},
    {id: 8, name: 'Phobos'},
    {id: 9, name: 'Pyxis'},
    {id: 10, name: 'Umbriel'}
];

export interface ISelectItemDialog {
    classes: Record<'paper', string>;
    title: string;
    id: string;
    keepMounted: boolean;
    keyValue: number;
    value: string;
    open: boolean;
    onClose: (id?: number, value?: string) => void;
    records: any[];
    valueField: string;
    idField: string;
}

export default function SelectItemDialog(props: ISelectItemDialog) {
    const { title, onClose, value: valueProp, open, records, idField, valueField, keyValue, ...other } = props;
    const [value, setValue] = React.useState(valueProp);
    const radioGroupRef = React.useRef<HTMLElement>(null);
    const [id, setId] = React.useState(keyValue)

    React.useEffect(() => {
        if (!open) {
            setValue(valueProp);
        }
    }, [valueProp, open]);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(id, value);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const idValue = parseInt((event.target as HTMLInputElement).value)
        const index = records.findIndex((item, index, array)=>{return item.id === idValue})
        setId(idValue);
        setValue(records[index].name)
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            open={open}
            {...other}
        >
            <DialogTitle id="confirmation-dialog-title">{title}</DialogTitle>
            <DialogContent dividers>
                <RadioGroup
                    ref={radioGroupRef}
                    aria-label="ringtone"
                    name="ringtone"
                    value={id}
                    onChange={handleChange}
                >
                    {records.map((option) => (
                        <FormControlLabel value={option[idField]} key={option[idField]} control={<Radio />} label={option[valueField]} />
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Отменить
                </Button>
                <Button onClick={handleOk} color="primary">
                    Выбрать
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        paper: {
            width: '80%',
            maxHeight: 435,
        },
    }),
);

export function ConfirmationDialog() {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [id, setId] = React.useState(0);
    const [value, setValue] = React.useState('');

    const handleClickListItem = () => {
        setOpen(true);
    };

    const handleClose = (id?: number, newValue?: string) => {
        setOpen(false);

        if (newValue) {
            setValue(newValue);

        }
        if (id){
            setId(id);
        }
    };

    return (
        <div className={classes.root}>
            <List component="div" role="list">
                <ListItem button divider disabled role="listitem">
                    <ListItemText primary="Interruptions" />
                </ListItem>
                <ListItem
                    button
                    divider
                    aria-haspopup="true"
                    aria-controls="ringtone-menu"
                    aria-label="phone ringtone"
                    onClick={handleClickListItem}
                    role="listitem"
                >
                    <ListItemText primary={value} secondary={id} />
                </ListItem>
                <ListItem button divider disabled role="listitem">
                    <ListItemText primary="Default notification ringtone" secondary="Tethys" />
                </ListItem>
                <SelectItemDialog
                    classes={{
                        paper: classes.paper,
                    }}
                    title={'Выбор сотрудника'}
                    id="ringtone-menu"
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    value={value}
                    records={options}
                    idField={'id'}
                    valueField={'name'}
                    keyValue={id}
                />
            </List>
        </div>
    );
}