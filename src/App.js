import './App.css';
import Sidebar from "./Components/Sidebar";
import Chat from "./Components/Chat";
import Login from "./Components/Login";
import Message from "./Components/Message";
import {useStateValue} from "./Provider/StateProvider";
import db, {auth, messaging, onMessageListener} from "./firebase";
import {actionTypes} from "./Provider/reducer";
import {updateMessageStatus} from "./CommonFunction";


import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import {useEffect, useState} from "react";
import {doc, updateDoc} from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [ {user},dispatch] = useStateValue();

     onMessageListener()
        .then((payload) => {
            updateMessageStatus(payload,2).then(result=>{
                console.log("status updated...");
            });
            toast(<Message notification={payload.data} />);
        })
        .catch((err) => console.log('failed: ', err));

    async function requestPermission() {
        //requesting permission using Notification API
        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const token = await getToken(messaging, {
                vapidKey: 'BDIN7q2ZLKxxpCDQqNbp78N2UrVHz7abSQsAkDHTgmFdCFeO7Rbk8E2Qu-zjxgalwHPZAWsVGzR0cDCIguLiYqE',
            });
            return token;
            //We can send token to server
        } else if (permission === "denied") {
            //notifications are blocked
            alert("You denied for the notification");
        }
    }

    useEffect(() => {
        const unsubscribe  = auth.onAuthStateChanged((user) => {
            if(user){
                requestPermission().then(result=> {
                    updateDoc(doc(db,"users",user.uid),{
                        last_seen : new Date(),
                        token : result
                    });
                })

                dispatch({
                    type : actionTypes.SET_USER,
                    user : user,
                })
            }
        });

        return () => unsubscribe(); // Cleanup the subscription when component unmounts
    }, []);

    const checkMobileCondition = (isHidden) => {
        const isMobile = window.innerWidth <= 767;
        (isMobile) ? setIsSidebarVisible(isHidden) : setIsSidebarVisible(false);
    }
    return (
    <div className="app">
        {
            !user ?
                (
                    <Login />
                ) : (
                    <div className="app__body">
                        <Router>
                            {!isSidebarVisible && <Sidebar hideSidebar={(isHidden) => checkMobileCondition(isHidden)} />}
                            {/*<Sidebar/>*/}
                            <Routes>
                                <Route path="/rooms/:roomId" element={<Chat hideSidebar={(isHidden) => checkMobileCondition(isHidden)} />}/>
                            </Routes>
                        </Router>
                        <ToastContainer />
                    </div>
                )

        }

    </div>
  );
}

export default App;
