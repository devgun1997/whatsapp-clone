import React from "react";
import {Done, DoneAll} from "@mui/icons-material";

const MessageStatus = ({ iconType }) => {
    let iconComponent;
    switch (iconType) {
        case 2:
            iconComponent = <DoneAll />;
            break;
        case 3:
            iconComponent = <DoneAll color="primary"/>;
            break;
        default:
            iconComponent = <Done />;
    }
    return (
        <>
            {iconComponent && iconComponent}
        </>
    );
};
export default MessageStatus