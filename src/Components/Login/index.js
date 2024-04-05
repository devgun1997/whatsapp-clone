import React from "react";
import {Button} from "@mui/material";
import whatsapp from "../../Assets/whatsapp.png";
import styles from "./Login.module.css";
import db, {auth, provider} from "../../firebase";
import {getAuth, signInWithPopup} from "firebase/auth";
import {useStateValue} from "../../Provider/StateProvider";
import {actionTypes} from "../../Provider/reducer";
import {setDoc, doc} from "firebase/firestore";

function Login(){
    const [{},dispatch] = useStateValue();
    const  signIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            // Handle the result, e.g., get user information: result.user
            if(result){
                const roomRef = await setDoc(doc(db,"users",result.user.uid),{
                    name:result.user.displayName.toLowerCase().trim(),
                    email:result.user.email.toLowerCase().trim(),
                    number:result.user.phoneNumber,
                    uid:result.user.uid,
                    image:result.user.photoURL
                })
                dispatch({
                    type : actionTypes.SET_USER,
                    user : result.user,
                })
            }
        } catch (error) {
            console.error("Authentication error:", error.message);
        }
    }
    return (
      <div className={styles.login}>
          <div className={styles.login__container}>
              <img src={whatsapp} />
              <div className={styles.login__text}>
                  <h1>Sign to Whatsapp</h1>
              </div>
              <Button type="submit" onClick={signIn}>
                  Sign In with Google
              </Button>
          </div>
      </div>
    );
}

export default Login