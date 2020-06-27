import React, { useState, useCallback, Fragment } from 'react';
import SelectDialogContext from './SelectDialogContext';
import ConfirmationDialog from './SelectDialog';

const _defaultOptions = {
  title: 'Are you sure?',
  description: '',
  confirmationText: 'Ok',
  cancellationText: 'Cancel',
  dialogProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
};

const SelectDialogProvider = ({ children, defaultOptions = {} }) => {
  const [options, setOptions] = useState({ ..._defaultOptions, ...defaultOptions });
  const [resolveReject, setResolveReject] = useState([]);
  const [resolve, reject] = resolveReject;


  const confirm = useCallback((options = {}) => {
    return new Promise((resolve, reject) => {
      setOptions({ ..._defaultOptions, ...defaultOptions, ...options });
      setResolveReject([resolve, reject]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = useCallback(() => {
    setResolveReject([]);
  }, []);

  const handleCancel = useCallback(() => {
    reject();
    handleClose();
  }, [reject, handleClose]);

  const handleConfirm = useCallback((value) => {
    resolve(value);
    handleClose();
  }, [resolve, handleClose]);

  return (
    <Fragment>
      <SelectDialogContext.Provider value={confirm}>
        {children}
      </SelectDialogContext.Provider>
      <ConfirmationDialog
        open={resolveReject.length === 2}
        options={options}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </Fragment>
  );
};

export default SelectDialogProvider;
