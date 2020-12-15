const bodyParser = require("body-parser");
const express = require("express");
require("dotenv").config();
const { getResults } = require("./database.js");

const app = express();
const port = 3000;

async function dbResults(results) {
  finalResults = results;
}

app.use(bodyParser.json());

var finalResults;

app.get("/search", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  var search = req.query.query;
  console.log("Query at API: ", req.query.query);
  await getResults(search, dbResults);
  res.json(finalResults);
});

app.listen(port, () => {
  console.log("Server listening on port", port);
});
