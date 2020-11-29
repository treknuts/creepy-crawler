const { MongoClient } = require("mongodb");
const fs = require("fs");
require("dotenv").config();

const dbname = "noogledb";
const uri = process.env.MONGO_URI;

async function getPages(uri) {
  MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, db) {
    if (err) console.log(err);

    var dbo = db.db(dbname);

    dbo
      .collection("pages")
      .find({})
      .toArray(function (err, result) {
        if (err) console.log(err);
        console.log(result);
        db.close();
      });
  });
}

async function getPage(uri, name) {}

// Call this once to insert the pages into your local database instance
async function insertPages(uri) {
  var raw = fs.readFileSync("pages.json");
  var pages = JSON.parse(raw);

  MongoClient.connect(uri, { useUnifiedTopology: true }, function (err, db) {
    if (err) console.log(err);

    var dbo = db.db(dbname);

    dbo.collection("pages").insertMany(pages, function (err, res) {
      if (err) throw err;

      console.log(`Successfully inserted ${res.insertedCount} documents!`);
      db.close();
    });
  });
}
