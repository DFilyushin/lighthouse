import React from "react";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {
    Grid
} from "@material-ui/core";
import GeneralSettings from "../GeneralSettings";
import Groups from "../Groups";
import {IProfile} from "types/model/user";

interface IGeneralProps {
    className: string;
    profile: IProfile;
    changeData: any;
    saveData: any;
}


const useStyles = makeStyles(() => ({
    root: {}
}));

const General = (props: IGeneralProps) => {

    const { className, profile, changeData, saveData, ...rest } = props;
    const classes = useStyles()

    return (
        <Grid
            {...rest}
            className={clsx(classes.root, className)}
            container
            spacing={3}
        >
            <Grid
                item
                lg={8}
                md={6}
                xl={9}
                xs={12}
            >
                <GeneralSettings profile={profile} className={''} changeData={changeData} saveData={saveData}/>
            </Grid>
            <Grid
                item
                lg={4}
                md={6}
                xl={3}
                xs={12}
            >
                <Groups className={''} groups={profile.groups} />
            </Grid>
        </Grid>
    )
}

export default General