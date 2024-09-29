import { useEffect, useState } from 'react';
import {gapi} from 'gapi-script';
import Calendar from 'react-calendar'; // Import the Calendar component
import 'react-calendar/dist/Calendar.css';

const CLIENT_ID = '231611256375-ccl0ua5knonls2t7rpmiafvj0j83ttsv.apps.googleusercontent.com';
const API_KEY = 'AIzaSyATYJVwz2TTj6igNjZFP4t4har1XiAH0uI';
const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'];

const GoogleCalendar = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    summary: '',
    location: '',
    description: '',
    start: '',
    end: '',
  });
    const [isCreatingEvent, setIsCreatingEvent] = useState(false);
    const [date, setDate] = useState(new Date());

    const handleDateClick = (value) => {
        setDate(value);
        const selectedDate = new Date(value);
        const startDateTime = new Date(selectedDate.setHours(9, 0)); // Set default start time
        const endDateTime = new Date(selectedDate.setHours(10, 0)); // Set default end time
    
        setEventDetails({
          ...eventDetails,
          start: startDateTime.toISOString().slice(0, 16),
          end: endDateTime.toISOString().slice(0, 16),
        });
    
        setIsCreatingEvent(true);
      };

  useEffect(() => {
    const initClient = () => {
      if (window.gapi && window.gapi.client) {
        window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES,
        }).then(() => {
          const authInstance = window.gapi.auth2.getAuthInstance();
          authInstance.isSignedIn.listen(setIsSignedIn);
          setIsSignedIn(authInstance.isSignedIn.get());
        }).catch(err => {
          console.error('Error initializing Google API client', err);
          setError('Failed to initialize Google API client. Please check your configuration.');
        });
      } else {
        setError('Google API client library not available.');
      }
    };

    // Load the client after the script is loaded
    const loadGapi = () => {
      window.gapi.load('client:auth2', initClient);
    };

    // Check if gapi is already available, if not load the client
    if (window.gapi) {
      loadGapi();
    } else {
      setError('Google API script not loaded.');
    }
  }, []);

  const handleAuthClick = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signIn().catch(err => {
        console.error('Error during sign-in', err);
        setError('Sign-in failed. Please check your configurations and try again.');
      });
    } else {
      setError('Google API client not initialized yet.');
    }
  };

  const handleSignOutClick = () => {
    const authInstance = window.gapi.auth2.getAuthInstance();
    if (authInstance) {
      authInstance.signOut();
      setIsSignedIn(false);
      setEvents([]);
    }
  };

  const handleCreateEventClick = () => {
    setIsCreatingEvent(true);
  };
  const handleEventChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleEventSubmit = (e) => {
    e.preventDefault();
    const { summary, location, description, start, end } = eventDetails;

    const event = {
      summary,
      location,
      description,
      start: {
        dateTime: start,
        timeZone: 'America/New_York', // Adjust as necessary
      },
      end: {
        dateTime: end,
        timeZone: 'America/New_York', // Adjust as necessary
      },
    };

    // Create event in Google Calendar
    window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    }).then(response => {
      console.log('Event created: ', response);
      setEventDetails({ summary: '', location: '', description: '', start: '', end: '' });
      setIsCreatingEvent(false);
      alert('Event created successfully!');
    }).catch(err => {
      console.error('Error creating event', err);
      setError('Failed to create event');
    });
  };


  const listUpcomingEvents = () => {
    if (!isSignedIn) {
      setError('You must be signed in to view events.');
      return;
    }

    window.gapi.client.calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: 'startTime'
    }).then(response => {
      const events = response.result.items;
      if (events.length > 0) {
        setEvents(events);
      } else {
        console.log('No upcoming events found.');
        setEvents([]);
      }
    }).catch(err => {
      console.error('Error fetching events', err);
      setError('Failed to retrieve events');
    });
  };

return (
    <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!isSignedIn ? (
            <button onClick={handleAuthClick}>Sign in with Google</button>
        ) : (
            <>
                <button onClick={handleSignOutClick}>Sign out</button>
                <button onClick={handleCreateEventClick}>Create Event</button>
                <button onClick={listUpcomingEvents}>List Upcoming Events</button>

                {isCreatingEvent && (
                    <form onSubmit={handleEventSubmit}>
                        <h3>Create Event</h3>
                        <input
                            type="text"
                            name="summary"
                            placeholder="Employee ID"
                            value={eventDetails.summary}
                            onChange={handleEventChange}
                            required
                        />
                        <input
                            type="text"
                            name="childFirstName"
                            placeholder="Child First Name"
                            value={eventDetails.childFirstName}
                            onChange={handleEventChange}
                            required
                        />
                        <input
                            type="text"
                            name="childLastName"
                            placeholder="Child Last Name"
                            value={eventDetails.childLastName}
                            onChange={handleEventChange}
                            required
                        />
                        <select
                            name="location"
                            value={eventDetails.location}
                            onChange={handleEventChange}
                            required
                        >
                            <option value="">Select Location</option>
                            <option value="Location 1">Location 1</option>
                            <option value="Location 2">Location 2</option>
                            <option value="Location 3">Location 3</option>
                            <option value="Location 4">Location 4</option>
                            <option value="Location 5">Location 5</option>
                        </select>
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={eventDetails.description}
                            onChange={handleEventChange}
                        />
                        <input
                            type="datetime-local"
                            name="start"
                            value={eventDetails.start}
                            onChange={handleEventChange}
                            required
                        />
                        <input
                            type="datetime-local"
                            name="end"
                            value={eventDetails.end}
                            onChange={handleEventChange}
                            required
                        />
                        <button type="submit">Create Event</button>
                        <button type="button" onClick={() => setIsCreatingEvent(false)}>Cancel</button>
                    </form>
                )}

                <Calendar
                    onChange={handleDateClick}
                    value={date}
                    />
                    <style jsx>{`
                        .center {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                    `}</style>
                    <div className="center">
                        {!isSignedIn && <button onClick={handleAuthClick}>Sign in with Google</button>}
                    </div>
                    />
                <ul>
                    {events.map(event => (
                        <li key={event.id}>
                            {event.summary} ({event.start.dateTime || event.start.date})
                        </li>
                    ))}
                </ul>
            </>
        )}
    </div>
);
};

export default GoogleCalendar;