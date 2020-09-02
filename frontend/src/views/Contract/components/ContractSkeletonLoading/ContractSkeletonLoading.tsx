import React from "react";
import {Skeleton} from "@material-ui/lab";

interface IContractSkeletonLoading {
    className?: string;
    animation?: 'pulse' | 'wave' | false;
    height: number;
}

const ContractSkeletonLoading = (props: IContractSkeletonLoading) => {
    const {animation, height, className} = props


    return (
        <div className={className}>
            <Skeleton animation={animation} height={height} width="100%" style={{marginBottom: 2}}/>
            <Skeleton animation={animation} height={height} width="100%" style={{marginBottom: 2}}/>
            <Skeleton animation={animation} height={height} width="100%" style={{marginBottom: 2}}/>
        </div>
    )
}

export default ContractSkeletonLoading