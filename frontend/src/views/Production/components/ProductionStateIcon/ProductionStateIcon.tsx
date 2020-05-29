import React from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import CachedIcon from '@material-ui/icons/Cached';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CancelIcon from '@material-ui/icons/Cancel';

interface IProductionStateIcon {
    stateIndex: number
}

/**
 * Отрисовать иконку по индексу
 * @param indexState Индекс состояния
 */
function getIcon(indexState: number) {
    switch (indexState) {
        case 0: return <EditIcon color={"primary"}/>;
        case 1: return <AccessTimeIcon color={"primary"}/>;
        case 2: return <CheckCircleOutlineIcon color={"primary"}/>;
        case 3: return <ErrorOutlineIcon color={"primary"}/>;
        case 4: return <CancelIcon color={"primary"}/>;
        default: return <div></div>
    }
}

const ProductionStateIcon = (props: IProductionStateIcon) => {
  return (
      getIcon(props.stateIndex)
  )
};

export default ProductionStateIcon;