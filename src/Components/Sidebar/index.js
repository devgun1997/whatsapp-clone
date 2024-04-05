import React, { useEffect, useState } from "react";
import styles from "./Sidebar.module.css";
import { Avatar, IconButton } from "@mui/material";
import { Chat, DonutLarge, MoreVert, SearchOutlined } from "@mui/icons-material";
import Index from "../SidebarChat";
import db from "../../firebase";
import {query, collection, onSnapshot, where, or,orderBy} from "firebase/firestore";
import {useStateValue} from "../../Provider/StateProvider";

function Sidebar({ hideSidebar }) {
    const [rooms, setRooms] = useState([]);
    const [ {user},dispatch] = useStateValue();
    const key = user.uid + "_unread";
    // console.log(key);
    useEffect(() => {
        // const q = query(collection(db, "rooms"), where("participant1", "==", user.uid),where("participant2", "==", user.uid));
        const q = query(
            collection(db, "rooms"),
            or(
                where("participant1", "==", user.uid),
                where("participant2", "==", user.uid),
            ),
            orderBy("timestamp","desc")
        );
        // const querySnapshot = await getDocs(q);

        // const doc = querySnapshot.docs[0];
        // const q = query(collection(db, "rooms"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            // console.log('recieved')
            const fetchedRooms = [];
            querySnapshot.forEach((doc) => {
                fetchedRooms.push({ ...doc.data(), id: doc.id });
            });
            setRooms(fetchedRooms);
        });

        return () => {
            // Clean up the listener when the component unmounts
            unsubscribe();
        };
    }, []);
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar__header}>
                <Avatar src={user?.photoURL} />
                <div className={styles.sidebar__headerRight}>
                    <IconButton>
                        <DonutLarge />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className={styles.sidebar__search}>
                <div className={styles.sidebar__searchContainer}>
                    <SearchOutlined />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>
            <div className={styles.sidebar__chats}>
                <Index addNewChat />
                {rooms.map((room) => (
                    // console.log(room[key])
                    <Index key={room.id} id={room.id} participantId={((room.participant1 == user.uid) ? room.participant2 : room.participant1)} lastSeen={room.last_seen} unread={room[key]} hideSidebar={hideSidebar} />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
