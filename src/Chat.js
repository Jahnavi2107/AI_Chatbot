// // // // import React, { useState, useRef, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import { X, Send, Loader, Calendar, Plane, Luggage, FileQuestion } from 'lucide-react';
// // // // import './Chat.css';

// // // // const Chat = () => {
// // // //     const [messages, setMessages] = useState([]);
// // // //     const [input, setInput] = useState('');
// // // //     const [language, setLanguage] = useState('en');
// // // //     const [isOpen, setIsOpen] = useState(false);
// // // //     const [isLoading, setIsLoading] = useState(false);
// // // //     const chatBoxRef = useRef(null);
// // // //     const inputRef = useRef(null);

// // // //     // Auto-scroll to latest message
// // // //     useEffect(() => {
// // // //         if (chatBoxRef.current) {
// // // //             chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
// // // //         }
// // // //     }, [messages]);

// // // //     // Focus input when chat opens
// // // //     useEffect(() => {
// // // //         if (isOpen && inputRef.current) {
// // // //             inputRef.current.focus();
// // // //         }
// // // //     }, [isOpen]);

// // // //     const quickActions = [
// // // //         {
// // // //             icon: <Calendar size={16} />,
// // // //             text: 'Search Flights',
// // // //             action: 'search flight from Delhi to Mumbai on 2024-12-25'
// // // //         },
// // // //         {
// // // //             icon: <Luggage size={16} />,
// // // //             text: 'Baggage Info',
// // // //             action: 'What is the baggage allowance?'
// // // //         },
// // // //         {
// // // //             icon: <FileQuestion size={16} />,
// // // //             text: 'Cancellation',
// // // //             action: 'What are your cancellation policies?'
// // // //         }
// // // //     ];

// // // //     const formatFlightData = (flight) => ({
// // // //         departure: flight.departure || flight.Dep_Time,
// // // //         duration: flight.duration || flight.Duration,
// // // //         stops: flight.stops || flight.Total_Stops,
// // // //         price: flight.price || flight.Price,
// // // //         airline: flight.airline || flight.Airline,
// // // //         additional_info: flight.additional_info || flight.Additional_Info
// // // //     });

// // // //     const renderFlightResults = (botResponse) => {
// // // //         const flightDetails = (
// // // //             <div className="flight-results">
// // // //                 <div className="flight-header">
// // // //                     <Plane size={20} />
// // // //                     <span>Available Flights</span>
// // // //                 </div>
// // // //                 <table className="flight-table">
// // // //                     <thead>
// // // //                         <tr>
                           
// // // //                             <th>Departure</th>
// // // //                             <th>Duration</th>
// // // //                             <th>Stops</th>
// // // //                             <th>Price</th>
// // // //                         </tr>
// // // //                     </thead>
// // // //                     <tbody>
// // // //                         {botResponse.flights.map((flight, index) => {
// // // //                             const formattedFlight = formatFlightData(flight);
// // // //                             return (
// // // //                                 <tr key={index} className="flight-row">
                                    
// // // //                                     <td>{formattedFlight.departure}</td>
// // // //                                     <td>{formattedFlight.duration}</td>
// // // //                                     <td>{formattedFlight.stops}</td>
// // // //                                     <td className="price">${formattedFlight.price}</td>
// // // //                                 </tr>
// // // //                             );
// // // //                         })}
// // // //                     </tbody>
// // // //                 </table>
// // // //                 <div className="booking-prompt">
// // // //                     Would you like to book any of these flights? 
// // // //                     Type "book flight [airline name]" to proceed.
// // // //                 </div>
// // // //             </div>
// // // //         );

// // // //         setMessages(prev => [
// // // //             ...prev,
// // // //             { sender: 'bot', text: botResponse.message },
// // // //             { sender: 'bot', text: flightDetails }
// // // //         ]);
// // // //     };

// // // //     const handleSend = async () => {
// // // //         if (input.trim() === '') return;

// // // //         const userMessage = { sender: 'user', text: input };
// // // //         setMessages(prev => [...prev, userMessage]);
// // // //         setIsLoading(true);

// // // //         try {
// // // //             let payload;
// // // //             let endpoint = 'http://localhost:5001/api/chat';

// // // //             if (input.toLowerCase().includes('search flight')) {
// // // //                 const matches = input.match(/from (.+?) to (.+?) on (\d{4}-\d{2}-\d{2})/i);
// // // //                 if (!matches) {
// // // //                     throw new Error('Please use format: search flight from [city] to [city] on YYYY-MM-DD');
// // // //                 }
// // // //                 const [, source, destination, journey_date] = matches.map(str => str.trim());
// // // //                 payload = { source, destination, journey_date, language };
// // // //                 endpoint = 'http://localhost:5001/api/search-flights';
// // // //             } else if (input.toLowerCase().startsWith('book flight')) {
// // // //                 const airline = input.toLowerCase().replace('book flight', '').trim();
// // // //                 payload = { 
// // // //                     message: input, 
// // // //                     language,
// // // //                     action: 'BOOK',
// // // //                     airline 
// // // //                 };
// // // //             } else {
// // // //                 payload = { 
// // // //                     message: input, 
// // // //                     language,
// // // //                     user_id: 'user-' + Math.random().toString(36).substr(2, 9)
// // // //                 };
// // // //             }

// // // //             const response = await axios.post(endpoint, payload);
// // // //             const botResponse = response.data;

// // // //             if (botResponse.flights?.length > 0) {
// // // //                 renderFlightResults(botResponse);
// // // //             } else {
// // // //                 setMessages(prev => [
// // // //                     ...prev,
// // // //                     { 
// // // //                         sender: 'bot', 
// // // //                         text: botResponse.response || botResponse.message || "I couldn't find any flights matching your criteria."
// // // //                     }
// // // //                 ]);
// // // //             }
// // // //         } catch (error) {
// // // //             console.error('Error:', error);
// // // //             setMessages(prev => [
// // // //                 ...prev,
// // // //                 { 
// // // //                     sender: 'bot', 
// // // //                     text: error.message || "I'm having trouble understanding. Please try again." 
// // // //                 }
// // // //             ]);
// // // //         } finally {
// // // //             setIsLoading(false);
// // // //             setInput('');
// // // //         }
// // // //     };

// // // //     const handleKeyDown = (event) => {
// // // //         if (event.key === 'Enter' && !event.shiftKey) {
// // // //             event.preventDefault();
// // // //             handleSend();
// // // //         }
// // // //     };

// // // //     const renderMessage = (message, index) => (
// // // //         <div 
// // // //             key={index} 
// // // //             className={`chat-message ${message.sender} ${typeof message.text === 'string' ? 'text-message' : 'rich-content'}`}
// // // //         >
// // // //             {message.text}
// // // //         </div>
// // // //     );

// // // //     const renderSuggestions = () => (
// // // //         <div className="chat-suggestions">
// // // //             {quickActions.map((action, index) => (
// // // //                 <button key={index} onClick={() => setInput(action.action)}>
// // // //                     {action.icon} {action.text}
// // // //                 </button>
// // // //             ))}
// // // //         </div>
// // // //     );

// // // //     return (
// // // //         <>
// // // //             <button 
// // // //                 className="chat-button" 
// // // //                 onClick={() => setIsOpen(true)} 
// // // //                 style={{ display: isOpen ? 'none' : 'flex' }}
// // // //                 aria-label="Chat with Flight Assistant"
// // // //             >
// // // //                 <Plane size={500}/>
// // // //             </button>

// // // //             <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
// // // //                 <div className="chat-header">
// // // //                     <span className="header-title">
// // // //                         <Plane size={20} />
// // // //                         Flight Assistant
// // // //                     </span>
// // // //                     <button 
// // // //                         className="close-button" 
// // // //                         onClick={() => setIsOpen(false)}
// // // //                         aria-label="Close chat"
// // // //                     >
// // // //                         <X size={20} />
// // // //                     </button>
// // // //                 </div>

// // // //                 <div className="chat-language-selector">
// // // //                     <label htmlFor="language">Language:</label>
// // // //                     <select 
// // // //                         id="language" 
// // // //                         value={language} 
// // // //                         onChange={(e) => setLanguage(e.target.value)}
// // // //                     >
// // // //                         <option value="en">English</option>
// // // //                         <option value="es">Español</option>
// // // //                         <option value="fr">Français</option>
// // // //                         <option value="de">Deutsch</option>
// // // //                         <option value="zh-cn">中文</option>
// // // //                         <option value="hi">हिंदी</option>
// // // //                     </select>
// // // //                 </div>

// // // //                 <div className="chat-box" ref={chatBoxRef}>
// // // //                     {messages.length === 0 && (
// // // //                         <div className="welcome-message">
// // // //                             👋 Hi! I'm your flight assistant. How can I help you today?
// // // //                             {renderSuggestions()}
// // // //                         </div>
// // // //                     )}
// // // //                     {messages.map(renderMessage)}
// // // //                     {isLoading && (
// // // //                         <div className="chat-message bot loading">
// // // //                             <Loader className="animate-spin" size={20} />
// // // //                             Processing your request...
// // // //                         </div>
// // // //                     )}
// // // //                 </div>

// // // //                 <div className="chat-input">
// // // //                     <input
// // // //                         ref={inputRef}
// // // //                         type="text"
// // // //                         value={input}
// // // //                         onChange={(e) => setInput(e.target.value)}
// // // //                         onKeyDown={handleKeyDown}
// // // //                         placeholder="Type your message or ask about flights..."
// // // //                         disabled={isLoading}
// // // //                     />
// // // //                     <button 
// // // //                         onClick={handleSend} 
// // // //                         disabled={isLoading || !input.trim()}
// // // //                         title={isLoading ? "Processing..." : "Send message"}
// // // //                         aria-label="Send message"
// // // //                     >
// // // //                         <Send size={20} />
// // // //                     </button>
// // // //                 </div>
// // // //             </div>
// // // //         </>
// // // //     );
// // // // };

// // // // export default Chat;
// // // import React, { useState, useRef, useEffect } from 'react';
// // // import axios from 'axios';
// // // import { X, Send, Loader, Calendar, Plane, Luggage, FileQuestion, Clock } from 'lucide-react';
// // // import './Chat.css';

// // // const Chat = () => {
// // //     const [messages, setMessages] = useState([]);
// // //     const [input, setInput] = useState('');
// // //     const [language, setLanguage] = useState('en');
// // //     const [isOpen, setIsOpen] = useState(false);
// // //     const [isLoading, setIsLoading] = useState(false);
// // //     const chatBoxRef = useRef(null);
// // //     const inputRef = useRef(null);

// // //     useEffect(() => {
// // //         if (chatBoxRef.current) {
// // //             chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
// // //         }
// // //     }, [messages]);

// // //     useEffect(() => {
// // //         if (isOpen && inputRef.current) {
// // //             inputRef.current.focus();
// // //         }
// // //     }, [isOpen]);

// // //     const quickActions = [
// // //         {
// // //             icon: <Calendar size={16} />,
// // //             text: 'Search Flights',
// // //             action: 'search flight from Delhi to Mumbai on 2024-12-25'
// // //         },
// // //         {
// // //             icon: <Luggage size={16} />,
// // //             text: 'Check Baggage Status',
// // //             action: 'Check baggage handling for PNR 19556'
// // //         },
// // //         {
// // //             icon: <Clock size={16} />,
// // //             text: 'Check Delays',
// // //             action: 'Show flight delays for PNR 19556'
// // //         },
// // //         {
// // //             icon: <FileQuestion size={16} />,
// // //             text: 'Flight Class',
// // //             action: 'What is my flight class for PNR 19556'
// // //         }
// // //     ];

// // //     const formatFlightData = (flight) => ({
// // //         departure: flight.departure || flight.Dep_Time,
// // //         duration: flight.duration || flight.Duration,
// // //         stops: flight.stops || flight.Total_Stops,
// // //         price: flight.price || flight.Price,
// // //         airline: flight.airline || flight.Airline,
// // //         additional_info: flight.additional_info || flight.Additional_Info
// // //     });

// // //     const renderFlightResults = (botResponse) => {
// // //         const flightDetails = (
// // //             <div className="flight-results">
// // //                 <div className="flight-header">
// // //                     <Plane size={20} />
// // //                     <span>Available Flights</span>
// // //                 </div>
// // //                 <table className="flight-table">
// // //                     <thead>
// // //                         <tr>
// // //                             <th>Departure</th>
// // //                             <th>Duration</th>
// // //                             <th>Stops</th>
// // //                             <th>Price</th>
// // //                         </tr>
// // //                     </thead>
// // //                     <tbody>
// // //                         {botResponse.flights.map((flight, index) => {
// // //                             const formattedFlight = formatFlightData(flight);
// // //                             return (
// // //                                 <tr key={index} className="flight-row">
// // //                                     <td>{formattedFlight.departure}</td>
// // //                                     <td>{formattedFlight.duration}</td>
// // //                                     <td>{formattedFlight.stops}</td>
// // //                                     <td className="price">${formattedFlight.price}</td>
// // //                                 </tr>
// // //                             );
// // //                         })}
// // //                     </tbody>
// // //                 </table>
// // //                 <div className="booking-prompt">
// // //                     Would you like to book any of these flights? 
// // //                     Type "book flight [airline name]" to proceed.
// // //                 </div>
// // //             </div>
// // //         );

// // //         setMessages(prev => [
// // //             ...prev,
// // //             { sender: 'bot', text: botResponse.message },
// // //             { sender: 'bot', text: flightDetails }
// // //         ]);
// // //     };

// // //     const renderPNRDetails = (response) => {
// // //         let content;
// // //         if (response.includes("Baggage handling")) {
// // //             content = (
// // //                 <div className="pnr-details baggage">
// // //                     <Luggage size={20} />
// // //                     <div>{response}</div>
// // //                 </div>
// // //             );
// // //         } else if (response.includes("delay")) {
// // //             content = (
// // //                 <div className="pnr-details delays">
// // //                     <Clock size={20} />
// // //                     <div>{response}</div>
// // //                 </div>
// // //             );
// // //         } else if (response.includes("class")) {
// // //             content = (
// // //                 <div className="pnr-details class">
// // //                     <Plane size={20} />
// // //                     <div>{response}</div>
// // //                 </div>
// // //             );
// // //         } else {
// // //             content = <div className="pnr-details">{response}</div>;
// // //         }

// // //         return { sender: 'bot', text: content };
// // //     };

// // //     const handleSend = async () => {
// // //         if (input.trim() === '') return;

// // //         const userMessage = { sender: 'user', text: input };
// // //         setMessages(prev => [...prev, userMessage]);
// // //         setIsLoading(true);

// // //         try {
// // //             let payload;
// // //             let endpoint = 'http://localhost:5001/api/chat';

// // //             if (input.toLowerCase().includes('search flight')) {
// // //                 const matches = input.match(/from (.+?) to (.+?) on (\d{4}-\d{2}-\d{2})/i);
// // //                 if (!matches) {
// // //                     throw new Error('Please use format: search flight from [city] to [city] on YYYY-MM-DD');
// // //                 }
// // //                 const [, source, destination, journey_date] = matches.map(str => str.trim());
// // //                 payload = { source, destination, journey_date, language };
// // //                 endpoint = 'http://localhost:5001/api/search-flights';
// // //             } else if (input.toLowerCase().startsWith('book flight')) {
// // //                 const airline = input.toLowerCase().replace('book flight', '').trim();
// // //                 payload = { 
// // //                     message: input, 
// // //                     language,
// // //                     action: 'BOOK',
// // //                     airline 
// // //                 };
// // //             } else {
// // //                 // Extract PNR if present in the message
// // //                 const pnrMatch = input.match(/PNR\s+(\d+)/i);
// // //                 const pnr = pnrMatch ? pnrMatch[1] : null;
                
// // //                 payload = { 
// // //                     message: input, 
// // //                     language,
// // //                     user_id: 'user-' + Math.random().toString(36).substr(2, 9),
// // //                     pnr
// // //                 };
// // //             }

// // //             const response = await axios.post(endpoint, payload);
// // //             const botResponse = response.data;

// // //             if (botResponse.flights?.length > 0) {
// // //                 renderFlightResults(botResponse);
// // //             } else {
// // //                 const messageText = botResponse.response || botResponse.message;
// // //                 if (messageText.includes('PNR') || 
// // //                     input.toLowerCase().includes('baggage') || 
// // //                     input.toLowerCase().includes('delay') || 
// // //                     input.toLowerCase().includes('class')) {
// // //                     setMessages(prev => [...prev, renderPNRDetails(messageText)]);
// // //                 } else {
// // //                     setMessages(prev => [...prev, { sender: 'bot', text: messageText }]);
// // //                 }
// // //             }
// // //         } catch (error) {
// // //             console.error('Error:', error);
// // //             setMessages(prev => [
// // //                 ...prev,
// // //                 { 
// // //                     sender: 'bot', 
// // //                     text: error.message || "I'm having trouble understanding. Please try again." 
// // //                 }
// // //             ]);
// // //         } finally {
// // //             setIsLoading(false);
// // //             setInput('');
// // //         }
// // //     };

// // //     const handleKeyDown = (event) => {
// // //         if (event.key === 'Enter' && !event.shiftKey) {
// // //             event.preventDefault();
// // //             handleSend();
// // //         }
// // //     };

// // //     const renderMessage = (message, index) => (
// // //         <div 
// // //             key={index} 
// // //             className={`chat-message ${message.sender} ${typeof message.text === 'string' ? 'text-message' : 'rich-content'}`}
// // //         >
// // //             {message.text}
// // //         </div>
// // //     );

// // //     const renderSuggestions = () => (
// // //         <div className="chat-suggestions">
// // //             {quickActions.map((action, index) => (
// // //                 <button key={index} onClick={() => setInput(action.action)}>
// // //                     {action.icon} {action.text}
// // //                 </button>
// // //             ))}
// // //         </div>
// // //     );

// // //     return (
// // //         <>
// // //             <button 
// // //                 className="chat-button" 
// // //                 onClick={() => setIsOpen(true)} 
// // //                 style={{ display: isOpen ? 'none' : 'flex' }}
// // //                 aria-label="Chat with Flight Assistant"
// // //             >
// // //                 <Plane size={500}/>
// // //             </button>

// // //             <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
// // //                 <div className="chat-header">
// // //                     <span className="header-title">
// // //                         <Plane size={20} />
// // //                         Flight Assistant
// // //                     </span>
// // //                     <button 
// // //                         className="close-button" 
// // //                         onClick={() => setIsOpen(false)}
// // //                         aria-label="Close chat"
// // //                     >
// // //                         <X size={20} />
// // //                     </button>
// // //                 </div>

// // //                 <div className="chat-language-selector">
// // //                     <label htmlFor="language">Language:</label>
// // //                     <select 
// // //                         id="language" 
// // //                         value={language} 
// // //                         onChange={(e) => setLanguage(e.target.value)}
// // //                     >
// // //                         <option value="en">English</option>
// // //                         <option value="es">Español</option>
// // //                         <option value="fr">Français</option>
// // //                         <option value="de">Deutsch</option>
// // //                         <option value="zh-cn">中文</option>
// // //                         <option value="hi">हिंदी</option>
// // //                     </select>
// // //                 </div>

// // //                 <div className="chat-box" ref={chatBoxRef}>
// // //                     {messages.length === 0 && (
// // //                         <div className="welcome-message">
// // //                             👋 Hi! I'm your flight assistant. How can I help you today?
// // //                             {renderSuggestions()}
// // //                         </div>
// // //                     )}
// // //                     {messages.map(renderMessage)}
// // //                     {isLoading && (
// // //                         <div className="chat-message bot loading">
// // //                             <Loader className="animate-spin" size={20} />
// // //                             Processing your request...
// // //                         </div>
// // //                     )}
// // //                 </div>

// // //                 <div className="chat-input">
// // //                     <input
// // //                         ref={inputRef}
// // //                         type="text"
// // //                         value={input}
// // //                         onChange={(e) => setInput(e.target.value)}
// // //                         onKeyDown={handleKeyDown}
// // //                         placeholder="Type your message or ask about flights..."
// // //                         disabled={isLoading}
// // //                     />
// // //                     <button 
// // //                         onClick={handleSend} 
// // //                         disabled={isLoading || !input.trim()}
// // //                         title={isLoading ? "Processing..." : "Send message"}
// // //                         aria-label="Send message"
// // //                     >
// // //                         <Send size={20} />
// // //                     </button>
// // //                 </div>
// // //             </div>
// // //         </>
// // //     );
// // // };

// // // export default Chat;
// // import React, { useState, useRef, useEffect } from 'react';
// // import axios from 'axios';
// // import { X, Send, Loader, Calendar, Plane, Luggage, FileQuestion, Clock } from 'lucide-react';
// // import './Chat.css';

// // const Chat = () => {
// //     const [messages, setMessages] = useState([]);
// //     const [input, setInput] = useState('');
// //     const [language, setLanguage] = useState('en');
// //     const [isOpen, setIsOpen] = useState(false);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [currentPNR, setCurrentPNR] = useState(null);
// //     const chatBoxRef = useRef(null);
// //     const inputRef = useRef(null);

// //     useEffect(() => {
// //         if (chatBoxRef.current) {
// //             chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
// //         }
// //     }, [messages]);

// //     useEffect(() => {
// //         if (isOpen && inputRef.current) {
// //             inputRef.current.focus();
// //         }
// //     }, [isOpen]);

// //     const quickActions = [
// //         {
// //             icon: <Calendar size={16} />,
// //             text: 'Search Flights',
// //             action: 'search flight from Delhi to Mumbai on 2024-12-25'
// //         },
// //         {
// //             icon: <Luggage size={16} />,
// //             text: 'Check Baggage Status',
// //             action: 'Check baggage handling status'
// //         },
// //         {
// //             icon: <Clock size={16} />,
// //             text: 'Check Delays',
// //             action: 'Show flight delays'
// //         },
// //         {
// //             icon: <FileQuestion size={16} />,
// //             text: 'Flight Class',
// //             action: 'What is my flight class'
// //         }
// //     ];

// //     const handlePNRSet = (message) => {
// //         const pnrMatch = message.match(/PNR\s+(\d+)/i) || message.match(/(\d{5,6})/);
// //         if (pnrMatch) {
// //             const newPNR = pnrMatch[1];
// //             setCurrentPNR(newPNR);
// //             return true;
// //         }
// //         return false;
// //     };

// //     const formatFlightData = (flight) => ({
// //         departure: flight.departure || flight.Dep_Time,
// //         duration: flight.duration || flight.Duration,
// //         stops: flight.stops || flight.Total_Stops,
// //         price: flight.price || flight.Price,
// //         airline: flight.airline || flight.Airline,
// //         additional_info: flight.additional_info || flight.Additional_Info
// //     });

// //     const renderFlightResults = (botResponse) => {
// //         const flightDetails = (
// //             <div className="flight-results">
// //                 <div className="flight-header">
// //                     <Plane size={20} />
// //                     <span>Available Flights</span>
// //                 </div>
// //                 <table className="flight-table">
// //                     <thead>
// //                         <tr>
// //                             <th>Airline</th>
// //                             <th>Departure</th>
// //                             <th>Duration</th>
// //                             <th>Stops</th>
// //                             <th>Price</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {botResponse.flights.map((flight, index) => {
// //                             const formattedFlight = formatFlightData(flight);
// //                             return (
// //                                 <tr key={index} className="flight-row">
// //                                     <td>{formattedFlight.airline}</td>
// //                                     <td>{formattedFlight.departure}</td>
// //                                     <td>{formattedFlight.duration}</td>
// //                                     <td>{formattedFlight.stops}</td>
// //                                     <td className="price">₹{formattedFlight.price}</td>
// //                                 </tr>
// //                             );
// //                         })}
// //                     </tbody>
// //                 </table>
// //                 <div className="booking-prompt">
// //                     Would you like to book any of these flights? 
// //                     Type "book flight [airline name]" to proceed.
// //                 </div>
// //             </div>
// //         );

// //         setMessages(prev => [
// //             ...prev,
// //             { sender: 'bot', text: botResponse.message },
// //             { sender: 'bot', text: flightDetails }
// //         ]);
// //     };

// //     const renderPNRDetails = (response) => {
// //         let content;
// //         if (response.includes("Baggage handling")) {
// //             content = (
// //                 <div className="pnr-details baggage">
// //                     <Luggage size={20} />
// //                     <div>{response}</div>
// //                 </div>
// //             );
// //         } else if (response.includes("delay")) {
// //             content = (
// //                 <div className="pnr-details delays">
// //                     <Clock size={20} />
// //                     <div>{response}</div>
// //                 </div>
// //             );
// //         } else if (response.includes("class")) {
// //             content = (
// //                 <div className="pnr-details class">
// //                     <Plane size={20} />
// //                     <div>{response}</div>
// //                 </div>
// //             );
// //         } else {
// //             content = <div className="pnr-details">{response}</div>;
// //         }

// //         return { sender: 'bot', text: content };
// //     };

// //     const renderPNRStatus = () => {
// //         if (!currentPNR) return null;
// //         return (
// //             <div className="current-pnr-status">
// //                 Current PNR: {currentPNR}
// //                 <button 
// //                     onClick={() => setCurrentPNR(null)}
// //                     className="clear-pnr-btn"
// //                     title="Clear PNR"
// //                 >
// //                     <X size={14} />
// //                 </button>
// //             </div>
// //         );
// //     };

// //     const handleSend = async () => {
// //         if (input.trim() === '') return;

// //         const userMessage = { sender: 'user', text: input };
// //         setMessages(prev => [...prev, userMessage]);
// //         setIsLoading(true);

// //         try {
// //             let payload;
// //             let endpoint = 'http://localhost:5001/api/chat';

// //             // Check if this is a PNR setting message
// //             if (!currentPNR && handlePNRSet(input)) {
// //                 setMessages(prev => [...prev, { 
// //                     sender: 'bot', 
// //                     text: `I'll remember your PNR: ${currentPNR} for future queries.`
// //                 }]);
// //                 setIsLoading(false);
// //                 setInput('');
// //                 return;
// //             }

// //             const flightSearchMatch = input.toLowerCase().match(/search flight from (.+?) to (.+?) on (\d{4}-\d{2}-\d{2})/i);
// //             const pnrMatch = input.match(/PNR\s+(\d+)/i);
// //             const flightStatusMatch = input.toLowerCase().includes('flight status') || 
// //                                     input.toLowerCase().includes('flight details') ||
// //                                     input.toLowerCase().includes('check flight');

// //             if (flightSearchMatch) {
// //                 const [, source, destination, journey_date] = flightSearchMatch.map(str => str.trim());
// //                 payload = { source, destination, journey_date, language };
// //                 endpoint = 'http://localhost:5001/api/search-flights';
// //             } 
// //             else if (input.toLowerCase().startsWith('book flight')) {
// //                 const airline = input.toLowerCase().replace('book flight', '').trim();
// //                 payload = { 
// //                     message: input, 
// //                     language,
// //                     action: 'BOOK',
// //                     airline 
// //                 };
// //             }
// //             else if (
// //                 input.toLowerCase().includes('baggage') || 
// //                 input.toLowerCase().includes('delay') || 
// //                 input.toLowerCase().includes('class') ||
// //                 pnrMatch
// //             ) {
// //                 const pnr = pnrMatch ? pnrMatch[1] : currentPNR;
                
// //                 if (!pnr) {
// //                     setMessages(prev => [...prev, { 
// //                         sender: 'bot', 
// //                         text: "Please provide your PNR number first. You can say something like 'My PNR is 12345'" 
// //                     }]);
// //                     setIsLoading(false);
// //                     setInput('');
// //                     return;
// //                 }

// //                 payload = { 
// //                     message: input, 
// //                     language,
// //                     user_id: 'user-' + Math.random().toString(36).substr(2, 9),
// //                     pnr,
// //                     query_type: 'pnr'
// //                 };
// //             }
// //             else if (flightStatusMatch) {
// //                 const flightNumberMatch = input.match(/(?:flight|flight number|flight no)\s*[:#]?\s*([A-Z0-9]+)/i);
// //                 payload = {
// //                     message: input,
// //                     language,
// //                     user_id: 'user-' + Math.random().toString(36).substr(2, 9),
// //                     query_type: 'flight_status',
// //                     flight_number: flightNumberMatch ? flightNumberMatch[1] : null
// //                 };
// //             }
// //             else {
// //                 payload = { 
// //                     message: input, 
// //                     language,
// //                     user_id: 'user-' + Math.random().toString(36).substr(2, 9)
// //                 };
// //             }

// //             const response = await axios.post(endpoint, payload);
// //             const botResponse = response.data;

// //             if (botResponse.flights?.length > 0) {
// //                 renderFlightResults(botResponse);
// //             } 
// //             else {
// //                 const messageText = botResponse.response || botResponse.message;
// //                 if (messageText.includes('PNR') || 
// //                     input.toLowerCase().includes('baggage') || 
// //                     input.toLowerCase().includes('delay') || 
// //                     input.toLowerCase().includes('class')) {
// //                     setMessages(prev => [...prev, renderPNRDetails(messageText)]);
// //                 } else {
// //                     setMessages(prev => [...prev, { sender: 'bot', text: messageText }]);
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error:', error);
// //             setMessages(prev => [
// //                 ...prev,
// //                 { 
// //                     sender: 'bot', 
// //                     text: error.message || "I'm having trouble understanding. Please try again." 
// //                 }
// //             ]);
// //         } finally {
// //             setIsLoading(false);
// //             setInput('');
// //         }
// //     };

// //     const handleKeyDown = (event) => {
// //         if (event.key === 'Enter' && !event.shiftKey) {
// //             event.preventDefault();
// //             handleSend();
// //         }
// //     };

// //     const renderMessage = (message, index) => (
// //         <div 
// //             key={index} 
// //             className={`chat-message ${message.sender} ${typeof message.text === 'string' ? 'text-message' : 'rich-content'}`}
// //         >
// //             {message.text}
// //         </div>
// //     );

// //     const renderSuggestions = () => (
// //         <div className="chat-suggestions">
// //             {quickActions.map((action, index) => (
// //                 <button key={index} onClick={() => setInput(action.action)}>
// //                     {action.icon} {action.text}
// //                 </button>
// //             ))}
// //         </div>
// //     );

// //     return (
// //         <>
// //             <button 
// //                 className="chat-button" 
// //                 onClick={() => setIsOpen(true)} 
// //                 style={{ display: isOpen ? 'none' : 'flex' }}
// //                 aria-label="Chat with Flight Assistant"
// //             >
// //                 <Plane size={24}/>
// //             </button>

// //             <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
// //                 <div className="chat-header">
// //                     <span className="header-title">
// //                         <Plane size={20} />
// //                         Flight Assistant
// //                     </span>
// //                     <button 
// //                         className="close-button" 
// //                         onClick={() => setIsOpen(false)}
// //                         aria-label="Close chat"
// //                     >
// //                         <X size={20} />
// //                     </button>
// //                 </div>

// //                 {currentPNR && renderPNRStatus()}

// //                 <div className="chat-language-selector">
// //                     <label htmlFor="language">Language:</label>
// //                     <select 
// //                         id="language" 
// //                         value={language} 
// //                         onChange={(e) => setLanguage(e.target.value)}
// //                     >
// //                         <option value="en">English</option>
// //                         <option value="es">Español</option>
// //                         <option value="fr">Français</option>
// //                         <option value="de">Deutsch</option>
// //                         <option value="zh-cn">中文</option>
// //                         <option value="hi">हिंदी</option>
// //                     </select>
// //                 </div>

// //                 <div className="quick-actions-container">
// //                     {renderSuggestions()}
// //                 </div>

// //                 <div className="chat-box" ref={chatBoxRef}>
// //                     {messages.length === 0 && (
// //                         <div className="welcome-message">
// //                             👋 Hi! I'm your flight assistant. How can I help you today?
// //                         </div>
// //                     )}
// //                     {messages.map(renderMessage)}
// //                     {isLoading && (
// //                         <div className="chat-message bot loading">
// //                             <Loader className="animate-spin" size={20} />
// //                             Processing your request...
// //                         </div>
// //                     )}
// //                 </div>

// //                 <div className="chat-input">
// //                     <input
// //                         ref={inputRef}
// //                         type="text"
// //                         value={input}
// //                         onChange={(e) => setInput(e.target.value)}
// //                         onKeyDown={handleKeyDown}
// //                         placeholder="Type your message or ask about flights..."
// //                         disabled={isLoading}
// //                     />
// //                     <button 
// //                         onClick={handleSend} 
// //                         disabled={isLoading || !input.trim()}
// //                         title={isLoading ? "Processing..." : "Send message"}
// //                         aria-label="Send message"
// //                     >
// //                         <Send size={20} />
// //                     </button>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // };

// // export default Chat;
// // import React, { useState, useRef, useEffect } from 'react';
// // import axios from 'axios';
// // import { X, Send, Loader, Calendar, Plane, Luggage, FileQuestion, Clock, User, Globe, Info } from 'lucide-react';
// // import './Chat.css';

// // const Chat = () => {
// //     const [messages, setMessages] = useState([]);
// //     const [input, setInput] = useState('');
// //     const [language, setLanguage] = useState('en');
// //     const [isOpen, setIsOpen] = useState(true);
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [currentPNR, setCurrentPNR] = useState(null);
// //     const [currentFlow, setCurrentFlow] = useState('initial');
// //     const [awaitingPNR, setAwaitingPNR] = useState(false);
// //     const chatBoxRef = useRef(null);
// //     const inputRef = useRef(null);

// //     useEffect(() => {
// //         if (chatBoxRef.current) {
// //             chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
// //         }
// //     }, [messages]);

// //     useEffect(() => {
// //         if (isOpen && inputRef.current) {
// //             inputRef.current.focus();
// //         }
// //     }, [isOpen]);

// //     const mainOptions = [
// //         {
// //             id: 'travel',
// //             icon: <Globe size={24} />,
// //             text: 'Travel Guide',
// //             description: 'Search flights and get travel assistance'
// //         },
// //         {
// //             id: 'booking',
// //             icon: <User size={24} />,
// //             text: 'My Booking',
// //             description: 'Access your booking details and services'
// //         }
// //     ];

// //     const bookingOptions = [
// //         {
// //             icon: <Luggage size={20} />,
// //             text: 'Baggage Details',
// //             action: 'baggage'
// //         },
// //         {
// //             icon: <Clock size={20} />,
// //             text: 'Check Delays',
// //             action: 'delay'
// //         },
// //         {
// //             icon: <Info size={20} />,
// //             text: 'Flight Class',
// //             action: 'class'
// //         }
// //     ];

// //     const parseFlightSearch = (input) => {
// //         const patterns = [
// //             // Pattern for "from [city] to [city] on [date]"
// //             /(?:search\s+)?(?:flight|flights)?\s*(?:from\s+)?([a-zA-Z\s]+)\s+(?:to\s+)?([a-zA-Z\s]+)\s+(?:on\s+)?([a-zA-Z0-9\s\-\.\/]+)/i,
// //             // Pattern for "[city] to [city] [date]"
// //             /([a-zA-Z\s]+)\s+to\s+([a-zA-Z\s]+)\s+([a-zA-Z0-9\s\-\.\/]+)/i
// //         ];

// //         for (let pattern of patterns) {
// //             const match = input.match(pattern);
// //             if (match) {
// //                 return {
// //                     source: match[1].trim(),
// //                     destination: match[2].trim(),
// //                     date: match[3].trim()
// //                 };
// //             }
// //         }
// //         return null;
// //     };

// //     const handleOptionSelect = async (optionId) => {
// //         setCurrentFlow(optionId);
// //         if (optionId === 'booking') {
// //             if (!currentPNR) {
// //                 setAwaitingPNR(true);
// //                 setMessages(prev => [...prev, {
// //                     sender: 'bot',
// //                     text: 'Please provide your PNR number to access your booking details.'
// //                 }]);
// //             } else {
// //                 await showBookingOptions();
// //             }
// //         } else if (optionId === 'travel') {
// //             setMessages(prev => [...prev, {
// //                 sender: 'bot',
// //                 text: 'I can help you search for flights. Please provide your travel details in this format: "search flight from [city] to [city] on [date]"'
// //             }]);
// //             showTravelOptions();
// //         }
// //     };

// //     const handleBookingQuery = async (queryType) => {
// //         if (!currentPNR) {
// //             setMessages(prev => [...prev, {
// //                 sender: 'bot',
// //                 text: "Please provide your PNR number first."
// //             }]);
// //             setAwaitingPNR(true);
// //             return;
// //         }

// //         let message = '';
// //         switch (queryType) {
// //             case 'baggage':
// //                 message = `Check baggage handling status for PNR ${currentPNR}`;
// //                 break;
// //             case 'delay':
// //                 message = `Show flight delays for PNR ${currentPNR}`;
// //                 break;
// //             case 'class':
// //                 message = `What is flight class for PNR ${currentPNR}`;
// //                 break;
// //             default:
// //                 return;
// //         }

// //         try {
// //             const response = await axios.post('http://localhost:5001/api/chat', {
// //                 message: message,
// //                 pnr: currentPNR,
// //                 query_type: 'pnr',
// //                 language
// //             });

// //             if (response.data.status === 'success') {
// //                 setMessages(prev => [...prev, renderPNRDetails(response.data.message)]);
// //             } else {
// //                 setMessages(prev => [...prev, {
// //                     sender: 'bot',
// //                     text: response.data.message || "Sorry, I couldn't retrieve that information."
// //                 }]);
// //             }
// //         } catch (error) {
// //             console.error('Error fetching booking details:', error);
// //             setMessages(prev => [...prev, {
// //                 sender: 'bot',
// //                 text: "Sorry, there was an error processing your request."
// //             }]);
// //         }
// //     };

// //     const showBookingOptions = () => {
// //         if (!currentPNR) {
// //             setMessages(prev => [...prev, {
// //                 sender: 'bot',
// //                 text: "Please provide your PNR number to view booking details."
// //             }]);
// //             setAwaitingPNR(true);
// //             return;
// //         }

// //         const optionsMessage = (
// //             <div className="booking-options">
// //                 <div className="options-title">What would you like to know about your booking?</div>
// //                 <div className="options-grid">
// //                     {bookingOptions.map((option, index) => (
// //                         <button
// //                             key={index}
// //                             className="option-button"
// //                             onClick={() => handleBookingQuery(option.action)}
// //                         >
// //                             {option.icon}
// //                             <span>{option.text}</span>
// //                         </button>
// //                     ))}
// //                 </div>
// //             </div>
// //         );
// //         setMessages(prev => [...prev, { sender: 'bot', text: optionsMessage }]);
// //     };

// //     const showTravelOptions = () => {
// //         const travelMessage = (
// //             <div className="travel-options">
// //                 <div className="options-grid">
// //                     <button
// //                         className="option-button"
// //                         onClick={() => setInput('search flight from Delhi to Mumbai on 2024-01-03')}
// //                     >
// //                         <Calendar size={20} />
// //                         <span>Search Flights</span>
// //                     </button>
// //                 </div>
// //             </div>
// //         );
// //         setMessages(prev => [...prev, { sender: 'bot', text: travelMessage }]);
// //     };

// //     const formatFlightData = (flight) => ({
// //         departure: flight.departure || flight.Dep_Time,
// //         duration: flight.duration || flight.Duration,
// //         stops: flight.stops || flight.Total_Stops,
// //         price: flight.price || flight.Price,
// //         airline: flight.airline || flight.Airline,
// //         additional_info: flight.additional_info || flight.Additional_Info
// //     });

// //     const renderFlightResults = (botResponse) => {
// //         const flightDetails = (
// //             <div className="flight-results">
// //                 <div className="flight-header">
// //                     <Plane size={20} />
// //                     <span>Available Flights</span>
// //                 </div>
// //                 <table className="flight-table">
// //                     <thead>
// //                         <tr>
// //                             <th>Airline</th>
// //                             <th>Departure</th>
// //                             <th>Duration</th>
// //                             <th>Stops</th>
// //                             <th>Price</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {botResponse.flights.map((flight, index) => {
// //                             const formattedFlight = formatFlightData(flight);
// //                             return (
// //                                 <tr key={index} className="flight-row">
// //                                     <td>{formattedFlight.airline}</td>
// //                                     <td>{formattedFlight.departure}</td>
// //                                     <td>{formattedFlight.duration}</td>
// //                                     <td>{formattedFlight.stops}</td>
// //                                     <td className="price">₹{formattedFlight.price}</td>
// //                                 </tr>
// //                             );
// //                         })}
// //                     </tbody>
// //                 </table>
// //                 <div className="booking-prompt">
// //                     Would you like to book any of these flights? 
// //                     Type "book flight [airline name]" to proceed.
// //                 </div>
// //             </div>
// //         );

// //         setMessages(prev => [
// //             ...prev,
// //             { sender: 'bot', text: botResponse.message },
// //             { sender: 'bot', text: flightDetails }
// //         ]);
// //     };

// //     const renderPNRDetails = (response) => {
// //         let content;
// //         if (response.includes("Baggage handling")) {
// //             content = (
// //                 <div className="pnr-details baggage">
// //                     <Luggage size={20} />
// //                     <div>{response}</div>
// //                 </div>
// //             );
// //         } else if (response.includes("delay")) {
// //             content = (
// //                 <div className="pnr-details delays">
// //                     <Clock size={20} />
// //                     <div>{response}</div>
// //                 </div>
// //             );
// //         } else if (response.includes("class")) {
// //             content = (
// //                 <div className="pnr-details class">
// //                     <Info size={20} />
// //                     <div>{response}</div>
// //                 </div>
// //             );
// //         } else {
// //             content = <div className="pnr-details">{response}</div>;
// //         }

// //         return { sender: 'bot', text: content };
// //     };

// //     const renderPNRStatus = () => {
// //         if (!currentPNR) return null;
// //         return (
// //             <div className="current-pnr-status">
// //                 <div className="pnr-badge">
// //                     <Plane size={16} />
// //                     PNR: {currentPNR}
// //                 </div>
// //                 <button 
// //                     onClick={() => {
// //                         setCurrentPNR(null);
// //                         setAwaitingPNR(false);
// //                     }}
// //                     className="clear-pnr-btn"
// //                     title="Clear PNR"
// //                 >
// //                     <X size={14} />
// //                     Clear
// //                 </button>
// //             </div>
// //         );
// //     };

// //     const handleSend = async () => {
// //         if (input.trim() === '') return;

// //         const userMessage = { sender: 'user', text: input };
// //         setMessages(prev => [...prev, userMessage]);
// //         setIsLoading(true);

// //         try {
// //             if (awaitingPNR) {
// //                 const pnrMatch = input.match(/^(\d{5,6})$/) || input.match(/PNR\s+(\d{5,6})/i);
                
// //                 if (pnrMatch) {
// //                     const newPNR = pnrMatch[1];
// //                     try {
// //                         const verifyResponse = await axios.post('http://localhost:5001/api/verify-pnr', {
// //                             pnr: newPNR
// //                         });
                        
// //                         if (verifyResponse.data.status === 'success') {
// //                             setCurrentPNR(newPNR);
// //                             setAwaitingPNR(false);
// //                             setMessages(prev => [...prev, { 
// //                                 sender: 'bot', 
// //                                 text: `Thank you. I'll remember your PNR: ${newPNR} for your queries.`
// //                             }]);
// //                             await showBookingOptions();
// //                         } else {
// //                             setMessages(prev => [...prev, { 
// //                                 sender: 'bot', 
// //                                 text: "I couldn't verify that PNR number. Please provide a valid PNR number."
// //                             }]);
// //                         }
// //                     } catch (error) {
// //                         setMessages(prev => [...prev, { 
// //                             sender: 'bot', 
// //                             text: "There was an error verifying your PNR. Please try again."
// //                         }]);
// //                     }
// //                     setIsLoading(false);
// //                     setInput('');
// //                     return;
// //                 } else {
// //                     setMessages(prev => [...prev, { 
// //                         sender: 'bot', 
// //                         text: "Please provide a valid PNR number (5-6 digits)"
// //                     }]);
// //                     setIsLoading(false);
// //                     setInput('');
// //                     return;
// //                 }
// //             }

// //             const searchDetails = parseFlightSearch(input);
// //             if (searchDetails) {
// //                 const { source, destination, date } = searchDetails;
// //                 try {
// //                     const response = await axios.post('http://localhost:5001/api/search-flights', {
// //                         source,
// //                         destination,
// //                         journey_date: date,
// //                         language
// //                     });
                    
// //                     if (response.data.status === 'success' && response.data.flights?.length > 0) {
// //                         renderFlightResults(response.data);
// //                     } else {
// //                         setMessages(prev => [...prev, {
// //                             sender: 'bot',
// //                             text: response.data.message || "No flights found for the specified criteria."
// //                         }]);
// //                     }
// //                 } catch (error) {
// //                     console.error('Error searching flights:', error);
// //                     setMessages(prev => [...prev, {
// //                         sender: 'bot',
// //                         text: "Sorry, there was an error searching for flights. Please try again."
// //                     }]);
// //                 }
// //             } else {
// //                 const response = await axios.post('http://localhost:5001/api/chat', {
// //                     message: input,
// //                     language,
// //                     user_id: 'user-' + Math.random().toString(36).substr(2, 9),
// //                     flow_type: currentFlow,
// //                     pnr: currentPNR
// //                 });

// //                 const botResponse = response.data;
// //                 const messageText = botResponse.response || botResponse.message;

// //                 if (messageText.includes('PNR') || 
// //                     input.toLowerCase().includes('baggage') || 
// //                     input.toLowerCase().includes('delay') || 
// //                     input.toLowerCase().includes('class')) {
// //                     setMessages(prev => [...prev, renderPNRDetails(messageText)]);
// //                 } else {
// //                     setMessages(prev => [...prev, { sender: 'bot', text: messageText }]);
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Error:', error);
// //             setMessages(prev => [
// //                 ...prev,
// //                 { 
// //                     sender: 'bot', 
// //                     text: error.message || "I'm having trouble understanding. Please try again." 
// //                 }
// //             ]);
// //         } finally {
// //             setIsLoading(false);
// //             setInput('');
// //         }
// //     };

// //     const handleKeyDown = (event) => {
// //         if (event.key === 'Enter' && !event.shiftKey) {
// //             event.preventDefault();
// //             handleSend();
// //         }
// //     };const renderMessage = (message, index) => (
// //         <div 
// //             key={index} 
// //             className={`chat-message ${message.sender} ${typeof message.text === 'string' ? 'text-message' : 'rich-content'}`}
// //         >
// //             {message.text}
// //         </div>
// //     );

// //     const renderWelcomeMessage = () => (
// //         <div className="welcome-container">
// //             <div className="welcome-message">
// //                 👋 Hi! Welcome to Flight Assistant! Please select an option below:
// //             </div>
// //             <div className="main-options">
// //                 {mainOptions.map((option) => (
// //                     <button
// //                         key={option.id}
// //                         className="main-option-button"
// //                         onClick={() => handleOptionSelect(option.id)}
// //                     >
// //                         {option.icon}
// //                         <div className="option-content">
// //                             <div className="option-title">{option.text}</div>
// //                             <div className="option-description">{option.description}</div>
// //                         </div>
// //                     </button>
// //                 ))}
// //             </div>
// //         </div>
// //     );

// //     return (
// //         <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
// //             <div className="chat-header">
// //                 <span className="header-title">
// //                     <Plane size={20} />
// //                     Flight Assistant
// //                 </span>
// //             </div>

// //             {currentPNR && renderPNRStatus()}

// //             <div className="chat-language-selector">
// //                 <label htmlFor="language">Language:</label>
// //                 <select 
// //                     id="language" 
// //                     value={language} 
// //                     onChange={(e) => setLanguage(e.target.value)}
// //                 >
// //                     <option value="en">English</option>
// //                     <option value="es">Español</option>
// //                     <option value="fr">Français</option>
// //                     <option value="de">Deutsch</option>
// //                     <option value="zh-cn">中文</option>
// //                     <option value="hi">हिंदी</option>
// //                 </select>
// //             </div>

// //             <div className="chat-box" ref={chatBoxRef}>
// //                 {messages.length === 0 ? renderWelcomeMessage() : (
// //                     <>
// //                         {messages.map(renderMessage)}
// //                         {isLoading && (
// //                             <div className="chat-message bot loading">
// //                                 <Loader className="animate-spin" size={20} />
// //                                 Processing your request...
// //                             </div>
// //                         )}
// //                     </>
// //                 )}
// //             </div>

// //             <div className="chat-input">
// //                 <input
// //                     ref={inputRef}
// //                     type="text"
// //                     value={input}
// //                     onChange={(e) => setInput(e.target.value)}
// //                     onKeyDown={handleKeyDown}
// //                     placeholder={awaitingPNR ? "Please enter your PNR number..." : "Type your message..."}
// //                     disabled={isLoading}
// //                 />
// //                 <button 
// //                     onClick={handleSend} 
// //                     disabled={isLoading || !input.trim()}
// //                     title={isLoading ? "Processing..." : "Send message"}
// //                     aria-label="Send message"
// //                 >
// //                     <Send size={20} />
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// // export default Chat;

// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import { X, Send, Loader, Calendar, Plane, Luggage, FileQuestion, Clock, User, Globe, Info } from 'lucide-react';
// import './Chat.css';

// const Chat = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');
//     const [language, setLanguage] = useState('en');
//     const [isOpen, setIsOpen] = useState(true);
//     const [isLoading, setIsLoading] = useState(false);
//     const [currentPNR, setCurrentPNR] = useState(null);
//     const [currentFlow, setCurrentFlow] = useState('initial');
//     const [awaitingPNR, setAwaitingPNR] = useState(false);
//     const chatBoxRef = useRef(null);
//     const inputRef = useRef(null);

//     useEffect(() => {
//         if (chatBoxRef.current) {
//             chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
//         }
//     }, [messages]);

//     useEffect(() => {
//         if (isOpen && inputRef.current) {
//             inputRef.current.focus();
//         }
//     }, [isOpen]);

//     const mainOptions = [
//         {
//             id: 'travel',
//             icon: <Globe size={24} />,
//             text: 'Travel Guide',
//             description: 'Search flights and get travel assistance'
//         },
//         {
//             id: 'booking',
//             icon: <User size={24} />,
//             text: 'My Booking',
//             description: 'Access your booking details and services'
//         }
//     ];

//     const bookingOptions = [
//         {
//             icon: <Luggage size={20} />,
//             text: 'Baggage Details',
//             action: 'baggage'
//         },
//         {
//             icon: <Clock size={20} />,
//             text: 'Check Delays',
//             action: 'delay'
//         },
//         {
//             icon: <Info size={20} />,
//             text: 'Flight Class',
//             action: 'class'
//         }
//     ];

//     const parseFlightSearch = (input) => {
//         const patterns = [
//             // Pattern for "from [city] to [city] on [date]"
//             /(?:search\s+)?(?:flight|flights)?\s*(?:from\s+)?([a-zA-Z\s]+)\s+(?:to\s+)?([a-zA-Z\s]+)\s+(?:on\s+)?([a-zA-Z0-9\s\-\.\/]+)/i,
//             // Pattern for "[city] to [city] [date]"
//             /([a-zA-Z\s]+)\s+to\s+([a-zA-Z\s]+)\s+([a-zA-Z0-9\s\-\.\/]+)/i
//         ];

//         for (let pattern of patterns) {
//             const match = input.match(pattern);
//             if (match) {
//                 return {
//                     source: match[1].trim(),
//                     destination: match[2].trim(),
//                     date: match[3].trim()
//                 };
//             }
//         }
//         return null;
//     };

//     const handleOptionSelect = async (optionId) => {
//         setCurrentFlow(optionId);
//         if (optionId === 'booking') {
//             if (!currentPNR) {
//                 setAwaitingPNR(true);
//                 setMessages(prev => [...prev, {
//                     sender: 'bot',
//                     text: 'Please provide your PNR number to access your booking details.'
//                 }]);
//             } else {
//                 await showBookingOptions();
//             }
//         } else if (optionId === 'travel') {
//             setMessages(prev => [...prev, {
//                 sender: 'bot',
//                 text: 'I can help you search for flights. Please provide your travel details in this format: "search flight from [city] to [city] on [date]"'
//             }]);
//             showTravelOptions();
//         }
//     };

//     const handleBookingQuery = async (queryType) => {
//         if (!currentPNR) {
//             setMessages(prev => [...prev, {
//                 sender: 'bot',
//                 text: "Please provide your PNR number first."
//             }]);
//             setAwaitingPNR(true);
//             return;
//         }

//         let message = '';
//         switch (queryType) {
//             case 'baggage':
//                 message = `Check baggage handling status for PNR ${currentPNR}`;
//                 break;
//             case 'delay':
//                 message = `Show flight delays for PNR ${currentPNR}`;
//                 break;
//             case 'class':
//                 message = `What is flight class for PNR ${currentPNR}`;
//                 break;
//             default:
//                 return;
//         }

//         try {
//             const response = await axios.post('http://localhost:5001/api/chat', {
//                 message: message,
//                 pnr: currentPNR,
//                 query_type: 'pnr',
//                 language
//             });

//             if (response.data.status === 'success') {
//                 setMessages(prev => [...prev, renderPNRDetails(response.data.message)]);
//             } else {
//                 setMessages(prev => [...prev, {
//                     sender: 'bot',
//                     text: response.data.message || "Sorry, I couldn't retrieve that information."
//                 }]);
//             }
//         } catch (error) {
//             console.error('Error fetching booking details:', error);
//             setMessages(prev => [...prev, {
//                 sender: 'bot',
//                 text: "Sorry, there was an error processing your request."
//             }]);
//         }
//     };

//     const showBookingOptions = () => {
//         if (!currentPNR) {
//             setMessages(prev => [...prev, {
//                 sender: 'bot',
//                 text: "Please provide your PNR number to view booking details."
//             }]);
//             setAwaitingPNR(true);
//             return;
//         }

//         const optionsMessage = (
//             <div className="booking-options">
//                 <div className="options-title">What would you like to know about your booking?</div>
//                 <div className="options-grid">
//                     {bookingOptions.map((option, index) => (
//                         <button
//                             key={index}
//                             className="option-button"
//                             onClick={() => handleBookingQuery(option.action)}
//                         >
//                             {option.icon}
//                             <span>{option.text}</span>
//                         </button>
//                     ))}
//                 </div>
//             </div>
//         );
//         setMessages(prev => [...prev, { sender: 'bot', text: optionsMessage }]);
//     };

//     const showTravelOptions = () => {
//         const travelMessage = (
//             <div className="travel-options">
//                 <div className="options-grid">
//                     <button
//                         className="option-button"
//                         onClick={() => setInput('search flight from Delhi to Mumbai on 2024-01-03')}
//                     >
//                         <Calendar size={20} />
//                         <span>Search Flights</span>
//                     </button>
//                 </div>
//             </div>
//         );
//         setMessages(prev => [...prev, { sender: 'bot', text: travelMessage }]);
//     };

//     const formatFlightData = (flight) => ({
//         departure: flight.departure || flight.Dep_Time,
//         duration: flight.duration || flight.Duration,
//         stops: flight.stops || flight.Total_Stops,
//         price: flight.price || flight.Price,
//         airline: flight.airline || flight.Airline,
//         additional_info: flight.additional_info || flight.Additional_Info
//     });

//     const renderFlightResults = (botResponse) => {
//         const flightDetails = (
//             <div className="flight-results">
//                 <div className="flight-header">
//                     <Plane size={20} />
//                     <span>Available Flights</span>
//                 </div>
//                 <table className="flight-table">
//                     <thead>
//                         <tr>
//                             <th>Airline</th>
//                             <th>Departure</th>
//                             <th>Duration</th>
//                             <th>Stops</th>
//                             <th>Price</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {botResponse.flights.map((flight, index) => {
//                             const formattedFlight = formatFlightData(flight);
//                             return (
//                                 <tr key={index} className="flight-row">
//                                     <td>{formattedFlight.airline}</td>
//                                     <td>{formattedFlight.departure}</td>
//                                     <td>{formattedFlight.duration}</td>
//                                     <td>{formattedFlight.stops}</td>
//                                     <td className="price">₹{formattedFlight.price}</td>
//                                 </tr>
//                             );
//                         })}
//                     </tbody>
//                 </table>
//                 <div className="booking-prompt">
//                     Would you like to book any of these flights? 
//                     Type "book flight [airline name]" to proceed.
//                 </div>
//             </div>
//         );

//         setMessages(prev => [
//             ...prev,
//             { sender: 'bot', text: botResponse.message },
//             { sender: 'bot', text: flightDetails }
//         ]);
//     };

//     const renderPNRDetails = (response) => {
//         let content;
//         if (response.includes("Baggage handling")) {
//             content = (
//                 <div className="pnr-details baggage">
//                     <Luggage size={20} />
//                     <div>{response}</div>
//                 </div>
//             );
//         } else if (response.includes("delay")) {
//             content = (
//                 <div className="pnr-details delays">
//                     <Clock size={20} />
//                     <div>{response}</div>
//                 </div>
//             );
//         } else if (response.includes("class")) {
//             content = (
//                 <div className="pnr-details class">
//                     <Info size={20} />
//                     <div>{response}</div>
//                 </div>
//             );
//         } else {
//             content = <div className="pnr-details">{response}</div>;
//         }

//         return { sender: 'bot', text: content };
//     };

//     const renderPNRStatus = () => {
//         if (!currentPNR) return null;
//         return (
//             <div className="current-pnr-status">
//                 <div className="pnr-badge">
//                     <Plane size={16} />
//                     PNR: {currentPNR}
//                 </div>
//                 <button 
//                     onClick={() => {
//                         setCurrentPNR(null);
//                         setAwaitingPNR(false);
//                     }}
//                     className="clear-pnr-btn"
//                     title="Clear PNR"
//                 >
//                     <X size={14} />
//                     Clear
//                 </button>
//             </div>
//         );
//     };

//     const handleSend = async () => {
//         if (input.trim() === '') return;

//         const userMessage = { sender: 'user', text: input };
//         setMessages(prev => [...prev, userMessage]);
//         setIsLoading(true);

//         try {
//             if (awaitingPNR) {
//                 const pnrMatch = input.match(/^(\d{5,6})$/) || input.match(/PNR\s+(\d{5,6})/i);
                
//                 if (pnrMatch) {
//                     const newPNR = pnrMatch[1];
//                     try {
//                         const verifyResponse = await axios.post('http://localhost:5001/api/verify-pnr', {
//                             pnr: newPNR
//                         });
                        
//                         if (verifyResponse.data.status === 'success') {
//                             setCurrentPNR(newPNR);
//                             setAwaitingPNR(false);
//                             setMessages(prev => [...prev, { 
//                                 sender: 'bot', 
//                                 text: `Thank you. I'll remember your PNR: ${newPNR} for your queries.`
//                             }]);
//                             await showBookingOptions();
//                         } else {
//                             setMessages(prev => [...prev, { 
//                                 sender: 'bot', 
//                                 text: "I couldn't verify that PNR number. Please provide a valid PNR number."
//                             }]);
//                         }
//                     } catch (error) {
//                         setMessages(prev => [...prev, { 
//                             sender: 'bot', 
//                             text: "There was an error verifying your PNR. Please try again."
//                         }]);
//                     }
//                     setIsLoading(false);
//                     setInput('');
//                     return;
//                 } else {
//                     setMessages(prev => [...prev, { 
//                         sender: 'bot', 
//                         text: "Please provide a valid PNR number (5-6 digits)"
//                     }]);
//                     setIsLoading(false);
//                     setInput('');
//                     return;
//                 }
//             }

//             const searchDetails = parseFlightSearch(input);
//             if (searchDetails) {
//                 const { source, destination, date } = searchDetails;
//                 try {
//                     const response = await axios.post('http://localhost:5001/api/search-flights', {
//                         source,
//                         destination,
//                         journey_date: date,
//                         language
//                     });
                    
//                     if (response.data.status === 'success' && response.data.flights?.length > 0) {
//                         renderFlightResults(response.data);
//                     } else {
//                         setMessages(prev => [...prev, {
//                             sender: 'bot',
//                             text: response.data.message || "No flights found for the specified criteria."
//                         }]);
//                     }
//                 } catch (error) {
//                     console.error('Error searching flights:', error);
//                     setMessages(prev => [...prev, {
//                         sender: 'bot',
//                         text: "Sorry, there was an error searching for flights. Please try again."
//                     }]);
//                 }
//             } else {
//                 const response = await axios.post('http://localhost:5001/api/chat', {
//                     message: input,
//                     language,
//                     user_id: 'user-' + Math.random().toString(36).substr(2, 9),
//                     flow_type: currentFlow,
//                     pnr: currentPNR
//                 });

//                 const botResponse = response.data;
//                 const messageText = botResponse.response || botResponse.message;

//                 if (messageText.includes('PNR') || 
//                     input.toLowerCase().includes('baggage') || 
//                     input.toLowerCase().includes('delay') || 
//                     input.toLowerCase().includes('class')) {
//                     setMessages(prev => [...prev, renderPNRDetails(messageText)]);
//                 } else {
//                     setMessages(prev => [...prev, { sender: 'bot', text: messageText }]);
//                 }
//             }
//         } catch (error) {
//             console.error('Error:', error);
//             setMessages(prev => [
//                 ...prev,
//                 { 
//                     sender: 'bot', 
//                     text: error.message || "I'm having trouble understanding. Please try again." 
//                 }
//             ]);
//         } finally {
//             setIsLoading(false);
//             setInput('');
//         }
//     };

//     const handleKeyDown = (event) => {
//         if (event.key === 'Enter' && !event.shiftKey) {
//             event.preventDefault();
//             handleSend();
//         }
//     };const renderMessage = (message, index) => (
//         <div 
//             key={index} 
//             className={`chat-message ${message.sender} ${typeof message.text === 'string' ? 'text-message' : 'rich-content'}`}
//         >
//             {message.text}
//         </div>
//     );

//     const renderWelcomeMessage = () => (
//         <div className="welcome-container">
//             <div className="welcome-message">
//                 👋 Hi! Welcome to Flight Assistant! Please select an option below:
//             </div>
//             <div className="main-options">
//                 {mainOptions.map((option) => (
//                     <button
//                         key={option.id}
//                         className="main-option-button"
//                         onClick={() => handleOptionSelect(option.id)}
//                     >
//                         {option.icon}
//                         <div className="option-content">
//                             <div className="option-title">{option.text}</div>
//                             <div className="option-description">{option.description}</div>
//                         </div>
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );

//     return (
//         <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
//             <div className="chat-header">
//                 <span className="header-title">
//                     <Plane size={20} />
//                     Flight Assistant
//                 </span>
//             </div>

//             {currentPNR && renderPNRStatus()}

//             <div className="chat-language-selector">
//                 <label htmlFor="language">Language:</label>
//                 <select 
//                     id="language" 
//                     value={language} 
//                     onChange={(e) => setLanguage(e.target.value)}
//                 >
//                     <option value="en">English</option>
//                     <option value="es">Español</option>
//                     <option value="fr">Français</option>
//                     <option value="de">Deutsch</option>
//                     <option value="zh-cn">中文</option>
//                     <option value="hi">हिंदी</option>
//                 </select>
//             </div>

//             <div className="chat-box" ref={chatBoxRef}>
//                 {messages.length === 0 ? renderWelcomeMessage() : (
//                     <>
//                         {messages.map(renderMessage)}
//                         {isLoading && (
//                             <div className="chat-message bot loading">
//                                 <Loader className="animate-spin" size={20} />
//                                 Processing your request...
//                             </div>
//                         )}
//                     </>
//                 )}
//             </div>

//             <div className="chat-input">
//                 <input
//                     ref={inputRef}
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     onKeyDown={handleKeyDown}
//                     placeholder={awaitingPNR ? "Please enter your PNR number..." : "Type your message..."}
//                     disabled={isLoading}
//                 />
//                 <button 
//                     onClick={handleSend} 
//                     disabled={isLoading || !input.trim()}
//                     title={isLoading ? "Processing..." : "Send message"}
//                     aria-label="Send message"
//                 >
//                     <Send size={20} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Chat;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Loader, Calendar, Plane, Luggage, FileQuestion, Clock, User, Globe } from 'lucide-react';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [language, setLanguage] = useState('en');
    const [isOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPNR, setCurrentPNR] = useState(null);
    const [currentFlow, setCurrentFlow] = useState('initial');
    const [awaitingPNR, setAwaitingPNR] = useState(false);
    const chatBoxRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const mainOptions = [
        {
            id: 'travel',
            icon: <Globe size={24} />,
            text: 'Travel Guide',
            description: 'Search flights and get travel assistance'
        },
        {
            id: 'booking',
            icon: <User size={24} />,
            text: 'My Booking',
            description: 'Access your booking details and services'
        }
    ];

    const bookingOptions = [
        {
            icon: <Luggage size={20} />,
            text: 'Baggage Details',
            action: 'baggage'
        },
        {
            icon: <Clock size={20} />,
            text: 'Check Delays',
            action: 'delay'
        },
        {
            icon: <FileQuestion size={20} />,
            text: 'Flight Class',
            action: 'class'
        }
    ];

    const handleBookingQuery = async (queryType) => {
        if (!currentPNR) {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: "Please provide your PNR number first."
            }]);
            setAwaitingPNR(true);
            return;
        }

        let message = '';
        switch (queryType) {
            case 'baggage':
                message = `Check baggage handling status for PNR ${currentPNR}`;
                break;
            case 'delay':
                message = `Show flight delays for PNR ${currentPNR}`;
                break;
            case 'class':
                message = `What is flight class for PNR ${currentPNR}`;
                break;
            default:
                return;
        }

        try {
            const response = await axios.post('http://localhost:5001/api/chat', {
                message: message,
                pnr: currentPNR,
                query_type: 'pnr',
                language
            });

            if (response.data.status === 'success') {
                setMessages(prev => [...prev, renderPNRDetails(response.data.message)]);
            } else {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: response.data.message || "Sorry, I couldn't retrieve that information."
                }]);
            }
        } catch (error) {
            console.error('Error fetching booking details:', error);
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: "Sorry, there was an error processing your request."
            }]);
        }
    };

    const handleOptionSelect = async (optionId) => {
        setCurrentFlow(optionId);
        if (optionId === 'booking') {
            if (!currentPNR) {
                setAwaitingPNR(true);
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: 'Please provide your PNR number to access your booking details.'
                }]);
            } else {
                await showBookingOptions();
            }
        } else if (optionId === 'travel') {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: 'I can help you search for flights and provide travel information. What would you like to know?'
            }]);
            showTravelOptions();
        }
    };

    const showBookingOptions = () => {
        if (!currentPNR) {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: "Please provide your PNR number to view booking details."
            }]);
            setAwaitingPNR(true);
            return;
        }

        const optionsMessage = (
            <div className="booking-options">
                <div className="options-title">What would you like to know about your booking?</div>
                <div className="options-grid">
                    {bookingOptions.map((option, index) => (
                        <button
                            key={index}
                            className="option-button"
                            onClick={() => handleBookingQuery(option.action)}
                        >
                            {option.icon}
                            <span>{option.text}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
        setMessages(prev => [...prev, { sender: 'bot', text: optionsMessage }]);
    };

    const showTravelOptions = () => {
        const travelMessage = (
            <div className="travel-options">
                <div className="options-grid">
                    <button
                        className="option-button"
                        onClick={() => setInput('search flight from Delhi to Mumbai on 2024-12-25')}
                    >
                        <Calendar size={20} />
                        <span>Search Flights</span>
                    </button>
                </div>
            </div>
        );
        setMessages(prev => [...prev, { sender: 'bot', text: travelMessage }]);
    };

    const formatFlightData = (flight) => ({
        departure: flight.departure || flight.Dep_Time,
        duration: flight.duration || flight.Duration,
        stops: flight.stops || flight.Total_Stops,
        price: flight.price || flight.Price,
        airline: flight.airline || flight.Airline,
        additional_info: flight.additional_info || flight.Additional_Info
    });

    const renderFlightResults = (botResponse) => {
        const flightDetails = (
            <div className="flight-results">
                <div className="flight-header">
                    <Plane size={20} />
                    <span>Available Flights</span>
                </div>
                <table className="flight-table">
                    <thead>
                        <tr>
                            <th>Airline</th>
                            <th>Departure</th>
                            <th>Duration</th>
                            <th>Stops</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {botResponse.flights.map((flight, index) => {
                            const formattedFlight = formatFlightData(flight);
                            return (
                                <tr key={index} className="flight-row">
                                    <td>{formattedFlight.airline}</td>
                                    <td>{formattedFlight.departure}</td>
                                    <td>{formattedFlight.duration}</td>
                                    <td>{formattedFlight.stops}</td>
                                    <td className="price">₹{formattedFlight.price}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                <div className="booking-prompt">
                    Would you like to book any of these flights? 
                    Type "book flight [airline name]" to proceed.
                </div>
            </div>
        );

        setMessages(prev => [
            ...prev,
            { sender: 'bot', text: botResponse.message },
            { sender: 'bot', text: flightDetails }
        ]);
    };

    const renderPNRDetails = (response) => {
        let content;
        if (response.includes("Baggage handling")) {
            content = (
                <div className="pnr-details baggage">
                    <Luggage size={20} />
                    <div>{response}</div>
                </div>
            );
        } else if (response.includes("delay")) {
            content = (
                <div className="pnr-details delays">
                    <Clock size={20} />
                    <div>{response}</div>
                </div>
            );
        } else if (response.includes("class")) {
            content = (
                <div className="pnr-details class">
                    <Plane size={20} />
                    <div>{response}</div>
                </div>
            );
        } else {
            content = <div className="pnr-details">{response}</div>;
        }

        return { sender: 'bot', text: content };
    };

    const renderPNRStatus = () => {
        if (!currentPNR) return null;
        return (
            <div className="current-pnr-status">
                Current PNR: {currentPNR}
                <button 
                    onClick={() => {
                        setCurrentPNR(null);
                        setAwaitingPNR(false);
                    }}
                    className="clear-pnr-btn"
                    title="Clear PNR"
                >
                    <X size={14} />
                </button>
            </div>
        );
    };

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            // Handle PNR setting if awaiting PNR
            if (awaitingPNR) {
                const pnrMatch = input.match(/^(\d{5,6})$/) || input.match(/PNR\s+(\d{5,6})/i);
                
                if (pnrMatch) {
                    const newPNR = pnrMatch[1];
                    try {
                        const verifyResponse = await axios.post('http://localhost:5001/api/verify-pnr', {
                            pnr: newPNR
                        });
                        
                        if (verifyResponse.data.status === 'success') {
                            setCurrentPNR(newPNR);
                            setAwaitingPNR(false);
                            setMessages(prev => [...prev, { 
                                sender: 'bot', 
                                text: `Thank you. I'll remember your PNR: ${newPNR} for your queries.`
                            }]);
                            await showBookingOptions();
                        } else {
                            setMessages(prev => [...prev, { 
                                sender: 'bot', 
                                text: "I couldn't verify that PNR number. Please provide a valid PNR number."
                            }]);
                        }
                    } catch (error) {
                        setMessages(prev => [...prev, { 
                            sender: 'bot', 
                            text: "There was an error verifying your PNR. Please try again."
                        }]);
                    }
                    setIsLoading(false);
                    setInput('');
                    return;
                } else {
                    setMessages(prev => [...prev, { 
                        sender: 'bot', 
                        text: "Please provide a valid PNR number (5-6 digits)"
                    }]);
                    setIsLoading(false);
                    setInput('');
                    return;
                }
            }

            let payload;
            let endpoint = 'http://localhost:5001/api/chat';

            const flightSearchMatch = input.toLowerCase().match(/search flight from (.+?) to (.+?) on (\d{4}-\d{2}-\d{2})/i);

            if (flightSearchMatch) {
                const [, source, destination, journey_date] = flightSearchMatch.map(str => str.trim());
                payload = { source, destination, journey_date, language };
                endpoint = 'http://localhost:5001/api/search-flights';
            } 
            else if (input.toLowerCase().includes('baggage') || 
                     input.toLowerCase().includes('delay') || 
                     input.toLowerCase().includes('class')) {
                
                if (!currentPNR) {
                    setMessages(prev => [...prev, {
                        sender: 'bot',
                        text: "Please provide your PNR number first. You can say something like 'My PNR is 12345'"
                    }]);
                    setAwaitingPNR(true);
                    setIsLoading(false);
                    setInput('');
                    return;
                }

                payload = {
                    message: input,
                    language,
                    user_id: 'user-' + Math.random().toString(36).substr(2, 9),
                    pnr: currentPNR,
                    query_type: 'pnr'
                };
            }
            else {
                payload = { 
                    message: input, 
                    language,
                    user_id: 'user-' + Math.random().toString(36).substr(2, 9),
                    flow_type: currentFlow
                };
            }

            const response = await axios.post(endpoint, payload);
            const botResponse = response.data;

            if (botResponse.flights?.length > 0) {
                renderFlightResults(botResponse);
            } 
            else {
                const messageText = botResponse.response || botResponse.message;
                if (messageText.includes('PNR') || 
                    input.toLowerCase().includes('baggage') || 
                    input.toLowerCase().includes('delay') || 
                    input.toLowerCase().includes('class')) {
                    setMessages(prev => [...prev, renderPNRDetails(messageText)]);
                } else {
                    setMessages(prev => [...prev, { sender: 'bot', text: messageText }]);
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [
                ...prev,
                { 
                    sender: 'bot', 
                    text: error.message || "I'm having trouble understanding. Please try again." 
                }
            ]);
        } finally {
            setIsLoading(false);
            setInput('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const renderMessage = (message, index) => (
        <div 
            key={index} 
            className={`chat-message ${message.sender} ${typeof message.text === 'string' ? 'text-message' : 'rich-content'}`}
        >
            {message.text}
        </div>
    );

    const renderWelcomeMessage = () => (
        <div className="welcome-container">
            <div className="welcome-message">
                👋 Hi! Welcome to Flight Assistant! Please select an option below:
            </div>
            <div className="main-options">
                {mainOptions.map((option) => (
                    <button
                    key={option.id}
                    className="main-option-button"
                    onClick={() => handleOptionSelect(option.id)}
                >
                    {option.icon}
                    <div className="option-content">
                        <div className="option-title">{option.text}</div>
                        <div className="option-description">{option.description}</div>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

return (
    <div className={`chat-container ${isOpen ? 'open' : 'closed'}`}>
        <div className="chat-header">
            <span className="header-title">
                <Plane size={20} />
                Flight Assistant
            </span>
        </div>

        {currentPNR && renderPNRStatus()}

        <div className="chat-language-selector">
            <label htmlFor="language">Language:</label>
            <select 
                id="language" 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="zh-cn">中文</option>
                <option value="hi">हिंदी</option>
            </select>
        </div>

        <div className="chat-box" ref={chatBoxRef}>
            {messages.length === 0 ? renderWelcomeMessage() : (
                <>
                    {messages.map(renderMessage)}
                    {isLoading && (
                        <div className="chat-message bot loading">
                            <Loader className="animate-spin" size={20} />
                            Processing your request...
                        </div>
                    )}
                </>
            )}
        </div>

        <div className="chat-input">
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={awaitingPNR ? "Please enter your PNR number..." : "Type your message..."}
                disabled={isLoading}
            />
            <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                title={isLoading ? "Processing..." : "Send message"}
                aria-label="Send message"
            >
                <Send size={20} />
            </button>
        </div>
    </div>
);
};

export default Chat;