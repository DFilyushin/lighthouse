import React from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CancelIcon from '@material-ui/icons/Cancel';
import Tooltip from '@material-ui/core/Tooltip';

interface IProductionStateIcon {
    stateIndex: number
}

/**
 * Иконка состояния карты
 * @param indexState Индекс состояния
 */
function getIcon(indexState: number) {
    switch (indexState) {
        case 0: return <Tooltip title={'Черновик'}><EditIcon color={"action"}/></Tooltip>;
        case 1: return <Tooltip title={'В работе'}><AccessTimeIcon color={"primary"}/></Tooltip>;
        case 2: return <Tooltip title={'Выполнен'}><CheckCircleOutlineIcon color={"primary"}/></Tooltip>;
        case 3: return <Tooltip title={'Ошибка'}><ErrorOutlineIcon color={"primary"}/></Tooltip>;
        case 4: return <Tooltip title={'Отменён'}><CancelIcon color={"error"}/></Tooltip>;
        default: return <div></div>
    }
}

const ProductionStateIcon = (props: IProductionStateIcon) => {
  return (
      getIcon(props.stateIndex)
  )
};

export default ProductionStateIcon;