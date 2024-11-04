import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  const firebaseConfig = {
    apiKey: "AIzaSyCSKnkCmh8mrmZ-dkb7O4GNnaEEz5pozUY",
    authDomain: "pr4lugovskoj.firebaseapp.com",
    databaseURL: "https://pr4lugovskoj-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "pr4lugovskoj",
    storageBucket: "pr4lugovskoj.firebasestorage.app",
    messagingSenderId: "240002088688",
    appId: "1:240002088688:web:41142144a79ba98d678c35"
  };

  const app = initializeApp(firebaseConfig);
  export { app }
  console.log(app);
