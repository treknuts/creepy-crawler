# creepy-crawler

web crawler

## Required Software

In order to run this application you **must** have MySQL, Node.js, and npm or yarn on your machine.

There is an example `.env` file provided with this project. Copy and paste it at the root of the project and
place your credentials along with their respective environment variable names.

## Install Dependencies

Installing dependencies is done through the following command:
`npm install`

## Running the Application

Note this project is only for running the crawler and server

### Putting data in the database via the crawler

To initialize the crawler to begin inserting data into the database simply run
`node run-crawler.js`
Let this run for awhile. The max pages to be inserted has been set to 500 so, it may take a couple minutes.
If you wish to expedite the proccess simple press `control/command` + `c` to stop the process.

### Running the Server to Serve the Frontend

To start the server simply run
`node server.js`
Simlar to the crawler you can stop the process by pressing `control/command` + `c`
