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
        f"&nbsp;&nbsp;/One LAX<br/>"
        
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

# get all data (for good or bad)
@app.route('/LAX_data', methods=['GET'])
def get_all_documents():
    collection = mongo.db.flight_delays
    documents = [row for row in collection.find({"ORIGIN": "LAX"}, {"ORIGIN": 1, "DEST" : 1, "_id" : 0})]
    print(type(documents))
    # documents = [{k:v for k,v in row.items() if k != '_id'} for row in documents]
    return jsonify(documents)

if __name__ == "__main__":
    app.run(debug=True)