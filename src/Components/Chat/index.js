import React, {useEffect, useState} from "react";
import {Avatar, IconButton} from "@mui/material";
import {AttachFile, Collections, InsertEmoticon, Mic, MoreVert, SearchOutlined} from "@mui/icons-material";
import "../Css/Chat.css";
import {useParams} from "react-router-dom";
import db from "../firebase";
import {collection, addDoc, serverTimestamp, doc, onSnapshot, updateDoc, orderBy, query} from 'firebase/firestore';
import {useStateValue} from "../Provider/StateProvider";

function Chat(){
    const [seed,setSeed] = useState('');
    const [input,setInput] = useState('');
    const { roomId } = useParams();
    const [chatName, setChatName] = useState('');
    const [messages, setMessages] = useState([]);
    const [ {user, participant},dispatch] = useStateValue();



    useEffect(() => {
        const fetchMessages = (roomId) => {
            const roomRef = doc(db, 'rooms', roomId);
            const messagesCollectionRef = collection(roomRef, 'messages');
            const messagesQuery = query(messagesCollectionRef, orderBy('timestamp', 'asc'));

            const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
                const messagesData = [];
                querySnapshot.forEach((doc) => {
                    messagesData.push({ ...doc.data(), id: doc.id });
                });
                setMessages(messagesData);
            });

            return () => unsubscribe(); // Unsubscribe when the component unmounts
        };

        if (roomId) {
            fetchMessages(roomId);
            setChatName('Demo Name');
        }
    }, [roomId, db]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const parentCollectionRef = collection(db, 'rooms');
        const subCollectionRef = collection(parentCollectionRef, roomId, 'messages');
        const timestamp = serverTimestamp();
        await addDoc(subCollectionRef, {
            sender:user.uid,
            message:input,
            timestamp:timestamp
        });
        const updateLastMessage = doc(db, 'rooms', roomId);
        const updateLastSeen = {
            last_seen: input,
            timestamp: timestamp,
        };
        await updateDoc(updateLastMessage,updateLastSeen);
        setInput("");
    };
    return (
        <div className="chat">
            <div className="chat__header">
                {console.log(participant)}
                <Avatar src={participant?.image}/>
                <div className="chat__headerInfo">
                    <h3>{participant?.name}</h3>
                    <p>Last seen at...</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton> <SearchOutlined /> </IconButton>
                    <IconButton> <AttachFile /> </IconButton>
                    <IconButton> <MoreVert /> </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map((message) => (
                    <p key={message.id} className={`chat__message ${(user.uid === message.sender) && "chat__receiver"}`}>
                        {/*<span className="chat__name">{(user.uid === message.sender) ? }</span>*/}
                        {message.message} {/* Assuming there is a 'text' property in your message object */}
                        <span className="chat__timestamp">11:59 pm</span>
                    </p>
                ))}

            </div>
            <div className="chat__footer">
                <InsertEmoticon/>
                <form>
                    <input type="text" value={input} onChange={e => setInput(e.target.value)}
                           placeholder="Type a Message"/>
                    <button type="submit" onClick={sendMessage}> Send a Message</button>
                </form>
                <IconButton>
                    <Mic/>
                </IconButton>
            </div>
        </div>
    );
}

export default Chat;