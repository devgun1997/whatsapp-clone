import React, {useEffect, useState} from "react";
import {Avatar} from "@mui/material";
import db from "../../firebase";
import {collection, addDoc, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import styles from "./SidebarChat.module.css";
import {Link} from "react-router-dom";
import {useStateValue} from "../../Provider/StateProvider";
import {actionTypes} from "../../Provider/reducer";

function Index({ id, participantId, lastSeen, unread, hideSidebar, addNewChat }){
    const [seed, setSeed] = useState('');
    const [ {user},dispatch] = useStateValue();
    const [participantData, setParticipantData] = useState([]);

    const setParticipant =  (participant) => {
        hideSidebar(false);
        dispatch({
            type : actionTypes.SET_PARTICIPANT,
            participant : participant,
        })
    }

    useEffect(() => {
        const fetchData = async (participantId) => {
            const ref = doc(db, "users", participantId);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                setParticipantData(docSnap.data())
                setSeed(Math.floor(Math.random() * 5000))
            }
        };
        if(participantId)
            fetchData(participantId);
    }, []);

    const createChat = async () => {
        const chatName = prompt("please enter email for new chats");
        if(chatName){
            var email = chatName.toLowerCase().trim();
            if(email == user?.email.toLowerCase().trim() || email == ""){
                alert("please enter a valid email...")
            }else{
                const q = query(collection(db, "users"), where("email", "==", chatName.toLowerCase().trim()));
                const querySnapshot = await getDocs(q);
                const doc = querySnapshot.docs[0];
                if(Boolean(doc)){
                    const q = query(collection(db, "rooms"), where("participant1", "==", doc.data().uid), where("participant2", "==", user.uid));
                    const querySnapshot = await getDocs(q);
                    const check1 = querySnapshot.docs[0];
                    const que = query(collection(db, "rooms"), where("participant1", "==", user.uid), where("participant2", "==", doc.data().uid));
                    const querySnapshot1 = await getDocs(que);
                    const check2 = querySnapshot1.docs[0];
                    if(!Boolean(check1) && !Boolean(check2)){
                        const roomRef = await addDoc(collection(db,"rooms"),{
                            participant1:doc.data().uid,
                            participant2:user.uid,
                            timestamp:new Date()
                        })
                    }else{
                        alert("User is already added...");
                    }

                }else{
                    alert("User doesn't exist. Please try with some other mail...");
                }
            }
        }
    };
    return !(addNewChat) ? (
        <Link to={`/rooms/${id}`} onClick={() => setParticipant(participantData)}>
            <div className={styles.sidebarChat}>
                <Avatar src={participantData.image}/>
                <div className={styles.sidebarChat__info}>
                    <h2>{participantData.name}</h2>
                    <p>{lastSeen}</p>
                </div>
                {(Boolean(unread) && unread > 0) &&
                (<div className={styles.sidebarChat__unread}>
                    <span>{unread}</span>
                </div>) }
            </div>
        </Link>
    ) : (
        <div className={styles.sidebarChat} onClick={createChat}>
            <h2>Add New Chat</h2>
        </div>
    )
}

export default Index;