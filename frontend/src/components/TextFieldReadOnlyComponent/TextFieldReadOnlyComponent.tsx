import React from "react";
import {TextField} from "@material-ui/core";

const TextFieldReadOnlyComponent = (props: any) => {
    return <TextField {...props} disabled={true} />
}

export default TextFieldReadOnlyComponent