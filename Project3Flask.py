from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from pprint import pprint

# create the app
app = Flask(__name__)
CORS(app)

# configure the Flask-PyMongo
app.config["MONGO_URI"] = "mongodb://localhost:27017/flight_data"
mongo = PyMongo(app)

# API start point
@app.route("/")
def home():
    return (
        f"<h2>Flask app to return API data</h2>"
        f"Available Routes:<br/>"
        f"&nbsp;&nbsp;/LAX_data<br/>"
        f"&nbsp;&nbsp;/SFO_data<br/>"
        f"&nbsp;&nbsp;/SAN_data<br/>"
        
    )

# get one for testing 
@app.route('/One LAX', methods=['GET'])
def get_document():
    # collection = [{k:v for k,v in row.iterrows() if k != '_id'} for row in mongo.db.flight_delays]
    collection = mongo.db.flight_delays
    document = collection.find_one({"ORIGIN": "LAX"}, {"ORIGIN": 1, "DEST" : 1, "_id" : 0})
    
    # document = {k:v for k,v in document.items() if k != '_id'} 
    
    
    if document:
        return jsonify(document)
    else:
        return "Document not found", 404

# get all data per Airport
@app.route('/LAX_data', methods=['GET'])
def get_all_documents():
    collection = mongo.db.flight_delays
    documents = [row for row in collection.find({"ORIGIN": "LAX"}, {"ORIGIN": 1,"DEST":1,"_id":0,"FL_DATE":1,
                                                                    "DEP_DELAY":1,"ARR_DELAY":1,"CANCELLED":1,"CANCELLED_STATUS":1,
                                                                    "DIVERTED_STATUS":1,"DELAYED_STATUS":1})]
    print(type(documents))
    # documents = [{k:v for k,v in row.items() if k != '_id'} for row in documents]
    return jsonify(documents)

# get all data per Airport
@app.route('/SFO_data', methods=['GET'])
def get_all_documents():
    collection = mongo.db.flight_delays
    documents = [row for row in collection.find({"ORIGIN": "SFO"}, {"ORIGIN": 1,"DEST":1,"_id":0,"FL_DATE":1,
                                                                    "DEP_DELAY":1,"ARR_DELAY":1,"CANCELLED":1,"CANCELLED_STATUS":1,
                                                                    "DIVERTED_STATUS":1,"DELAYED_STATUS":1})]
    print(type(documents))
    # documents = [{k:v for k,v in row.items() if k != '_id'} for row in documents]
    return jsonify(documents)

# get all data per Airport
@app.route('/SAN_data', methods=['GET'])
def get_all_documents():
    collection = mongo.db.flight_delays
    documents = [row for row in collection.find({"ORIGIN": "SAN"}, {"ORIGIN": 1,"DEST":1,"_id":0,"FL_DATE":1,
                                                                    "DEP_DELAY":1,"ARR_DELAY":1,"CANCELLED":1,"CANCELLED_STATUS":1,
                                                                    "DIVERTED_STATUS":1,"DELAYED_STATUS":1})]
    print(type(documents))
    # documents = [{k:v for k,v in row.items() if k != '_id'} for row in documents]
    return jsonify(documents)

if __name__ == "__main__":
    app.run(debug=True)