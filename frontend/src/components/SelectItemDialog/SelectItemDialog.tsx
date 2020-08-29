import React from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export interface ISelectItemDialog {
    classes: Record<'paper', string>;
    title: string;
    id: string;
    keepMounted: boolean;
    keyValue: number;
    nameValue: string;
    open: boolean;
    onClose: (id?: number, value?: string) => void;
    records: any[];
    valueField: string;
    idField: string;
}

const SelectItemDialog = (props: ISelectItemDialog) => {
    const { title, onClose, nameValue, open, records, idField, valueField, keyValue, ...other } = props;

    const radioGroupRef = React.useRef<HTMLElement>(null);
    const [key, setKey] = React.useState(keyValue);
    const [value, setValue] = React.useState(nameValue);

    // React.useEffect(() => {
    //     if (!open) {
    //         setValue(valueProp);
    //     }
    // }, [valueProp, open]);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        onClose();
    };

    const handleOk = () => {
        onClose(key, value);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const idValue = parseInt((event.target as HTMLInputElement).value)
        const index = records.findIndex((item)=>{return item.id === idValue})
        setKey(idValue);
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
                    value={key}
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

export default SelectItemDialog;
