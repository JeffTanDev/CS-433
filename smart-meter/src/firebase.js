import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBipKgOmPtJK2kQllpu20tbS-xcJZMLDxM",
  authDomain: "smartmeter-95785.firebaseapp.com",
  databaseURL: "https://smartmeter-95785-default-rtdb.firebaseio.com",
  projectId: "smartmeter-95785",
  storageBucket: "smartmeter-95785.appspot.com",
  messagingSenderId: "238014460543",
  appId: "1:238014460543:web:228121bf188c704030454a",
  measurementId: "G-D20531XBK5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);