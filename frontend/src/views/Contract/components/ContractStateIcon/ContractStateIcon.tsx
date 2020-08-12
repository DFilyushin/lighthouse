import React from 'react';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Tooltip from '@material-ui/core/Tooltip';

interface IContractStateIcon {
    stateIndex: number
}

/**
 * Иконка состояния карты
 * @param indexState Индекс состояния
 */
function getIcon(indexState: number) {
    switch (indexState) {
        case 1: return <Tooltip title={'Черновик'}><EditIcon color={"action"}/></Tooltip>;
        case 2: return <Tooltip title={'В работе'}><AccessTimeIcon color={"primary"}/></Tooltip>;
        case 3: return <Tooltip title={'Исполнен'}><CheckCircleOutlineIcon color={"primary"}/></Tooltip>;
        default: return <div></div>
    }
}

const ContractStateIcon = (props: IContractStateIcon) => {
  return (
      getIcon(props.stateIndex)
  )
};

export default ContractStateIcon;