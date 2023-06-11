# README_Project3

Project Description: 
How much has our travel time changed in the last few years?
With the slowdown of travel during and the increase after COVID, how much did it impact this option for travel?
In this project, we want to gather information from some of the most popular airports from one of the more populated states and visualize what happened over time.
The centerpieces of the information are the Delays, Cancellations, and Diversions that would make anyone “angrier than the Keebler Elf demoted to fudge packer.” (L. Cable Guy)
The three major Airlines are Los Angeles, San Francisco, and San Diego, California, with their respective LAX, SFO, and SAN airport codes.


### The Steps of the Project
To acquire and interpret the data we had to chart the following “ ”steps:

### Step 1: ETL

We collected the data from the following site <a href="https://data.bts.gov/" target="_blank">Bureau of Transportation statistics</a>. The site had the ability to download a csv file which we were able to create our initial  dataframe.

The greatest challenge with the CSV file was the amount of data it contained since we could not filter it by the airlines selected prior to this. Due to this obstacle, and the amount of data that was allowed, we downloaded four separate csv files by year.  [2018 csv](T_ONTIME_MARKETING_2018.csv), [2019 csv](T_ONTIME_MARKETING_2019.csv), [2020 csv](T_ONTIME_MARKETING_2020.csv), [2022 csv](T_ONTIME_MARKETING_2022.csv) 

We decided to go with one month (December) of each year for all of the fiight departing out of those three airports. This still created a CSV with over one million rows. 

We added three addtional columns DELAYED_STATUS, CANCELLED_STATUS, AND DIVERTED_STATUS, with either a YES or NO.

The next step was to merge the data. Using the command prompt, we selected the CSV files and used the command: “copy*.csv merged-csv-files.csv” to create a new file with all of them merged.  [Merged csv](Merged-csv-files.csv)

Once we had merged the data the next step was finish clean up and merge it into MongoDB.

Using Jupyter Notebook and the Pandas module, we created the data frame flightdelays_df from the merged CSV file. We manipulated the data by turning the YES and NOs into 1s and 0s. Pandas also allowed us to create a list of dictionaries for an easy transition into Mongo Db as a collection} of documents. We also cleaned the data by scrubbing blank or NA columns. This allowed us to get as much condensed and accurate information as possible into the Mongo Data Base. [Jupyter Notebook File](Project3ELT.ipynb)

We selected Mongo due to its versality with JSON and the visualizations that we require for this assignment.


### Step 2: Using the Flask app

With the assistance of the sample code and our teacher, the Flask app was the following line of code needed for our project. 
The imports necessary to make the code work were the following:
• Flask Jsonify to help return the Response objects.
• Flask Cors to help with all use cases for the Domain.
• Flask Pymongo to communicate with our database where Flight information is located.

After the imports, we created the app by assigning the app to Flask (__name__) and then included CORS(app).

As mentioned before, the Mongo database was selected and used to configure the API.config by assigning Mongo to Pymongo(app).

Our API start point was the app.route, defined as a home with the response/ available routes as the LAX, SFO, and SAN data.

With our teacher's contribution, we created a code that collected the key values in the rows of the Mongo data and defined it as a get_document.

If the document found the key values of the selected airport, it would return a unified document. We decided to create one API for each airport.

Then finished the Flask with the name and app run.

[Flask App](Project3Flask.py)



# We need to flesh out the last parts. FL

### Step 3: HTML and Javascript app

This is where you should be spending most of your time, since this is where the user interactivity and visualizations should be; if you have other ideas, please see me.  It illustrates how to use D3 to navigate the DOM to get access to a button and handle a click event which adds a plot to the DOM.  I didn't start with an initial plot, just so that I could show interactivity by forcing a button click to show the interaction.  I also didn't provide any CSS styling to keep the example simple.

### Steps to run

First, you will need two terminal (or Git bash) windows running.  In the first window, from the directory where you have your Flask app, you need to run the Flask app.  Here is my example:
``` bash

$ python Step2_Flask_API_Server.py * Serving Flask app 'Step2_Flask_API_Server'
 * Debug mode: on
   WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:5000
   Press CTRL+C to quit
 * Restarting with watchdog (windowsapi)
 * Debugger is active!
 * Debugger PIN: 106-222-758`
```

Notice that the Flask app is running on `localhost:5000`, which is where we are reading the data from via the API call to the `/data` endpoint.

In the second window, navigate to where the `index.html` file is for your Javascript front-end visualizations and run the Python simple HTTP server with the command `python -m http.server`.  Here is my example:

```bash
(base)
coach@ENERGYROX1 MINGW64 ~/projects/mock_project3/Step3_Javascript
$ python -m http.server
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

You should now be able to go to a local browser and type:

```url
http://localhost:8000
```

... to see your visualizations!

Good luck!
v