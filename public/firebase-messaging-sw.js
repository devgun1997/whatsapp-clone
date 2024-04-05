importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-firestore.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js");



const firebaseConfig = {
    apiKey: "AIzaSyBCPaMEHdpDxVsHY_13y3TtQZniRhWNAx8",
    authDomain: "whatsapp-clone-271c7.firebaseapp.com",
    projectId: "whatsapp-clone-271c7",
    storageBucket: "whatsapp-clone-271c7.appspot.com",
    messagingSenderId: "283015252489",
    appId: "1:283015252489:web:12d91661c04d44680e46d8",
    measurementId: "G-TZB8Y76D3L"
};

const app = firebase.initializeApp(firebaseConfig);

// Reference to the Firestore collection
const firestore = app.firestore();
const collectionRef = firestore.collection('rooms');

// Function to update the collection
const updateCollection = async (data) => {
    try {
        // Perform the update
        // await collectionRef.doc(data.roomId).collection("messages").doc(data.msgId).update({status:3});
        console.log('Data added to Firebase collection successfully');
    } catch (error) {
        console.error('Error adding data to Firebase collection:', error);
    }
};
// Retrieve an instance of Firebase Messaging so that it can handle background
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);
    updateCollection(payload.data);
    // Customize notification here
    const notificationTitle = payload.data.senderUser ?? 'guest';
    const notificationOptions = {
        body: payload.data.message ?? 'message body',
    };
    self.registration.showNotification(notificationTitle,
        notificationOptions);
});