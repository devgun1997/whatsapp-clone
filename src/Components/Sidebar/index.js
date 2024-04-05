import React, { useEffect, useState } from "react";
import "../Css/Sidebar.css";
import { Avatar, IconButton } from "@mui/material";
import { Chat, DonutLarge, MoreVert, SearchOutlined } from "@mui/icons-material";
import SidebarChat from "./SidebarChat";
import db from "../firebase";
import {query, collection, onSnapshot, where, or} from "firebase/firestore";
import {useStateValue} from "../Provider/StateProvider";

function Sidebar() {
    const [rooms, setRooms] = useState([]);
    const [ {user},dispatch] = useStateValue();

    useEffect(() => {
        console.log(user.uid);
        // const q = query(collection(db, "rooms"), where("participant1", "==", user.uid),where("participant2", "==", user.uid));
        const q = query(
            collection(db, "rooms"),
            or(
                where("participant1", "==", user.uid),
                where("participant2", "==", user.uid),
            )
        );
        // const querySnapshot = await getDocs(q);

        // const doc = querySnapshot.docs[0];
        // const q = query(collection(db, "rooms"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
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
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar src={user?.photoURL} />
                <div className="sidebar__headerRight">
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
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new chat" type="text" />
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChat />
                {rooms.map((room) => (
                    <SidebarChat key={room.id} id={room.id} participantId={((room.participant1 == user.uid) ? room.participant2 : room.participant1)} lastSeen={room.last_seen}  />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
