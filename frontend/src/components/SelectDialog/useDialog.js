import { useContext } from 'react';
import SelectDialogContext from './SelectDialogContext';

const useDialog = () => {
  const confirm = useContext(SelectDialogContext);
  return confirm;
};

export default useDialog;
