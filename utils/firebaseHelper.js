// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


export const getFirebaseApp = () => {
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
        apiKey: "AIzaSyCxWoUxWeOFcOoowOmrdGoaMMCkwFzBIQU",
        authDomain: "whatsapp-b6460.firebaseapp.com",
        projectId: "whatsapp-b6460",
        storageBucket: "whatsapp-b6460.appspot.com",
        messagingSenderId: "210705631952",
        appId: "1:210705631952:web:bc48d915da9a80679e6cd5",
        measurementId: "G-92CW47NNLW"
    };

    // Initialize Firebase
    return initializeApp(firebaseConfig);
}