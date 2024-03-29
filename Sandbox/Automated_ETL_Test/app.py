"""
Created 2019
Author: Dream Team ETL Project with Schedule_Python file
"""

from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import Schedule_Python

# Create an instance of Flask
app = Flask(__name__)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_data")


# Route to render index.html template using data from Mongo
@app.route("/")
def home():
    # Find one record of data from the mongo database
    mission_data = mongo.db.collection.find_one()
    # Return template and data
    return render_template("index.html", mars_dict=mission_data)


# Route that will trigger the scrape function
@app.route("/schedule")
def scrape():
    
    # Run the scrape function
    mars_data=scrape_mars.scrape_info()
    
    # Update the Mongo database using update and upsert=True
    mongo.db.collection.update({}, mars_data, upsert=True)
    
    # Redirect back to home page
    return redirect("/")

@app.route("/stop")
def scrape():
    
    # Run the scrape function
    mars_data=scrape_mars.scrape_info()
    
    # Update the Mongo database using update and upsert=True
    mongo.db.collection.update({}, mars_data, upsert=True)
    
    # Redirect back to home page
    return redirect("/")


if __name__ == "__main__":
    app.run()