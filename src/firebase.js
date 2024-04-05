import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBCPaMEHdpDxVsHY_13y3TtQZniRhWNAx8",
    authDomain: "whatsapp-clone-271c7.firebaseapp.com",
    projectId: "whatsapp-clone-271c7",
    storageBucket: "whatsapp-clone-271c7.appspot.com",
    messagingSenderId: "283015252489",
    appId: "1:283015252489:web:12d91661c04d44680e46d8",
    measurementId: "G-TZB8Y76D3L"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const messaging = getMessaging(app);

export const provider = new GoogleAuthProvider();

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });

// export {auth, provider};

export default db;