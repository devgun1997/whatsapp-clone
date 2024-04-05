import styles from "./Chat.module.css";
import db from "../../firebase";
import ChatStatus from "../ChatStatus";

import React, {useEffect, useState, useRef} from "react";
import { format } from 'date-fns';
import {Avatar, IconButton} from "@mui/material";
import {ArrowBack, AttachFile, InsertEmoticon, Mic, MoreVert, SearchOutlined} from "@mui/icons-material";
import {Link, useParams} from "react-router-dom";
import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    onSnapshot,
    updateDoc,
    orderBy,
    query,
    increment,
    getDoc
} from 'firebase/firestore';
import {useStateValue} from "../../Provider/StateProvider";
import axios from "axios";
function Chat({hideSidebar}){
    const [input,setInput] = useState('');
    const [oldRoomId,setOldRoomId] = useState('');
    const [checkCondition,setCheckCondition] = useState(false);
    const { roomId } = useParams();
    const [messages, setMessages] = useState([]);
    const [ {user, participant},dispatch] = useStateValue();
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    const sendNotification = async (token,message,name,msgObject) => {
        const serverKey = 'ya29.a0Ad52N3_bcYoHxzltyW-5EbkVn84L8Lc5nOFZ61TSn31hS2VlFR7wGzP0zlBVDgj7N0FzExNpx-i6VL_ntgSv6HDhjZgxcSOMoQcOvp7vJqNNJOHFhcK14syCW8jEggGQ7Dte01_8bzKcrZ3OUVrQQrQX_wYBesth47H2aCgYKAR8SARASFQHGX2MirucO2t1TTdAxeLa-_6cgDw0171';
        const deviceToken = token;
        try {
            const response = await axios.post(
                'https://fcm.googleapis.com/v1/projects/whatsapp-clone-271c7/messages:send',
                {
                    message: {
                        token: deviceToken,
                        data: {
                            message: message,
                            senderUser: name,
                            roomId: roomId,
                            msgId: msgObject.id
                        },
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${serverKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            console.log('Message sent successfully:', response.data);
        } catch (error) {
            console.error('Error sending message:', error.message);
        }
    };
    const fetchMessages = (roomId) => {
        const roomRef = doc(db, "rooms", roomId);
        const messagesCollectionRef = collection(roomRef, "messages");
        const messagesQuery = query(messagesCollectionRef, orderBy("timestamp", "asc"));

        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
            const messagesData = [];
            querySnapshot.forEach((doc) => {
                messagesData.push({ ...doc.data(), id: doc.id });

            });

            setMessages(messagesData);

        });
        return () => unsubscribe(); // Unsubscribe when the component unmounts
    };

    useEffect(() => {
        fetchMessages(roomId);
        checkChatRoomCondition();
    }, [roomId, db]);

    useEffect(() => {
        scrollToBottom()
    }, [messages]);


    const sendMessage = async (e) => {
        e.preventDefault();
        if(input.trim() != ''){
            const msg = input;
            setInput("");
            const parentCollectionRef = collection(db, "rooms");
            const subCollectionRef = collection(parentCollectionRef, roomId, "messages");
            const timestamp = serverTimestamp();
            const msgObject = await addDoc(subCollectionRef, {
                sender:user.uid,
                message:msg,
                status:1,
                timestamp:timestamp
            });
            const updateLastMessage = doc(db, "rooms", roomId);
            const key = participant.uid + "_unread";
            const updateLastSeen = {
                last_seen: msg,
                timestamp: timestamp,
            };
            updateLastSeen[key] = increment(1)
            await updateDoc(updateLastMessage,updateLastSeen);
            await sendNotification(participant.token,msg,user.displayName,msgObject);
        }
    };
    const checkChatRoomCondition = async () => {
        const docRef = doc(db, "rooms", roomId);
        const docSnap = await getDoc(docRef);
        const key = user.uid+ "_unread";
        const msg = {};
        if (docSnap.exists()) {
            if(docSnap.data().participant1 === user.uid || docSnap.data().participant2 === user.uid){
                msg[key] = 0;
                await updateDoc(docRef,msg);
                hideSidebar(true);
                setCheckCondition(true);
            }else{
                hideSidebar(false);
                setCheckCondition(false);
            }
        }else{
            hideSidebar(false);
            setCheckCondition(false);
        }
    }

    const goBack = () => {
        hideSidebar(false);
    }
    
    return (
        (checkCondition) ?
        <div className={styles.chat} id="chat__container">
            <div className={styles.chat__header}>
                <div className={styles.chat__mobileBackButton}>
                    <Link to={'/'} onClick={goBack}>
                        <IconButton >
                            <ArrowBack/>
                        </IconButton>
                    </Link>
                </div>
                <Avatar src={participant?.image}/>
                <div className={styles.chat__headerInfo}>
                    <h3>{participant?.name}</h3>
                    <p>{(participant?.last_seen) && format(participant?.last_seen.toDate(), 'yyyy/MM/dd h:mm a')}</p>
                </div>
                <div className={styles.chat__headerRight}>
                    <IconButton> <SearchOutlined /> </IconButton>
                    <IconButton> <AttachFile /> </IconButton>
                    <IconButton> <MoreVert /> </IconButton>
                </div>
            </div>
            <div className={styles.chat__body}>
                {messages.map((message) => (
                    <p key={message.id}
                       className={`${styles.chat__message} ${user.uid === message.sender ? styles.chat__receiver : ''}`}>
                        {/*<span className="chat__name">{(user.uid === message.sender) ? }</span>*/}
                        {message.message}
                        <span
                            className={styles.chat__timestamp}>{(message.timestamp) && format(message.timestamp.toDate(), 'h:mm a')}</span>
                        <span className={styles.chat__status}><ChatStatus iconType={message.status ?? 1}/></span>
                    </p>
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <div className={styles.chat__footer}>
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
        : null
    );
}

export default Chat;