import React from "react";
import styles from "./Message.module.css"
const Message = ({ notification }) => {
    return (
        <>
            <div className={styles.notificationHeader}>
                {/* image is optional */}
                <span><h3>{notification.senderUser}</h3></span>
                <span>{notification.message}</span>
            </div>
            <div className={styles.notificationBody}>{notification.body}</div>
        </>
    );
};

export default Message;