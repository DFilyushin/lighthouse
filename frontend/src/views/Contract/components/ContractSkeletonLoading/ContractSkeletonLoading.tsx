import React, {Fragment} from "react";
import {Skeleton} from "@material-ui/lab";

interface IContractSkeletonLoading {
    animation?: 'pulse' | 'wave' | false;
    height: number;
}

const ContractSkeletonLoading = (props: IContractSkeletonLoading) => {
    const {animation, height} = props


    return (
        <Fragment>
            <Skeleton animation={animation} height={height} width="100%" style={{marginBottom: 2}}/>
            <Skeleton animation={animation} height={height} width="100%" style={{marginBottom: 2}}/>
            <Skeleton animation={animation} height={height} width="100%" style={{marginBottom: 2}}/>
        </Fragment>
    )
}

export default ContractSkeletonLoading