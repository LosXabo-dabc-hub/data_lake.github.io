from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_quakes

# Create an instance of Flask
app = Flask(__name__)

## Use flask_pymongo to set up mongo connection
#app.config["MONGO_URI"] = "mongodb://localhost:27017/mars_app"
#mongo = PyMongo(app)

# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri="mongodb://localhost:27017/mars_app")


# Route to render news1.html template using data from Mongo
@app.route("/")
def home():

    # Find one record of data from the mongo database
    mission_data = mongo.db.collection.find_one()

    # Return template and data
    if mission_data: 
        return render_template("news1.html", trek=mission_data)
    else:
        return redirect("/scrape")


# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():

    # Run the scrape function
    mars_data = scrape_quakes.scrape_info()

    # Update the Mongo database using update and upsert=True
    mongo.db.collection.update({}, mars_data, upsert=True)

    # Redirect back to home page
    return redirect("/")


if __name__ == "__main__":
    app.run()
