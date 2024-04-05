import {collection, doc, updateDoc} from "firebase/firestore";
import db from "./firebase";

export const updateMessageStatus = (payload,status) => {
    const parentCollectionRef = collection(db, "rooms",payload.data.roomId,"messages");
    const subCollectionRef = doc(parentCollectionRef, payload.data.msgId);
    return  updateDoc(subCollectionRef, {
        status:status,
    });
}