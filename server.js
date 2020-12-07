const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const { getResults } = require("./database.js");

const host = process.env.DB_HOST;
const db = process.env.DB_NAME;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const dbConfig = {
  host: host,
  database: db,
  user: user,
  password: password,
};

const app = express();
const port = 3000;

async function dbResults(results) {
  finalResults = results;
}

app.use(bodyParser.json());

var finalResults;

app.get("/search", async (req, res) => {
  var search = req.body.query;
  await getResults(search, dbResults);
  res.json(finalResults);
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
