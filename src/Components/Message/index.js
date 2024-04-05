import React from "react";
import styles from "./Message.module.css"
const Message = ({ notification }) => {
    return (
        <>
            <div className={styles.notificationHeader}>
                {/* image is optional */}
                {notification.image && (
                    <div className={styles.imageContainer}>
                        <img src={notification.image} width={100} />
                    </div>
                )}
                <span>{notification.title}</span>
            </div>
            <div className={styles.notificationBody}>{notification.body}</div>
        </>
    );
};

export default Message;