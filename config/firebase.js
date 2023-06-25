// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD-oFkgnQKJpBzImfNjC-fcOzGRxSe6J-M",
    authDomain: "mychat-2ce41.firebaseapp.com",
    databaseURL: "https://mychat-2ce41-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mychat-2ce41",
    storageBucket: "mychat-2ce41.appspot.com",
    messagingSenderId: "1012448669159",
    appId: "1:1012448669159:web:666a097110fc579af76142",
    measurementId: "G-GBM1XG621L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);