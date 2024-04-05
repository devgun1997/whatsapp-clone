import React, {useEffect, useState} from "react";
import {Avatar} from "@mui/material";
import db from "../firebase";
import {collection, addDoc, query, where, getDocs, doc, getDoc} from "firebase/firestore";
import "../Css/SidebarChat.css";
import {Link} from "react-router-dom";
import {useStateValue} from "../Provider/StateProvider";
import {actionTypes} from "../Provider/reducer";

function SidebarChat( { id, participantId, lastSeen, addNewChat }){
    const [seed, setSeed] = useState('');
    const [ {user},dispatch] = useStateValue();
    const [participantData, setParticipantData] = useState([]);

    const setParticipant =  (participant) => {
        console.log('inside sidebar chat',participant);
        dispatch({
            type : actionTypes.SET_PARTICIPANT,
            participant : participant,
        })
    }

    useEffect(() => {
        const fetchData = async (participantId) => {
            const ref = doc(db, 'users', participantId);
            const docSnap = await getDoc(ref);
            if (docSnap.exists()) {
                setParticipantData(docSnap.data())
                setSeed(Math.floor(Math.random() * 5000))
            }else{
                console.log('participant',participantId);
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
                    const roomRef = await addDoc(collection(db,'rooms'),{
                        participant1:doc.data().uid,
                        participant2:user.uid,
                    })
                }else{
                    alert("User doesn't exist. Please try with some other mail...");
                }
            }
        }
    };
    return !(addNewChat) ? (
        <Link to={`/rooms/${id}`} onClick={() => setParticipant(participantData)}>
            <div className="sidebarChat">
                <Avatar src={participantData.image}/>
                <div className="sidebarChat__info">
                    <h2>{participantData.name}</h2>
                    <p>{lastSeen}</p>
                </div>
            </div>
        </Link>
    ) : (
        <div className="sidebarChat" onClick={createChat}>
            <h2>Add New Chat</h2>
        </div>
    )
}

export default SidebarChat;