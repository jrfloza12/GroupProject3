from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from flask_pymongo import PyMongo
from pprint import pprint

# create the app
app = Flask(__name__)
# CORS(app)

# configure the Flask-PyMongo
app.config["MONGO_URI"] = "mongodb://localhost:27017/flight_data"
mongo = PyMongo(app)

# API start point
@app.route("/")
def home():
    return (
        f"<h2>Flask app to return API data</h2>"
        f"Available Routes:<br/>"
        f"&nbsp;&nbsp;/all_data<br/>"
        f"&nbsp;&nbsp;/One LAX<br/>"
        f"&nbsp;&nbsp;/flight_dealys/<document_id>"
    )

# get one for testing 
@app.route('/One LAX', methods=['GET'])
def get_document():
    collection = mongo.db.flight_delays
    document = collection.find_one({"ORIGIN": "LAX"})
    if document:
        return jsonify(document)
    else:
        return "Document not found", 404

# get all data (for good or bad)
@app.route('/all_data', methods=['GET'])
def get_all_documents():
    collection = mongo.db.flight_dealys
    documents = collection.find()
    result = []
    for doc in documents:
        result.append(doc)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
