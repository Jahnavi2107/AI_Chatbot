import React, { useState } from 'react';
import { MessageCircle, Calendar, Users, MapPin, Search, Plane } from 'lucide-react';
import Chat from './Chat';
import './App.css';

function App() {
  const [showChat, setShowChat] = useState(false);
  const [tripType, setTripType] = useState('round');
  const [flightDetails, setFlightDetails] = useState({
    origin: '',
    destination: '',
    departDate: '',
    returnDate: '',
    passengers: '1',
    class: 'economy'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    // Validate inputs
    if (!flightDetails.origin || !flightDetails.destination || !flightDetails.departDate) {
      alert('Please fill in all required fields');
      return;
    }

    if (tripType === 'round' && !flightDetails.returnDate) {
      alert('Please select a return date for round trip');
      return;
    }

    console.log('Searching flights:', { tripType, ...flightDetails });
  };

  // Passenger options
  const passengerOptions = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="App">
      <header className="main-header">
        <div className="logo">
          <Plane size={24} />
          Fly High
        </div>
        <nav className="main-nav">
          <div>BOOK & MANAGE</div>
          <div>WHERE WE FLY</div>
          <div>PREPARE TO TRAVEL</div>
          <div>Fly High EXPERIENCE</div>
          <div>Fly High CLUB</div>
          <div className="nav-utils">
            <span>TARIFF</span>
            <span>GIFT CARDS</span>
            <span>SEARCH</span>
            <span>SUPPORT</span>
            <span>SIGN IN</span>
          </div>
        </nav>
      </header>

      <div className="search-section">
        <div className="search-tabs">
          <button className="tab active">
            <Plane size={18} />
            SEARCH FLIGHTS
          </button>
          <button className="tab">
            <Search size={18} />
            MANAGE BOOKING
          </button>
          <button className="tab">CHECK IN</button>
          <button className="tab">FLIGHT STATUS</button>
          <button className="tab special">SPECIAL DEALS</button>
        </div>

        <div className="search-box">
          <div className="trip-options">
            <label>
              <input 
                type="radio" 
                name="trip" 
                value="oneway"
                checked={tripType === 'oneway'}
                onChange={(e) => setTripType(e.target.value)}
              /> 
              One Way
            </label>
            <label>
              <input 
                type="radio" 
                name="trip" 
                value="round"
                checked={tripType === 'round'}
                onChange={(e) => setTripType(e.target.value)}
              /> 
              Round Trip
            </label>
            <label>
              <input 
                type="radio" 
                name="trip" 
                value="multi"
                checked={tripType === 'multi'}
                onChange={(e) => setTripType(e.target.value)}
              /> 
              Multi City
            </label>
          </div>

          <div className="search-inputs">
            <div className="route-inputs">
              <div className="input-group">
                <label>
                  <MapPin size={18} />
                  FROM
                </label>
                <input 
                  type="text" 
                  name="origin"
                  placeholder="Select Origin"
                  value={flightDetails.origin}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input-group">
                <label>
                  <MapPin size={18} />
                  TO
                </label>
                <input 
                  type="text" 
                  name="destination"
                  placeholder="Select Destination"
                  value={flightDetails.destination}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flight-details">
              <div className="input-group">
                <label>
                  <Calendar size={18} />
                  DEPARTURE
                </label>
                <input 
                  type="date" 
                  name="departDate"
                  value={flightDetails.departDate}
                  onChange={handleInputChange}
                />
              </div>
              
              {tripType === 'round' && (
                <div className="input-group">
                  <label>
                    <Calendar size={18} />
                    RETURN
                  </label>
                  <input 
                    type="date" 
                    name="returnDate"
                    value={flightDetails.returnDate}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div className="input-group">
                <label>
                  <Users size={18} />
                  PASSENGERS
                </label>
                <select 
                  name="passengers"
                  value={flightDetails.passengers}
                  onChange={handleInputChange}
                >
                  {passengerOptions.map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label>CLASS</label>
                <select 
                  name="class"
                  value={flightDetails.class}
                  onChange={handleInputChange}
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>

            <button className="search-button" onClick={handleSearch}>
              <Search size={20} />
              Search Flights
            </button>
          </div>
        </div>
      </div>

      <section className="travel-prep">
        <h2>PREPARE TO TRAVEL</h2>
        <p>Helpful hints for everything from packing to paperwork, so you are fully prepared.</p>
        
        <div className="info-cards">
          <div className="info-card">
            <h3>BAGGAGE ESSENTIALS</h3>
            <p>Travel light on worries and heavy on information. Baggage rules decoded.</p>
          </div>

          <div className="info-card">
            <h3>AIRPORT ADVENTURES</h3>
            <p>Turn layovers into mini vacations—insights on terminals, lounges, amenities and more.</p>
          </div>

          <div className="info-card">
            <h3>BEFORE YOU FLY</h3>
            <p>From visa essentials to medical assistance, everything you need to know.</p>
          </div>
        </div>
      </section>

      {showChat ? (
        <Chat closeChat={() => setShowChat(false)} />
      ) : (
        <button className="chat-button" onClick={() => setShowChat(true)}>
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}

export default App;