import { useEffect } from 'react';
import GoogleCalendar from './Components/GoogleCalendar';
import augreduvantlogo2 from './Assets/augreduvantlogo2.png';
import './App.css';

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
      <img src={augreduvantlogo2} alt="logo" style={{ width: '50%', height: 'auto' }} /> {/* Image rendered here */}
      <p> </p>
      <GoogleCalendar />
    </div>
  );
}

export default App;
