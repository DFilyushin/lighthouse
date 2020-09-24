import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Alert from '@material-ui/lab/Alert';


const SelectDialog = ({ open, options, onCancel, onConfirm }) => {
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


  const handleChange = (event) => {
    const selectedId = parseInt(event.target.value);
    const index = dataItems.findIndex((item)=>{return item.id === selectedId});
    setId(selectedId);
    setItemValue(dataItems[index][valueName] )
  };

  const handleClick = (event) => {
    onConfirm({id: id, name: itemValue});
    setId(0)
    setItemValue('')
  };

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
          <RadioGroup
          aria-label="ringtone"
          name="ringtone"
          value={id}
          onChange={handleChange}
        >
            { dataItems &&
              dataItems.map( (record)=>(
                  <FormControlLabel value={parseInt(record.id)} key={record.id} control={<Radio/>} label={record[valueName]}/>
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
