const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const textProcessor = require("./textprocessor");

const app = express();

const server = require("http").Server(app);
const port = 3000;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );

  next();
});

app.options("*", function (req, res) {
  res.send(200);
});

server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log("Node endpoints working :)");
});

app.all("/", (req, res) => {
  if (req.method === "GET") {
    res.status(200);
    res.json({ working: true });
    res.end();
  } else if (req.method === "POST") {
    res.status(200);
    res.send("working");
    res.end();
  } else if (req.method === "PUT") {
    res.status(200);
    res.send("working");
    res.end();
  }
});

const document1 =
  "If a wood chuck could chuck wood would a wood chuck wood chuck wood";

const document2 = "The quick brown fox does some shit";

const document3 = "A wood chipper chips wood";

const documents = [document1, document2, document3];

app.get("/search", (req, res) => {
  const query = req.body.query;
  const weightsObj = textProcessor.similaritiesFromText(query, documents);
  const data = [];
  for (obj in weightsObj) {
    data.push(documents[obj]);
  }
  res.status(200);
  res.json({
    success: true,
    message: `Searched for ${req.body.query}`,
    data: data,
  });
});
