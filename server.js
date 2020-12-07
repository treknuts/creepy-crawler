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

app.options("*", function (req, res) {
  res.send(200);
});

server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log("Node server running at http://localhost:3000 :)");
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

app.get("/search", (req, res) => {
  const query = req.body.query;

  res.status(200);
  res.json({
    success: true,
    message: `Searched for ${req.body.query}`,
    data: data,
  });
});
