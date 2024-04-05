import React from "react";
import {Done, DoneAll} from "@mui/icons-material";
import {IconButton} from "@mui/material";

const MessageStatus = ({ iconType }) => {

    let iconComponent;

    switch (iconType) {
        case '2':
            iconComponent = <DoneAll />;
            break;
        case '3':
            iconComponent = <DoneAll color="blue"/>;
            break;
        default:
            iconComponent = <Done />;
    }
    return (
        <div>
            {iconComponent && {iconComponent}}
        </div>
    );
};
export default MessageStatus