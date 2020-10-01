import React, {useEffect} from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    RadioGroup,
    Radio,
    FormControlLabel,
    TextField,
    Button
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';


const SelectDialog = ({open, options, onCancel, onConfirm}) => {
    const {
        title,
        description,
        confirmationText,
        cancellationText,
        dataItems,
        dialogProps,
        confirmationButtonProps,
        cancellationButtonProps,
        valueName
    } = options;
    const [id, setId] = React.useState(0);
    const [itemValue, setItemValue] = React.useState('');
    const [findString, setFindString] = React.useState('')


    const handleChange = (event) => {
        const selectedId = parseInt(event.target.value);
        const index = dataItems.findIndex((item) => {
            return item.id === selectedId
        });
        setId(selectedId);
        setItemValue(dataItems[index][valueName])
    }

    useEffect(() => {
        if (open) {
            setFindString('')
        }
    }, [open])

    const handleClick = (event) => {
        onConfirm({id: id, name: itemValue});
        setId(0)
        setItemValue('')
    }

    return (
        <Dialog fullWidth {...dialogProps} open={open} onClose={onCancel}>
            {title && (
                <DialogTitle>{title}</DialogTitle>
            )}
            <DialogContent dividers>
                {description &&
                <Alert icon={false} severity="success">
                    {description}
                </Alert>
                }
                <TextField
                    fullWidth
                    value={findString}
                    onChange={(event => {
                        setFindString(event.target.value)
                    })}
                    placeholder={"Поиск по тексту"}
                />
                <RadioGroup
                    aria-label="ringtone"
                    name="ringtone"
                    value={id}
                    onChange={handleChange}
                >
                    {dataItems &&
                    dataItems.filter(x => x[valueName].toLowerCase().includes(findString.toLowerCase())).map((record) => (
                            <FormControlLabel
                                value={parseInt(record.id)}
                                key={record.id}
                                control={<Radio/>}
                                label={record[valueName]}/>
                        )
                    )
                    }
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button {...cancellationButtonProps} onClick={onCancel}>
                    {cancellationText}
                </Button>
                <Button color="primary" {...confirmationButtonProps} onClick={handleClick}>
                    {confirmationText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectDialog;
