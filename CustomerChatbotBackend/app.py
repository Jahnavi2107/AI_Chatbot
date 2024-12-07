# # # # # from flask import Flask, request, jsonify
# # # # # from flask_cors import CORS
# # # # # import mysql.connector
# # # # # from google.cloud import dialogflow_v2 as dialogflow
# # # # # from google.cloud.dialogflow_v2.types import TextInput, QueryInput
# # # # # from googletrans import Translator
# # # # # from datetime import datetime
# # # # # import logging
# # # # # import os
# # # # # from typing import Optional, Dict, Any

# # # # # # Configure logging
# # # # # logging.basicConfig(
# # # # #     level=logging.INFO,
# # # # #     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# # # # # )
# # # # # logger = logging.getLogger(__name__)

# # # # # # Initialize Flask and services
# # # # # app = Flask(__name__)
# # # # # CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
# # # # # translator = Translator()

# # # # # # Configuration
# # # # # DATABASE = {
# # # # #     'host': 'localhost',
# # # # #     'user': 'root',
# # # # #     'password': 'Janu@2107',
# # # # #     'database': 'flightdata',
# # # # #     'port': 3306
# # # # # }

# # # # # # Set Google Application Credentials for Dialogflow
# # # # # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/jahnaviburla/Downloads/272-Project/dialogflow_service_key.json"

# # # # # def get_db_connection():
# # # # #     """Create and return a database connection."""
# # # # #     try:
# # # # #         connection = mysql.connector.connect(**DATABASE)
# # # # #         logger.info("Database connection established successfully.")
# # # # #         return connection
# # # # #     except mysql.connector.Error as err:
# # # # #         logger.error(f"Database connection error: {err}")
# # # # #         return None

# # # # # def format_date(date_str: str) -> Optional[str]:
# # # # #     """Format date string to MySQL compatible format."""
# # # # #     try:
# # # # #         date_obj = datetime.strptime(date_str, '%Y-%m-%d')
# # # # #         return date_obj.strftime('%Y-%m-%d')
# # # # #     except ValueError as e:
# # # # #         logger.error(f"Date formatting error: {e}")
# # # # #         return None

# # # # # def detect_intent_texts(project_id: str, session_id: str, text: str, language_code: str = "en-US"):
# # # # #     """Detect intent using Dialogflow."""
# # # # #     try:
# # # # #         session_client = dialogflow.SessionsClient()
# # # # #         session = session_client.session_path(project_id, session_id)
# # # # #         text_input = TextInput(text=text, language_code=language_code)
# # # # #         query_input = QueryInput(text=text_input)
# # # # #         response = session_client.detect_intent(session=session, query_input=query_input)
# # # # #         return response.query_result
# # # # #     except Exception as e:
# # # # #         logger.error(f"Dialogflow error: {str(e)}")
# # # # #         return None

# # # # # def format_flight_data(flight: Dict[str, Any]) -> Dict[str, Any]:
# # # # #     """Format flight data for response."""
# # # # #     try:
# # # # #         return {
# # # # #             "airline": flight["Airline"],
# # # # #             "date": flight["Date_of_Journey"].strftime("%Y-%m-%d") if isinstance(flight["Date_of_Journey"], datetime) else flight["Date_of_Journey"],
# # # # #             "source": flight["Source"],
# # # # #             "destination": flight["Destination"],
# # # # #             "departure": flight["Dep_Time"].strftime("%H:%M") if hasattr(flight["Dep_Time"], "strftime") else flight["Dep_Time"],
# # # # #             "duration": flight["Duration"],
# # # # #             "stops": flight["Total_Stops"],
# # # # #             "additional_info": flight["Additional_Info"],
# # # # #             "price": float(flight["Price"]) if flight["Price"] else 0
# # # # #         }
# # # # #     except Exception as e:
# # # # #         logger.error(f"Error formatting flight data: {e}")
# # # # #         return flight

# # # # # @app.route("/api/chat", methods=["POST"])
# # # # # def chat():
# # # # #     """Handle chat requests."""
# # # # #     data = request.json
# # # # #     user_message = data.get("message", "").strip()
# # # # #     target_language = data.get("language", "en")
# # # # #     user_id = data.get("user_id", "default")

# # # # #     if not user_message:
# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "response": "Please provide a message."
# # # # #         }), 400

# # # # #     try:
# # # # #         # Translate user message to English
# # # # #         translated_message = translator.translate(user_message, dest="en").text

# # # # #         # Handle flight search requests
# # # # #         if "search flight" in user_message.lower():
# # # # #             return handle_flight_search(data)

# # # # #         # Handle general queries via Dialogflow
# # # # #         dialogflow_response = detect_intent_texts("customerchatb", user_id, translated_message)
# # # # #         if dialogflow_response and dialogflow_response.fulfillment_text:
# # # # #             translated_response = translator.translate(
# # # # #                 dialogflow_response.fulfillment_text,
# # # # #                 dest=target_language
# # # # #             ).text
# # # # #             return jsonify({"status": "success", "response": translated_response})

# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "response": translator.translate(
# # # # #                 "I couldn't understand your request. Please try again.",
# # # # #                 dest=target_language
# # # # #             ).text
# # # # #         })

# # # # #     except Exception as e:
# # # # #         logger.error(f"Error in chat endpoint: {e}")
# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "response": "An unexpected error occurred. Please try again later."
# # # # #         }), 500

# # # # # @app.route("/api/search-flights", methods=["POST"])
# # # # # def handle_flight_search():
# # # # #     """Handle flight search requests."""
# # # # #     data = request.json
# # # # #     source = data.get("source", "").strip()
# # # # #     destination = data.get("destination", "").strip()
# # # # #     journey_date = data.get("journey_date", "").strip()

# # # # #     if not all([source, destination, journey_date]):
# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "message": "Please provide source, destination, and journey date."
# # # # #         }), 400

# # # # #     formatted_date = format_date(journey_date)
# # # # #     if not formatted_date:
# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "message": "Invalid date format. Please use YYYY-MM-DD."
# # # # #         }), 400

# # # # #     db_connection = get_db_connection()
# # # # #     if not db_connection:
# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "message": "Database connection failed. Please try again later."
# # # # #         }), 500

# # # # #     try:
# # # # #         cursor = db_connection.cursor(dictionary=True)
# # # # #         query = """
# # # # #             SELECT 
# # # # #                 Airline,
# # # # #                 DATE_FORMAT(Date_of_Journey, '%Y-%m-%d') as Date_of_Journey,
# # # # #                 Source,
# # # # #                 Destination,
# # # # #                 TIME_FORMAT(Dep_Time, '%H:%i') as Dep_Time,
# # # # #                 Duration,
# # # # #                 Total_Stops,
# # # # #                 Additional_Info,
# # # # #                 Price
# # # # #             FROM flights
# # # # #             WHERE Source = %s 
# # # # #             AND Destination = %s 
# # # # #             AND Date_of_Journey = %s
# # # # #             ORDER BY Price ASC
# # # # #             LIMIT 5
# # # # #         """
# # # # #         cursor.execute(query, (source, destination, formatted_date))
# # # # #         flights = cursor.fetchall()

# # # # #         if not flights:
# # # # #             return jsonify({
# # # # #                 "status": "success",
# # # # #                 "message": f"No flights found from {source} to {destination} on {journey_date}."
# # # # #             })

# # # # #         formatted_flights = [format_flight_data(flight) for flight in flights]

# # # # #         return jsonify({
# # # # #             "status": "success",
# # # # #             "flights": formatted_flights,
# # # # #             "message": f"Found {len(flights)} flights from {source} to {destination} on {journey_date}"
# # # # #         })

# # # # #     except Exception as e:
# # # # #         logger.error(f"Error processing flight search: {e}")
# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "message": "An error occurred while processing your request."
# # # # #         }), 500

# # # # #     finally:
# # # # #         if cursor:
# # # # #             cursor.close()
# # # # #         if db_connection:
# # # # #             db_connection.close()

# # # # # @app.route("/api/available-routes", methods=["GET"])
# # # # # def get_available_routes():
# # # # #     """Get all available routes."""
# # # # #     db_connection = get_db_connection()
# # # # #     if not db_connection:
# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "message": "Database connection failed"
# # # # #         }), 500

# # # # #     try:
# # # # #         cursor = db_connection.cursor(dictionary=True)
# # # # #         query = """
# # # # #             SELECT DISTINCT Source, Destination 
# # # # #             FROM flights 
# # # # #             ORDER BY Source, Destination
# # # # #         """
# # # # #         cursor.execute(query)
# # # # #         routes = cursor.fetchall()

# # # # #         return jsonify({
# # # # #             "status": "success",
# # # # #             "routes": routes
# # # # #         })

# # # # #     except Exception as e:
# # # # #         logger.error(f"Error fetching routes: {e}")
# # # # #         return jsonify({
# # # # #             "status": "error",
# # # # #             "message": "Error fetching available routes"
# # # # #         }), 500

# # # # #     finally:
# # # # #         if cursor:
# # # # #             cursor.close()
# # # # #         if db_connection:
# # # # #             db_connection.close()

# # # # # if __name__ == "__main__":
# # # # #     app.run(host="0.0.0.0", port=5001, debug=True)
# # # # from flask import Flask, request, jsonify
# # # # from flask_cors import CORS
# # # # import mysql.connector
# # # # from google.cloud import dialogflow_v2 as dialogflow
# # # # from google.cloud.dialogflow_v2.types import TextInput, QueryInput
# # # # from googletrans import Translator
# # # # from datetime import datetime
# # # # import logging
# # # # import os
# # # # from typing import Optional, Dict, Any

# # # # # Configure logging
# # # # logging.basicConfig(
# # # #     level=logging.INFO,
# # # #     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# # # # )
# # # # logger = logging.getLogger(__name__)

# # # # # Initialize Flask and services
# # # # app = Flask(__name__)
# # # # CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
# # # # translator = Translator()

# # # # # Configuration
# # # # DATABASE = {
# # # #     'host': 'localhost',
# # # #     'user': 'root',
# # # #     'password': 'Janu@2107',
# # # #     'database': 'flightdata',
# # # #     'port': 3306
# # # # }

# # # # # Set Google Application Credentials for Dialogflow
# # # # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/jahnaviburla/Downloads/272-Project/dialogflow_service_key.json"

# # # # def get_db_connection():
# # # #     """Create and return a database connection."""
# # # #     try:
# # # #         connection = mysql.connector.connect(**DATABASE)
# # # #         logger.info("Database connection established successfully.")
# # # #         return connection
# # # #     except mysql.connector.Error as err:
# # # #         logger.error(f"Database connection error: {err}")
# # # #         return None

# # # # def format_date(date_str: str) -> Optional[str]:
# # # #     """Format date string to MySQL compatible format."""
# # # #     try:
# # # #         date_obj = datetime.strptime(date_str, '%Y-%m-%d')
# # # #         return date_obj.strftime('%Y-%m-%d')
# # # #     except ValueError as e:
# # # #         logger.error(f"Date formatting error: {e}")
# # # #         return None

# # # # def detect_intent_texts(project_id: str, session_id: str, text: str, language_code: str = "en-US"):
# # # #     """Detect intent using Dialogflow."""
# # # #     try:
# # # #         session_client = dialogflow.SessionsClient()
# # # #         session = session_client.session_path(project_id, session_id)
# # # #         text_input = TextInput(text=text, language_code=language_code)
# # # #         query_input = QueryInput(text=text_input)
# # # #         response = session_client.detect_intent(session=session, query_input=query_input)
# # # #         return response.query_result
# # # #     except Exception as e:
# # # #         logger.error(f"Dialogflow error: {str(e)}")
# # # #         return None

# # # # def format_flight_data(flight: Dict[str, Any]) -> Dict[str, Any]:
# # # #     """Format flight data for response."""
# # # #     try:
# # # #         return {
# # # #             "airline": flight["Airline"],
# # # #             "date": flight["Date_of_Journey"].strftime("%Y-%m-%d") if isinstance(flight["Date_of_Journey"], datetime) else flight["Date_of_Journey"],
# # # #             "source": flight["Source"],
# # # #             "destination": flight["Destination"],
# # # #             "departure": flight["Dep_Time"].strftime("%H:%M") if hasattr(flight["Dep_Time"], "strftime") else flight["Dep_Time"],
# # # #             "duration": flight["Duration"],
# # # #             "stops": flight["Total_Stops"],
# # # #             "additional_info": flight["Additional_Info"],
# # # #             "price": float(flight["Price"]) if flight["Price"] else 0
# # # #         }
# # # #     except Exception as e:
# # # #         logger.error(f"Error formatting flight data: {e}")
# # # #         return flight

# # # # def handle_pnr_query(user_message: str, pnr: str = None) -> dict:
# # # #     """Handle PNR-related queries."""
# # # #     query_type = None
    
# # # #     if "baggage" in user_message.lower():
# # # #         query_type = "baggage"
# # # #     elif "class" in user_message.lower():
# # # #         query_type = "class"
# # # #     elif "delay" in user_message.lower():
# # # #         query_type = "delays"

# # # #     if not pnr:
# # # #         # Extract PNR from message
# # # #         words = user_message.split()
# # # #         for word in words:
# # # #             if word.isdigit():
# # # #                 pnr = word
# # # #                 break
    
# # # #     if not pnr:
# # # #         return {
# # # #             "status": "error",
# # # #             "message": "Please provide a valid PNR number."
# # # #         }

# # # #     # Use the get_pnr_details function but call it directly
# # # #     db_connection = get_db_connection()
# # # #     if not db_connection:
# # # #         return {
# # # #             "status": "error",
# # # #             "message": "Database connection failed"
# # # #         }

# # # #     try:
# # # #         cursor = db_connection.cursor(dictionary=True)
        
# # # #         if query_type == "baggage":
# # # #             query = """
# # # #                 SELECT id as pnr, baggage_handling 
# # # #                 FROM pnr 
# # # #                 WHERE id = %s
# # # #             """
# # # #         elif query_type == "class":
# # # #             query = """
# # # #                 SELECT id as pnr, class 
# # # #                 FROM pnr 
# # # #                 WHERE id = %s
# # # #             """
# # # #         elif query_type == "delays":
# # # #             query = """
# # # #                 SELECT id as pnr, 
# # # #                        departure_delay_in_minutes,
# # # #                        arrival_delay_in_minutes
# # # #                 FROM pnr 
# # # #                 WHERE id = %s
# # # #             """
# # # #         else:
# # # #             query = """
# # # #                 SELECT id as pnr,
# # # #                        baggage_handling,
# # # #                        class,
# # # #                        departure_delay_in_minutes,
# # # #                        arrival_delay_in_minutes
# # # #                 FROM pnr 
# # # #                 WHERE id = %s
# # # #             """

# # # #         cursor.execute(query, (pnr,))
# # # #         result = cursor.fetchone()

# # # #         if not result:
# # # #             return {
# # # #                 "status": "error",
# # # #                 "message": f"No records found for PNR: {pnr}"
# # # #             }

# # # #         # Format response based on query type
# # # #         if query_type == "baggage":
# # # #             message = f"Baggage handling rating for PNR {pnr}: {result['baggage_handling']}/5"
# # # #         elif query_type == "class":
# # # #             message = f"Travel class for PNR {pnr}: {result['class']}"
# # # #         elif query_type == "delays":
# # # #             message = (
# # # #                 f"Flight delays for PNR {pnr}:\n"
# # # #                 f"Departure delay: {result['departure_delay_in_minutes']} minutes\n"
# # # #                 f"Arrival delay: {result['arrival_delay_in_minutes']} minutes"
# # # #             )
# # # #         else:
# # # #             message = (
# # # #                 f"Details for PNR {pnr}:\n"
# # # #                 f"Class: {result['class']}\n"
# # # #                 f"Baggage Handling Rating: {result['baggage_handling']}/5\n"
# # # #                 f"Departure Delay: {result['departure_delay_in_minutes']} minutes\n"
# # # #                 f"Arrival Delay: {result['arrival_delay_in_minutes']} minutes"
# # # #             )

# # # #         return {
# # # #             "status": "success",
# # # #             "message": message
# # # #         }

# # # #     except Exception as e:
# # # #         logger.error(f"Error fetching PNR details: {e}")
# # # #         return {
# # # #             "status": "error",
# # # #             "message": "An error occurred while processing your request."
# # # #         }

# # # #     finally:
# # # #         if cursor:
# # # #             cursor.close()
# # # #         if db_connection:
# # # #             db_connection.close()

# # # # @app.route("/api/chat", methods=["POST"])
# # # # def chat():
# # # #     """Handle chat requests."""
# # # #     data = request.json
# # # #     user_message = data.get("message", "").strip()
# # # #     target_language = data.get("language", "en")
# # # #     user_id = data.get("user_id", "default")
# # # #     pnr = data.get("pnr", None)

# # # #     if not user_message:
# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "response": "Please provide a message."
# # # #         }), 400

# # # #     try:
# # # #         # Check if it's a PNR-related query
# # # #         pnr_keywords = ["pnr", "baggage", "class", "delay", "flight status"]
# # # #         if any(keyword in user_message.lower() for keyword in pnr_keywords):
# # # #             response = handle_pnr_query(user_message, pnr)
# # # #             if response["status"] == "success":
# # # #                 return jsonify({
# # # #                     "status": "success",
# # # #                     "response": response["message"]
# # # #                 })

# # # #         # Translate user message to English
# # # #         translated_message = translator.translate(user_message, dest="en").text

# # # #         # Handle flight search requests
# # # #         if "search flight" in user_message.lower():
# # # #             return handle_flight_search(data)

# # # #         # Handle general queries via Dialogflow
# # # #         dialogflow_response = detect_intent_texts("customerchatb", user_id, translated_message)
# # # #         if dialogflow_response and dialogflow_response.fulfillment_text:
# # # #             translated_response = translator.translate(
# # # #                 dialogflow_response.fulfillment_text,
# # # #                 dest=target_language
# # # #             ).text
# # # #             return jsonify({"status": "success", "response": translated_response})

# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "response": translator.translate(
# # # #                 "I couldn't understand your request. Please try again.",
# # # #                 dest=target_language
# # # #             ).text
# # # #         })

# # # #     except Exception as e:
# # # #         logger.error(f"Error in chat endpoint: {e}")
# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "response": "An unexpected error occurred. Please try again later."
# # # #         }), 500

# # # # @app.route("/api/search-flights", methods=["POST"])
# # # # def handle_flight_search():
# # # #     """Handle flight search requests."""
# # # #     data = request.json
# # # #     source = data.get("source", "").strip()
# # # #     destination = data.get("destination", "").strip()
# # # #     journey_date = data.get("journey_date", "").strip()

# # # #     if not all([source, destination, journey_date]):
# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "message": "Please provide source, destination, and journey date."
# # # #         }), 400

# # # #     formatted_date = format_date(journey_date)
# # # #     if not formatted_date:
# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "message": "Invalid date format. Please use YYYY-MM-DD."
# # # #         }), 400

# # # #     db_connection = get_db_connection()
# # # #     if not db_connection:
# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "message": "Database connection failed. Please try again later."
# # # #         }), 500

# # # #     try:
# # # #         cursor = db_connection.cursor(dictionary=True)
# # # #         query = """
# # # #             SELECT 
# # # #                 Airline,
# # # #                 DATE_FORMAT(Date_of_Journey, '%Y-%m-%d') as Date_of_Journey,
# # # #                 Source,
# # # #                 Destination,
# # # #                 TIME_FORMAT(Dep_Time, '%H:%i') as Dep_Time,
# # # #                 Duration,
# # # #                 Total_Stops,
# # # #                 Additional_Info,
# # # #                 Price
# # # #             FROM flights
# # # #             WHERE Source = %s 
# # # #             AND Destination = %s 
# # # #             AND Date_of_Journey = %s
# # # #             ORDER BY Price ASC
# # # #             LIMIT 5
# # # #         """
# # # #         cursor.execute(query, (source, destination, formatted_date))
# # # #         flights = cursor.fetchall()

# # # #         if not flights:
# # # #             return jsonify({
# # # #                 "status": "success",
# # # #                 "message": f"No flights found from {source} to {destination} on {journey_date}."
# # # #             })

# # # #         formatted_flights = [format_flight_data(flight) for flight in flights]

# # # #         return jsonify({
# # # #             "status": "success",
# # # #             "flights": formatted_flights,
# # # #             "message": f"Found {len(flights)} flights from {source} to {destination} on {journey_date}"
# # # #         })

# # # #     except Exception as e:
# # # #         logger.error(f"Error processing flight search: {e}")
# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "message": "An error occurred while processing your request."
# # # #         }), 500

# # # #     finally:
# # # #         if cursor:
# # # #             cursor.close()
# # # #         if db_connection:
# # # #             db_connection.close()

# # # # @app.route("/api/available-routes", methods=["GET"])
# # # # def get_available_routes():
# # # #     """Get all available routes."""
# # # #     db_connection = get_db_connection()
# # # #     if not db_connection:
# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "message": "Database connection failed"
# # # #         }), 500

# # # #     try:
# # # #         cursor = db_connection.cursor(dictionary=True)
# # # #         query = """
# # # #             SELECT DISTINCT Source, Destination 
# # # #             FROM flights 
# # # #             ORDER BY Source, Destination
# # # #         """
# # # #         cursor.execute(query)
# # # #         routes = cursor.fetchall()

# # # #         return jsonify({
# # # #             "status": "success",
# # # #             "routes": routes
# # # #         })

# # # #     except Exception as e:
# # # #         logger.error(f"Error fetching routes: {e}")
# # # #         return jsonify({
# # # #             "status": "error",
# # # #             "message": "Error fetching available routes"
# # # #         }), 500

# # # #     finally:
# # # #         if cursor:
# # # #             cursor.close()
# # # #         if db_connection:
# # # #             db_connection.close()

# # # # if __name__ == "__main__":
# # # #     app.run(host="0.0.0.0", port=5001, debug=True)
# # # from flask import Flask, request, jsonify
# # # from flask_cors import CORS
# # # import mysql.connector
# # # from google.cloud import dialogflow_v2 as dialogflow
# # # from google.cloud.dialogflow_v2.types import TextInput, QueryInput
# # # from googletrans import Translator
# # # from datetime import datetime
# # # import logging
# # # import os
# # # from typing import Optional, Dict, Any

# # # # Configure logging
# # # logging.basicConfig(
# # #     level=logging.INFO,
# # #     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# # # )
# # # logger = logging.getLogger(__name__)

# # # # Initialize Flask and services
# # # app = Flask(__name__)
# # # CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
# # # translator = Translator()

# # # # Configuration
# # # DATABASE = {
# # #     'host': 'localhost',
# # #     'user': 'root',
# # #     'password': 'Janu@2107',
# # #     'database': 'flightdata',
# # #     'port': 3306
# # # }

# # # # Set Google Application Credentials for Dialogflow
# # # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/jahnaviburla/Downloads/272-Project/dialogflow_service_key.json"

# # # def get_db_connection():
# # #     """Create and return a database connection."""
# # #     try:
# # #         connection = mysql.connector.connect(**DATABASE)
# # #         logger.info("Database connection established successfully.")
# # #         return connection
# # #     except mysql.connector.Error as err:
# # #         logger.error(f"Database connection error: {err}")
# # #         return None

# # # def format_date(date_str: str) -> Optional[str]:
# # #     """Format date string to MySQL compatible format."""
# # #     try:
# # #         date_obj = datetime.strptime(date_str, '%Y-%m-%d')
# # #         return date_obj.strftime('%Y-%m-%d')
# # #     except ValueError as e:
# # #         logger.error(f"Date formatting error: {e}")
# # #         return None

# # # def detect_intent_texts(project_id: str, session_id: str, text: str, language_code: str = "en-US"):
# # #     """Detect intent using Dialogflow."""
# # #     try:
# # #         session_client = dialogflow.SessionsClient()
# # #         session = session_client.session_path(project_id, session_id)
# # #         text_input = TextInput(text=text, language_code=language_code)
# # #         query_input = QueryInput(text=text_input)
# # #         response = session_client.detect_intent(session=session, query_input=query_input)
# # #         return response.query_result
# # #     except Exception as e:
# # #         logger.error(f"Dialogflow error: {str(e)}")
# # #         return None

# # # def handle_pnr_query(user_message: str, pnr: str) -> Dict:
# # #     """Handle PNR-related queries."""
# # #     db_connection = get_db_connection()
# # #     if not db_connection:
# # #         return {
# # #             "status": "error",
# # #             "message": "Database connection failed"
# # #         }

# # #     try:
# # #         cursor = db_connection.cursor(dictionary=True)
        
# # #         # Determine query type based on user message
# # #         if "baggage" in user_message.lower():
# # #             query = """
# # #                 SELECT id as pnr, baggage_handling 
# # #                 FROM pnr 
# # #                 WHERE id = %s
# # #             """
# # #         elif "class" in user_message.lower():
# # #             query = """
# # #                 SELECT id as pnr, class 
# # #                 FROM pnr 
# # #                 WHERE id = %s
# # #             """
# # #         elif "delay" in user_message.lower():
# # #             query = """
# # #                 SELECT id as pnr, 
# # #                        departure_delay_in_minutes,
# # #                        arrival_delay_in_minutes
# # #                 FROM pnr 
# # #                 WHERE id = %s
# # #             """
# # #         else:
# # #             query = """
# # #                 SELECT id as pnr,
# # #                        baggage_handling,
# # #                        class,
# # #                        departure_delay_in_minutes,
# # #                        arrival_delay_in_minutes
# # #                 FROM pnr 
# # #                 WHERE id = %s
# # #             """

# # #         cursor.execute(query, (pnr,))
# # #         result = cursor.fetchone()

# # #         if not result:
# # #             return {
# # #                 "status": "error",
# # #                 "message": f"No records found for PNR: {pnr}"
# # #             }

# # #         # Format response based on query type
# # #         if "baggage" in user_message.lower():
# # #             message = f"Baggage handling rating for PNR {pnr}: {result['baggage_handling']}/5"
# # #         elif "class" in user_message.lower():
# # #             message = f"Travel class for PNR {pnr}: {result['class']}"
# # #         elif "delay" in user_message.lower():
# # #             message = (
# # #                 f"Flight delays for PNR {pnr}:\n"
# # #                 f"Departure delay: {result['departure_delay_in_minutes']} minutes\n"
# # #                 f"Arrival delay: {result['arrival_delay_in_minutes']} minutes"
# # #             )
# # #         else:
# # #             message = (
# # #                 f"Details for PNR {pnr}:\n"
# # #                 f"Class: {result['class']}\n"
# # #                 f"Baggage Handling Rating: {result['baggage_handling']}/5\n"
# # #                 f"Departure Delay: {result['departure_delay_in_minutes']} minutes\n"
# # #                 f"Arrival Delay: {result['arrival_delay_in_minutes']} minutes"
# # #             )

# # #         return {
# # #             "status": "success",
# # #             "message": message
# # #         }

# # #     except Exception as e:
# # #         logger.error(f"Error processing PNR query: {e}")
# # #         return {
# # #             "status": "error",
# # #             "message": "An error occurred while processing your request."
# # #         }

# # #     finally:
# # #         if cursor:
# # #             cursor.close()
# # #         if db_connection:
# # #             db_connection.close()

# # # def handle_flight_status_query(flight_number: str) -> Dict:
# # #     """Handle flight status queries."""
# # #     db_connection = get_db_connection()
# # #     if not db_connection:
# # #         return {
# # #             "status": "error",
# # #             "message": "Database connection failed"
# # #         }

# # #     try:
# # #         cursor = db_connection.cursor(dictionary=True)
# # #         query = """
# # #             SELECT 
# # #                 Airline,
# # #                 DATE_FORMAT(Date_of_Journey, '%Y-%m-%d') as Date_of_Journey,
# # #                 Source,
# # #                 Destination,
# # #                 TIME_FORMAT(Dep_Time, '%H:%i') as Dep_Time,
# # #                 Duration,
# # #                 Total_Stops
# # #             FROM flights
# # #             WHERE Airline LIKE %s
# # #             ORDER BY Date_of_Journey DESC
# # #             LIMIT 1
# # #         """
# # #         cursor.execute(query, (f"%{flight_number}%",))
# # #         result = cursor.fetchone()

# # #         if not result:
# # #             return {
# # #                 "status": "error",
# # #                 "message": f"No flight found with number: {flight_number}"
# # #             }

# # #         return {
# # #             "status": "success",
# # #             "flight_status": result
# # #         }

# # #     except Exception as e:
# # #         logger.error(f"Error processing flight status query: {e}")
# # #         return {
# # #             "status": "error",
# # #             "message": "An error occurred while processing your request."
# # #         }

# # #     finally:
# # #         if cursor:
# # #             cursor.close()
# # #         if db_connection:
# # #             db_connection.close()

# # # @app.route("/api/chat", methods=["POST"])
# # # def chat():
# # #     """Handle chat requests."""
# # #     data = request.json
# # #     user_message = data.get("message", "").strip()
# # #     target_language = data.get("language", "en")
# # #     user_id = data.get("user_id", "default")
# # #     query_type = data.get("query_type", None)
# # #     pnr = data.get("pnr", None)

# # #     if not user_message:
# # #         return jsonify({
# # #             "status": "error",
# # #             "response": "Please provide a message."
# # #         }), 400

# # #     try:
# # #         # Handle PNR queries
# # #         if query_type == 'pnr':
# # #             if pnr:
# # #                 response = handle_pnr_query(user_message, pnr)
# # #                 return jsonify(response)
        
# # #         # Handle flight status queries
# # #         elif query_type == 'flight_status':
# # #             flight_number = data.get("flight_number")
# # #             if flight_number:
# # #                 response = handle_flight_status_query(flight_number)
# # #                 return jsonify(response)

# # #         # Translate user message to English
# # #         translated_message = translator.translate(user_message, dest="en").text

# # #         # Handle flight search requests
# # #         if "search flight" in translated_message.lower():
# # #             return handle_flight_search(data)

# # #         # Handle general queries via Dialogflow
# # #         dialogflow_response = detect_intent_texts("customerchatb", user_id, translated_message)
# # #         if dialogflow_response and dialogflow_response.fulfillment_text:
# # #             translated_response = translator.translate(
# # #                 dialogflow_response.fulfillment_text,
# # #                 dest=target_language
# # #             ).text
# # #             return jsonify({"status": "success", "response": translated_response})

# # #         return jsonify({
# # #             "status": "error",
# # #             "response": translator.translate(
# # #                 "I couldn't understand your request. Please try again.",
# # #                 dest=target_language
# # #             ).text
# # #         })

# # #     except Exception as e:
# # #         logger.error(f"Error in chat endpoint: {e}")
# # #         return jsonify({
# # #             "status": "error",
# # #             "response": "An unexpected error occurred. Please try again later."
# # #         }), 500

# # # @app.route("/api/search-flights", methods=["POST"])
# # # def handle_flight_search():
# # #     """Handle flight search requests."""
# # #     data = request.json
# # #     source = data.get("source", "").strip()
# # #     destination = data.get("destination", "").strip()
# # #     journey_date = data.get("journey_date", "").strip()

# # #     if not all([source, destination, journey_date]):
# # #         return jsonify({
# # #             "status": "error",
# # #             "message": "Please provide source, destination, and journey date."
# # #         }), 400

# # #     formatted_date = format_date(journey_date)
# # #     if not formatted_date:
# # #         return jsonify({
# # #             "status": "error",
# # #             "message": "Invalid date format. Please use YYYY-MM-DD."
# # #         }), 400

# # #     db_connection = get_db_connection()
# # #     if not db_connection:
# # #         return jsonify({
# # #             "status": "error",
# # #             "message": "Database connection failed. Please try again later."
# # #         }), 500

# # #     try:
# # #         cursor = db_connection.cursor(dictionary=True)
# # #         query = """
# # #             SELECT 
# # #                 Airline,
# # #                 DATE_FORMAT(Date_of_Journey, '%Y-%m-%d') as Date_of_Journey,
# # #                 Source,
# # #                 Destination,
# # #                 TIME_FORMAT(Dep_Time, '%H:%i') as Dep_Time,
# # #                 Duration,
# # #                 Total_Stops,
# # #                 Additional_Info,
# # #                 Price
# # #             FROM flights
# # #             WHERE Source = %s 
# # #             AND Destination = %s 
# # #             AND Date_of_Journey = %s
# # #             ORDER BY Price ASC
# # #             LIMIT 5
# # #         """
# # #         cursor.execute(query, (source, destination, formatted_date))
# # #         flights = cursor.fetchall()

# # #         if not flights:
# # #             return jsonify({
# # #                 "status": "success",
# # #                 "message": f"No flights found from {source} to {destination} on {journey_date}."
# # #             })

# # #         return jsonify({
# # #             "status": "success",
# # #             "flights": flights,
# # #             "message": f"Found {len(flights)} flights from {source} to {destination} on {journey_date}"
# # #         })

# # #     except Exception as e:
# # #         logger.error(f"Error processing flight search: {e}")
# # #         return jsonify({
# # #             "status": "error",
# # #             "message": "An error occurred while processing your request."
# # #         }), 500

# # #     finally:
# # #         if cursor:
# # #             cursor.close()
# # #         if db_connection:
# # #             db_connection.close()

# # # if __name__ == "__main__":
# # #     app.run(host="0.0.0.0", port=5001, debug=True)
# # from flask import Flask, request, jsonify
# # from flask_cors import CORS
# # import mysql.connector
# # from google.cloud import dialogflow_v2 as dialogflow
# # from google.cloud.dialogflow_v2.types import TextInput, QueryInput
# # from googletrans import Translator
# # from datetime import datetime
# # import logging
# # import os
# # from typing import Optional, Dict, Any

# # # Configure logging
# # logging.basicConfig(
# #     level=logging.INFO,
# #     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# # )
# # logger = logging.getLogger(__name__)

# # # Initialize Flask and services
# # app = Flask(__name__)
# # CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
# # translator = Translator()

# # # Configuration
# # DATABASE = {
# #     'host': 'localhost',
# #     'user': 'root',
# #     'password': 'Janu@2107',
# #     'database': 'flightdata',
# #     'port': 3306
# # }

# # # Set Google Application Credentials for Dialogflow
# # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/jahnaviburla/Downloads/272-Project/dialogflow_service_key.json"

# # def get_db_connection():
# #     """Create and return a database connection."""
# #     try:
# #         connection = mysql.connector.connect(**DATABASE)
# #         logger.info("Database connection established successfully.")
# #         return connection
# #     except mysql.connector.Error as err:
# #         logger.error(f"Database connection error: {err}")
# #         return None

# # def format_date(date_str: str) -> Optional[str]:
# #     """Format date string to MySQL compatible format."""
# #     try:
# #         # List of possible date formats
# #         date_formats = [
# #             '%Y-%m-%d',      # 2024-01-03
# #             '%d-%m-%Y',      # 03-01-2024
# #             '%d/%m/%Y',      # 03/01/2024
# #             '%Y/%m/%d',      # 2024/01/03
# #             '%d.%m.%Y',      # 03.01.2024
# #             '%Y.%m.%d',      # 2024.01.03
# #             '%d %b %Y',      # 03 Jan 2024
# #             '%d %B %Y',      # 03 January 2024
# #             '%b %d %Y',      # Jan 03 2024
# #             '%B %d %Y'       # January 03 2024
# #         ]

# #         # Try each format until one works
# #         for fmt in date_formats:
# #             try:
# #                 date_obj = datetime.strptime(date_str, fmt)
# #                 return date_obj.strftime('%Y-%m-%d')  # Convert to MySQL format
# #             except ValueError:
# #                 continue

# #         raise ValueError(f"Date format not recognized: {date_str}")
    
# #     except Exception as e:
# #         logger.error(f"Date formatting error: {e}")
# #         return None

# # def detect_intent_texts(project_id: str, session_id: str, text: str, language_code: str = "en-US"):
# #     """Detect intent using Dialogflow."""
# #     try:
# #         session_client = dialogflow.SessionsClient()
# #         session = session_client.session_path(project_id, session_id)
# #         text_input = TextInput(text=text, language_code=language_code)
# #         query_input = QueryInput(text=text_input)
# #         response = session_client.detect_intent(session=session, query_input=query_input)
# #         return response.query_result
# #     except Exception as e:
# #         logger.error(f"Dialogflow error: {str(e)}")
# #         return None

# # def handle_pnr_query(user_message: str, pnr: str) -> Dict:
# #     """Handle PNR-related queries."""
# #     db_connection = get_db_connection()
# #     if not db_connection:
# #         return {
# #             "status": "error",
# #             "message": "Database connection failed"
# #         }

# #     try:
# #         cursor = db_connection.cursor(dictionary=True)
        
# #         # Determine query type based on user message
# #         if "baggage" in user_message.lower():
# #             query = """
# #                 SELECT id as pnr, baggage_handling 
# #                 FROM pnr 
# #                 WHERE id = %s
# #             """
# #         elif "class" in user_message.lower():
# #             query = """
# #                 SELECT id as pnr, class 
# #                 FROM pnr 
# #                 WHERE id = %s
# #             """
# #         elif "delay" in user_message.lower():
# #             query = """
# #                 SELECT id as pnr, 
# #                        departure_delay_in_minutes,
# #                        arrival_delay_in_minutes
# #                 FROM pnr 
# #                 WHERE id = %s
# #             """
# #         else:
# #             query = """
# #                 SELECT id as pnr,
# #                        baggage_handling,
# #                        class,
# #                        departure_delay_in_minutes,
# #                        arrival_delay_in_minutes
# #                 FROM pnr 
# #                 WHERE id = %s
# #             """

# #         cursor.execute(query, (pnr,))
# #         result = cursor.fetchone()

# #         if not result:
# #             return {
# #                 "status": "error",
# #                 "message": f"No records found for PNR: {pnr}"
# #             }

# #         # Format response based on query type
# #         if "baggage" in user_message.lower():
# #             message = f"Baggage handling rating for PNR {pnr}: {result['baggage_handling']}/5"
# #         elif "class" in user_message.lower():
# #             message = f"Travel class for PNR {pnr}: {result['class']}"
# #         elif "delay" in user_message.lower():
# #             message = (
# #                 f"Flight delays for PNR {pnr}:\n"
# #                 f"Departure delay: {result['departure_delay_in_minutes']} minutes\n"
# #                 f"Arrival delay: {result['arrival_delay_in_minutes']} minutes"
# #             )
# #         else:
# #             message = (
# #                 f"Details for PNR {pnr}:\n"
# #                 f"Class: {result['class']}\n"
# #                 f"Baggage Handling Rating: {result['baggage_handling']}/5\n"
# #                 f"Departure Delay: {result['departure_delay_in_minutes']} minutes\n"
# #                 f"Arrival Delay: {result['arrival_delay_in_minutes']} minutes"
# #             )

# #         return {
# #             "status": "success",
# #             "message": message
# #         }

# #     except Exception as e:
# #         logger.error(f"Error processing PNR query: {e}")
# #         return {
# #             "status": "error",
# #             "message": "An error occurred while processing your request."
# #         }

# #     finally:
# #         if cursor:
# #             cursor.close()
# #         if db_connection:
# #             db_connection.close()

# # @app.route("/api/chat", methods=["POST"])
# # def chat():
# #     """Handle chat requests."""
# #     data = request.json
# #     user_message = data.get("message", "").strip()
# #     target_language = data.get("language", "en")
# #     user_id = data.get("user_id", "default")
# #     query_type = data.get("query_type", None)
# #     flow_type = data.get("flow_type", "general")
# #     pnr = data.get("pnr", None)

# #     if not user_message:
# #         return jsonify({
# #             "status": "error",
# #             "response": "Please provide a message."
# #         }), 400

# #     try:
# #         # Handle PNR queries
# #         if query_type == 'pnr':
# #             if pnr:
# #                 response = handle_pnr_query(user_message, pnr)
# #                 return jsonify(response)
        
# #         # Handle flight status queries
# #         elif query_type == 'flight_status':
# #             flight_number = data.get("flight_number")
# #             if flight_number:
# #                 response = handle_flight_status_query(flight_number)
# #                 return jsonify(response)

# #         # Translate user message to English
# #         translated_message = translator.translate(user_message, dest="en").text

# #         # Handle flight search requests
# #         if "search flight" in translated_message.lower():
# #             return handle_flight_search(data)

# #         # Handle general queries via Dialogflow
# #         dialogflow_response = detect_intent_texts("customerchatb", user_id, translated_message)
# #         if dialogflow_response and dialogflow_response.fulfillment_text:
# #             translated_response = translator.translate(
# #                 dialogflow_response.fulfillment_text,
# #                 dest=target_language
# #             ).text
# #             return jsonify({"status": "success", "response": translated_response})

# #         return jsonify({
# #             "status": "error",
# #             "response": translator.translate(
# #                 "I couldn't understand your request. Please try again.",
# #                 dest=target_language
# #             ).text
# #         })

# #     except Exception as e:
# #         logger.error(f"Error in chat endpoint: {e}")
# #         return jsonify({
# #             "status": "error",
# #             "response": "An unexpected error occurred. Please try again later."
# #         }), 500

# # @app.route("/api/search-flights", methods=["POST"])
# # def handle_flight_search():
# #     """Handle flight search requests."""
# #     data = request.json
# #     source = data.get("source", "").strip()
# #     destination = data.get("destination", "").strip()
# #     journey_date = data.get("journey_date", "").strip()

# #     if not all([source, destination, journey_date]):
# #         return jsonify({
# #             "status": "error",
# #             "message": "Please provide source, destination, and journey date."
# #         }), 400

# #     formatted_date = format_date(journey_date)
# #     if not formatted_date:
# #         return jsonify({
# #             "status": "error",
# #             "message": "Invalid date format. Please use YYYY-MM-DD."
# #         }), 400

# #     db_connection = get_db_connection()
# #     if not db_connection:
# #         return jsonify({
# #             "status": "error",
# #             "message": "Database connection failed. Please try again later."
# #         }), 500

# #     try:
# #         cursor = db_connection.cursor(dictionary=True)
# #         query = """
# #             SELECT 
# #                 Airline,
# #                 DATE_FORMAT(Date_of_Journey, '%Y-%m-%d') as Date_of_Journey,
# #                 Source,
# #                 Destination,
# #                 TIME_FORMAT(Dep_Time, '%H:%i') as Dep_Time,
# #                 Duration,
# #                 Total_Stops,
# #                 Additional_Info,
# #                 Price
# #             FROM flights
# #             WHERE Source = %s 
# #             AND Destination = %s 
# #             AND Date_of_Journey = %s
# #             ORDER BY Price ASC
# #             LIMIT 5
# #         """
# #         cursor.execute(query, (source, destination, formatted_date))
# #         flights = cursor.fetchall()

# #         if not flights:
# #             return jsonify({
# #                 "status": "success",
# #                 "message": f"No flights found from {source} to {destination} on {journey_date}."
# #             })

# #         formatted_flights = [format_flight_data(flight) for flight in flights]

# #         return jsonify({
# #             "status": "success",
# #             "flights": formatted_flights,
# #             "message": f"Found {len(flights)} flights from {source} to {destination} on {journey_date}"
# #         })

# #     except mysql.connector.Error as e:
# #         logger.error(f"MySQL Error: {e}")
# #         return jsonify({
# #             "status": "error",
# #             "message": "Database query failed. Please try again later."
# #         }), 500
# #     except Exception as e:
# #         logger.error(f"Unhandled Error: {e}")
# #         return jsonify({
# #             "status": "error",
# #             "message": "An unexpected error occurred. Please try again later."
# #         }), 500
# #     finally:
# #         if cursor:
# #             cursor.close()
# #         if db_connection:
# #             db_connection.close()

# # @app.route("/api/verify-pnr", methods=["POST"])
# # def verify_pnr():
# #     """Verify if a PNR exists and return basic details."""
# #     data = request.json
# #     pnr = data.get("pnr", "").strip()

# #     if not pnr:
# #         return jsonify({
# #             "status": "error",
# #             "message": "Please provide a PNR number."
# #         }), 400

# #     db_connection = get_db_connection()
# #     if not db_connection:
# #         return jsonify({
# #             "status": "error",
# #             "message": "Database connection failed"
# #         }), 500

# #     try:
# #         cursor = db_connection.cursor(dictionary=True)
# #         query = """
# #             SELECT id
# #             FROM pnr 
# #             WHERE id = %s
# #         """
# #         cursor.execute(query, (pnr,))
# #         result = cursor.fetchone()

# #         # Log the verification attempt
# #         logger.info(f"PNR Verification - PNR: {pnr}, Found: {result is not None}")

# #         if result:
# #             return jsonify({
# #                 "status": "success",
# #                 "message": "PNR verified successfully",
# #                 "pnr": result["id"]
# #             })
# #         else:
# #             return jsonify({
# #                 "status": "error",
# #                 "message": "Invalid PNR number"
# #             })

# #     except Exception as e:
# #         logger.error(f"Error verifying PNR: {e}")
# #         return jsonify({
# #             "status": "error",
# #             "message": "An error occurred while verifying the PNR."
# #         }), 500

# #     finally:
# #         if cursor:
# #             cursor.close()
# #         if db_connection:
# #             db_connection.close()

# # if __name__ == "__main__":
# #     app.run(host="0.0.0.0", port=5001, debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import mysql.connector
# from google.cloud import dialogflow_v2 as dialogflow
# from google.cloud.dialogflow_v2.types import TextInput, QueryInput
# from googletrans import Translator
# from datetime import datetime
# import logging
# import os
# from typing import Optional, Dict, Any

# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
# )
# logger = logging.getLogger(__name__)

# # Initialize Flask and services
# app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
# translator = Translator()

# # Configuration
# DATABASE = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': 'Janu@2107',
#     'database': 'flightdata',
#     'port': 3306
# }

# # Set Google Application Credentials for Dialogflow
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/jahnaviburla/Downloads/272-Project/dialogflow_service_key.json"


# def get_db_connection():
#     """Create and return a database connection."""
#     try:
#         connection = mysql.connector.connect(**DATABASE)
#         logger.info("Database connection established successfully.")
#         return connection
#     except mysql.connector.Error as err:
#         logger.error(f"Database connection error: {err}")
#         return None


# def format_date(date_str: str) -> Optional[str]:
#     """Format date string to MySQL compatible format."""
#     try:
#         date_formats = [
#             '%Y-%m-%d', '%d-%m-%Y', '%d/%m/%Y', '%Y/%m/%d',
#             '%d.%m.%Y', '%Y.%m.%d', '%d %b %Y', '%d %B %Y',
#             '%b %d %Y', '%B %d %Y'
#         ]
#         for fmt in date_formats:
#             try:
#                 date_obj = datetime.strptime(date_str, fmt)
#                 return date_obj.strftime('%Y-%m-%d')
#             except ValueError:
#                 continue
#         raise ValueError(f"Date format not recognized: {date_str}")
#     except Exception as e:
#         logger.error(f"Date formatting error: {e}")
#         return None


# @app.route("/api/search-flights", methods=["POST"])
# def handle_flight_search():
#     """Handle flight search requests."""
#     data = request.json
#     source = data.get("source", "").strip()
#     destination = data.get("destination", "").strip()
#     journey_date = data.get("journey_date", "").strip()

#     if not all([source, destination, journey_date]):
#         return jsonify({
#             "status": "error",
#             "message": "Please provide source, destination, and journey date."
#         }), 400

#     formatted_date = format_date(journey_date)
#     if not formatted_date:
#         return jsonify({
#             "status": "error",
#             "message": "Invalid date format. Please use YYYY-MM-DD."
#         }), 400

#     db_connection = get_db_connection()
#     if not db_connection:
#         return jsonify({
#             "status": "error",
#             "message": "Database connection failed. Please try again later."
#         }), 500

#     try:
#         cursor = db_connection.cursor(dictionary=True)
#         query = """
#             SELECT 
#                 Airline, DATE_FORMAT(Date_of_Journey, '%Y-%m-%d') as Date_of_Journey,
#                 Source, Destination, TIME_FORMAT(Dep_Time, '%H:%i') as Dep_Time,
#                 Duration, Total_Stops, Additional_Info, Price
#             FROM flights
#             WHERE LOWER(Source) = LOWER(%s) 
#               AND LOWER(Destination) = LOWER(%s) 
#               AND Date_of_Journey = %s
#             ORDER BY Price ASC
#         """
#         cursor.execute(query, (source, destination, formatted_date))
#         flights = cursor.fetchall()

#         if not flights:
#             return jsonify({
#                 "status": "success",
#                 "message": f"No flights found from {source} to {destination} on {journey_date}."
#             })

#         return jsonify({
#             "status": "success",
#             "flights": flights,
#             "message": f"Found {len(flights)} flights from {source} to {destination} on {journey_date}."
#         })

#     except Exception as e:
#         logger.error(f"Error processing flight search: {e}")
#         return jsonify({
#             "status": "error",
#             "message": "An error occurred while processing your request."
#         }), 500

#     finally:
#         if cursor:
#             cursor.close()
#         if db_connection:
#             db_connection.close()


# @app.route("/api/verify-pnr", methods=["POST"])
# def verify_pnr():
#     """Verify if a PNR exists and return basic details."""
#     data = request.json
#     pnr = data.get("pnr", "").strip()

#     if not pnr:
#         return jsonify({
#             "status": "error",
#             "message": "Please provide a PNR number."
#         }), 400

#     db_connection = get_db_connection()
#     if not db_connection:
#         return jsonify({
#             "status": "error",
#             "message": "Database connection failed"
#         }), 500

#     try:
#         cursor = db_connection.cursor(dictionary=True)
#         query = "SELECT id FROM pnr WHERE id = %s"
#         cursor.execute(query, (pnr,))
#         result = cursor.fetchone()

#         if result:
#             return jsonify({
#                 "status": "success",
#                 "message": "PNR verified successfully",
#                 "pnr": result["id"]
#             })
#         else:
#             return jsonify({
#                 "status": "error",
#                 "message": "Invalid PNR number"
#             })

#     except Exception as e:
#         logger.error(f"Error verifying PNR: {e}")
#         return jsonify({
#             "status": "error",
#             "message": "An error occurred while verifying the PNR."
#         }), 500

#     finally:
#         if cursor:
#             cursor.close()
#         if db_connection:
#             db_connection.close()


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5001, debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from google.cloud import dialogflow_v2 as dialogflow
from google.cloud.dialogflow_v2.types import TextInput, QueryInput
from googletrans import Translator
from datetime import datetime
import logging
import os
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize Flask and services
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000"]}})
translator = Translator()

# Configuration
DATABASE = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Janu@2000',
    'database': 'flightData',
    'port': 3306
}

# Set Google Application Credentials for Dialogflow
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/jahnaviburla/Downloads/272-Project/dialogflow_service_key.json"

def get_db_connection():
    """Create and return a database connection."""
    try:
        connection = mysql.connector.connect(**DATABASE)
        logger.info("Database connection established successfully.")
        return connection
    except mysql.connector.Error as err:
        logger.error(f"Database connection error: {err}")
        return None

def format_date(date_str: str) -> Optional[str]:
    """Format date string to MySQL compatible format."""
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError as e:
        logger.error(f"Date formatting error: {e}")
        return None

def detect_intent_texts(project_id: str, session_id: str, text: str, language_code: str = "en-US"):
    """Detect intent using Dialogflow."""
    try:
        session_client = dialogflow.SessionsClient()
        session = session_client.session_path(project_id, session_id)
        text_input = TextInput(text=text, language_code=language_code)
        query_input = QueryInput(text=text_input)
        response = session_client.detect_intent(session=session, query_input=query_input)
        return response.query_result
    except Exception as e:
        logger.error(f"Dialogflow error: {str(e)}")
        return None

def handle_pnr_query(user_message: str, pnr: str) -> Dict:
    """Handle PNR-related queries."""
    db_connection = get_db_connection()
    if not db_connection:
        return {
            "status": "error",
            "message": "Database connection failed"
        }

    try:
        cursor = db_connection.cursor(dictionary=True)
        
        # Determine query type based on user message
        if "baggage" in user_message.lower():
            query = """
                SELECT id as pnr, baggage_handling 
                FROM pnr 
                WHERE id = %s
            """
        elif "class" in user_message.lower():
            query = """
                SELECT id as pnr, class 
                FROM pnr 
                WHERE id = %s
            """
        elif "delay" in user_message.lower():
            query = """
                SELECT id as pnr, 
                       departure_delay_in_minutes,
                       arrival_delay_in_minutes
                FROM pnr 
                WHERE id = %s
            """
        else:
            query = """
                SELECT id as pnr,
                       baggage_handling,
                       class,
                       departure_delay_in_minutes,
                       arrival_delay_in_minutes
                FROM pnr 
                WHERE id = %s
            """

        cursor.execute(query, (pnr,))
        result = cursor.fetchone()

        if not result:
            return {
                "status": "error",
                "message": f"No records found for PNR: {pnr}"
            }

        # Format response based on query type
        if "baggage" in user_message.lower():
            message = f"Baggage handling rating for PNR {pnr}: {result['baggage_handling']}/5"
        elif "class" in user_message.lower():
            message = f"Travel class for PNR {pnr}: {result['class']}"
        elif "delay" in user_message.lower():
            message = (
                f"Flight delays for PNR {pnr}:\n"
                f"Departure delay: {result['departure_delay_in_minutes']} minutes\n"
                f"Arrival delay: {result['arrival_delay_in_minutes']} minutes"
            )
        else:
            message = (
                f"Details for PNR {pnr}:\n"
                f"Class: {result['class']}\n"
                f"Baggage Handling Rating: {result['baggage_handling']}/5\n"
                f"Departure Delay: {result['departure_delay_in_minutes']} minutes\n"
                f"Arrival Delay: {result['arrival_delay_in_minutes']} minutes"
            )

        return {
            "status": "success",
            "message": message
        }

    except Exception as e:
        logger.error(f"Error processing PNR query: {e}")
        return {
            "status": "error",
            "message": "An error occurred while processing your request."
        }

    finally:
        if cursor:
            cursor.close()
        if db_connection:
            db_connection.close()

def handle_flight_status_query(flight_number: str) -> Dict:
    """Handle flight status queries."""
    db_connection = get_db_connection()
    if not db_connection:
        return {
            "status": "error",
            "message": "Database connection failed"
        }

    try:
        cursor = db_connection.cursor(dictionary=True)
        query = """
            SELECT 
                Airline,
                DATE_FORMAT(Date_of_Journey, '%Y-%m-%d') as Date_of_Journey,
                Source,
                Destination,
                TIME_FORMAT(Dep_Time, '%H:%i') as Dep_Time,
                Duration,
                Total_Stops
            FROM flights
            WHERE Airline LIKE %s
            ORDER BY Date_of_Journey DESC
            LIMIT 1
        """
        cursor.execute(query, (f"%{flight_number}%",))
        result = cursor.fetchone()

        if not result:
            return {
                "status": "error",
                "message": f"No flight found with number: {flight_number}"
            }

        return {
            "status": "success",
            "flight_status": result
        }

    except Exception as e:
        logger.error(f"Error processing flight status query: {e}")
        return {
            "status": "error",
            "message": "An error occurred while processing your request."
        }

    finally:
        if cursor:
            cursor.close()
        if db_connection:
            db_connection.close()

@app.route("/api/chat", methods=["POST"])
def chat():
    """Handle chat requests."""
    data = request.json
    user_message = data.get("message", "").strip()
    target_language = data.get("language", "en")
    user_id = data.get("user_id", "default")
    query_type = data.get("query_type", None)
    flow_type = data.get("flow_type", "general")
    pnr = data.get("pnr", None)

    if not user_message:
        return jsonify({
            "status": "error",
            "response": "Please provide a message."
        }), 400

    try:
        # Handle initial options response
        if flow_type == "initial":
            return jsonify({
                "status": "success",
                "response": "Please select one of the available options.",
                "options": [
                    {
                        "id": "travel",
                        "text": "Travel Guide",
                        "description": "Search flights and get travel assistance"
                    },
                    {
                        "id": "booking",
                        "text": "My Booking",
                        "description": "Access your booking details and services"
                    }
                ]
            })

        # Handle booking flow
        if flow_type == "booking":
            if not pnr:
                return jsonify({
                    "status": "success",
                    "response": "Please provide your PNR number to access your booking details.",
                    "request_pnr": True
                })
            else:
                return handle_pnr_query(user_message, pnr)

        # Handle PNR queries
        if query_type == 'pnr':
            if pnr:
                return handle_pnr_query(user_message, pnr)
        
        # Handle flight status queries
        elif query_type == 'flight_status':
            flight_number = data.get("flight_number")
            if flight_number:
                response = handle_flight_status_query(flight_number)
                return jsonify(response)

        # Handle flight search
        if "search flight" in user_message.lower():
            return handle_flight_search(data)

        # Default handling with Dialogflow
        translated_message = translator.translate(user_message, dest="en").text
        dialogflow_response = detect_intent_texts("customerchatb", user_id, translated_message)
        
        if dialogflow_response and dialogflow_response.fulfillment_text:
            translated_response = translator.translate(
                dialogflow_response.fulfillment_text,
                dest=target_language
            ).text
            return jsonify({
                "status": "success",
                "response": translated_response
            })

        return jsonify({
            "status": "error",
            "response": translator.translate(
                "I couldn't understand your request. Please try again.",
                dest=target_language
            ).text
        })

    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({
            "status": "error",
            "response": "An unexpected error occurred. Please try again later."
        }), 500

@app.route("/api/search-flights", methods=["POST"])
def handle_flight_search():
    """Handle flight search requests."""
    data = request.json
    source = data.get("source", "").strip()
    destination = data.get("destination", "").strip()
    journey_date = data.get("journey_date", "").strip()

    if not all([source, destination, journey_date]):
        return jsonify({
            "status": "error",
            "message": "Please provide source, destination, and journey date."
        }), 400

    formatted_date = format_date(journey_date)
    if not formatted_date:
        return jsonify({
            "status": "error",
            "message": "Invalid date format. Please use YYYY-MM-DD."
        }), 400

    db_connection = get_db_connection()
    if not db_connection:
        return jsonify({
            "status": "error",
            "message": "Database connection failed. Please try again later."
        }), 500

    try:
        cursor = db_connection.cursor(dictionary=True)
        query = """
            SELECT 
                Airline,
                DATE_FORMAT(Date_of_Journey, '%Y-%m-%d') as Date_of_Journey,
                Source,
                Destination,
                TIME_FORMAT(Dep_Time, '%H:%i') as Dep_Time,
                Duration,
                Total_Stops,
                Additional_Info,
                Price
            FROM flights
            WHERE Source = %s 
            AND Destination = %s 
            AND Date_of_Journey = %s
            ORDER BY Price ASC
            LIMIT 5
        """
        cursor.execute(query, (source, destination, formatted_date))
        flights = cursor.fetchall()

        return jsonify({
            "status": "success",
            "flights": flights,
            "message": f"Found {len(flights)} flights from {source} to {destination} on {journey_date}"
        })

    except Exception as e:
        logger.error(f"Error processing flight search: {e}")
        return jsonify({
            "status": "error",
            "message": "An error occurred while processing your request."
        }), 500

    finally:
        if cursor:
            cursor.close()
        if db_connection:
            db_connection.close()

@app.route("/api/verify-pnr", methods=["POST"])
def verify_pnr():
    """Verify if a PNR exists and return basic details."""
    data = request.json
    pnr = data.get("pnr", "").strip()

    if not pnr:
        return jsonify({
            "status": "error",
            "message": "Please provide a PNR number."
        }), 400

    db_connection = get_db_connection()
    if not db_connection:
        return jsonify({
            "status": "error",
            "message": "Database connection failed"
        }), 500

    try:
        cursor = db_connection.cursor(dictionary=True)
        query = """
            SELECT id
            FROM pnr 
            WHERE id = %s
        """
        cursor.execute(query, (pnr,))
        result = cursor.fetchone()

        # Log the verification attempt
        logger.info(f"PNR Verification - PNR: {pnr}, Found: {result is not None}")

        if result:
            return jsonify({
                "status": "success",
                "message": "PNR verified successfully",
                "pnr": result["id"]
            })
        else:
            return jsonify({
                "status": "error",
                "message": "Invalid PNR number"
            })

    except Exception as e:
        logger.error(f"Error verifying PNR: {e}")
        return jsonify({
            "status": "error",
            "message": "An error occurred while verifying the PNR."
        }), 500

    finally:
        if cursor:
            cursor.close()
        if db_connection:
            db_connection.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)