import React from 'react';
import './App.css';
import Navigation from './NavBar/NavBar.js';
import Routes from './Routes';
import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyCme1dUq1rwXGWCPUd2BpE4GgiegojPJGY',
  authDomain: 'tfg-v2.firebaseapp.com',
  databaseURL: 'https://tfg-v2.firebaseio.com',
  projectId: 'tfg-v2',
  storageBucket: 'tfg-v2.appspot.com',
  messagingSenderId: '736887444972',
  appId: '1:736887444972:web:fb44689b15d843dcf09cc9'
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function App() {
  return (
    <div className="App">
      <Navigation pageWrapId={"page-wrap"} />
        <Routes />
    </div>
  );
}

export default App;