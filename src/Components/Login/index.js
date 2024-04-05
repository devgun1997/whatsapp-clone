import React from "react";
import {Button} from "@mui/material";
import whatsapp from "../Assets/whatsapp.png";
import "../Css/Login.css";
import db, {auth, provider} from "../firebase";
import {getAuth, signInWithPopup} from "firebase/auth";
import {useStateValue} from "../Provider/StateProvider";
import {actionTypes} from "../Provider/reducer";
import {setDoc, doc} from "firebase/firestore";

function Login(){
    const [{},dispatch] = useStateValue();
    const  signIn = async () => {
        try {
            console.log(getAuth());
            const result = await signInWithPopup(auth, provider);
            // Handle the result, e.g., get user information: result.user
            if(result){


                const roomRef = await setDoc(doc(db,'users',result.user.uid),{
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
            // console.log()
            // const result = await auth.signInWithPopup(provider);
            // Handle the result, e.g., get user information: result.user
            // console.log(result);
        } catch (error) {
            console.error("Authentication error:", error.message);
        }
    }
    return (
      <div className="login">
          <div className="login__container">
              <img src={whatsapp} />
              <div className="login__text">
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