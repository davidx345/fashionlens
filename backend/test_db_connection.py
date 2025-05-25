# c:\Users\david\Documents\projects\fashion\backend\test_db_connection.py
import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure, ConfigurationError
from dotenv import load_dotenv

def test_mongodb_connection():
    """Tests the MongoDB connection using MONGODB_URI from .env file."""
    load_dotenv()  # Load environment variables from .env file

    mongodb_uri = os.environ.get("MONGODB_URI")

    if not mongodb_uri:
        print("Error: MONGODB_URI not found in environment variables.")
        print("Please ensure it is set in your .env file in the backend directory.")
        return

    print(f"Attempting to connect to MongoDB with URI: {mongodb_uri[:mongodb_uri.find(':', mongodb_uri.find('//')+2) + 1]}********@{mongodb_uri[mongodb_uri.find('@')+1:]}") # Mask password

    try:
        # It's good practice to set a serverSelectionTimeoutMS to avoid hanging indefinitely
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        
        # The ismaster command is cheap and does not require auth.
        # client.admin.command('ismaster') 
        # print("Successfully connected to MongoDB server (pre-authentication check).")

        # The ping command is cheap and will verify that the connection is authenticated and working.
        client.admin.command('ping')
        print("Successfully connected and authenticated to MongoDB!")
        print("Database ping successful.")

    except ConfigurationError as e:
        print(f"MongoDB Configuration Error: {e}")
        print("This often means the MONGODB_URI is malformed. Please check its syntax.")
    except ConnectionFailure as e:
        print(f"MongoDB Connection Failure: {e}")
        print("This could be due to network issues, an incorrect hostname/port, or the MongoDB server not running or not reachable.")
        print("If using Atlas, check your IP whitelist and that the cluster is active.")
    except OperationFailure as e:
        print(f"MongoDB Operation Failure: {e}")
        print(f"Full error: {e.details}")
        if e.code == 8000 or "bad auth" in str(e).lower() or "authentication failed" in str(e).lower():
            print("This is an AUTHENTICATION FAILED error.")
            print("Please double-check:")
            print("  1. Username and Password in your MONGODB_URI.")
            print("  2. The database user exists in Atlas with correct permissions.")
            print("  3. Network Access rules in Atlas allow your IP.")
        else:
            print("This could be due to insufficient permissions for the operation (like ping) or other server-side issues.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    test_mongodb_connection()
