import React, {Fragment} from "react";
import {Box} from "@material-ui/core";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}



function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <Fragment>
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`scrollable-auto-tabpanel-${index}`}
                aria-labelledby={`scrollable-auto-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box p={3}>
                        {children}
                    </Box>
                )}
            </div>
        </Fragment>
    );
}

export default TabPanel;