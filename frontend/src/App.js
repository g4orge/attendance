import { useEffect } from 'react';
import GoogleCalendar from './Components/GoogleCalendar';
import Augreduvent from './Assets/Augreduvent.png';
import './App.css';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


function App() {
  useEffect(() => {
    const loadGoogleAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;

      // Handle script load success
      script.onload = () => {
        console.log('Google API script loaded successfully');
        window.gapi.load('client:auth2', () => {
          console.log('Google API client loaded');
          initClient(); // Initialize the client once the script is loaded
        });
      };

      // Handle script loading errors
      script.onerror = () => {
        console.error('Failed to load Google API script');
      };

      document.body.appendChild(script);
    };
    const firebaseConfig = {
      apiKey: "AIzaSyCeDS_HWovLEePRsSMJAg2vSMtzTevl1HY",
      authDomain: "attendance-bed1c.firebaseapp.com",
      projectId: "attendance-bed1c",
      storageBucket: "attendance-bed1c.appspot.com",
      messagingSenderId: "255409375523",
      appId: "1:255409375523:web:06dbdad22b352a1cb96496",
      measurementId: "G-Z6PJBGRX8Z"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    

    // Initialize the Google API client
    const initClient = () => {
      window.gapi.client.init({
        apiKey: 'AIzaSyATYJVwz2TTj6igNjZFP4t4har1XiAH0uI', // Replace with your API Key
        clientId: '231611256375-ccl0ua5knonls2t7rpmiafvj0j83ttsv.apps.googleusercontent.com', // Replace with your Client ID
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      }).then(() => {
        console.log('Google API client initialized');
      }).catch(err => {
        console.error('Error initializing Google API client', err);
      });
    };

    loadGoogleAPI();
  }, []);

  return (
    <div>
      <h1>Attendance Tracker</h1>
      <img src={Augreduvent} alt="logo" style={{ width: '50%', height: 'auto' }} /> {/* Image rendered here */}
      <p> </p>
      <GoogleCalendar />
    </div>
  );
}

export default App;
