const mysql = require("mysql");
const { json } = require("body-parser");
require("dotenv").config();

const host = process.env.DB_HOST;
const db = process.env.DB_NAME;
const user = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const table = "pages";

var connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: db,
});

connection.connect(function (err) {
  if (err) throw err;

  console.log("Connected Successfully!");
});

/*
 * pages
 * ----------------------------------------------------------------------
 * |           |                  |                |                    |
 * | id -> int | title -> varchar | url -> varchar | page_text -> text  |
 * |           |                  |                |                    |
 * ----------------------------------------------------------------------
 */

/*
 * Example full-text query
 * SELECT url FROM test WHERE MATCH(page_text) AGAINST ('jumped brown fox' IN NATURAL LANGUAGE MODE);
 */

function insertPage(pageObj) {
  var sql = `INSERT INTO ${table} (url, title, content) VALUES (${connection.escape(
    pageObj["url"]
  )}, ${connection.escape(pageObj["title"])}, ${connection.escape(
    pageObj["content"]
  )})`;
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(`Inserted ${pageObj["url"]} successfully!`);
  });
}

async function getResults(query) {
  var sql = `SELECT id, url, title, MATCH(content) AGAINST (${connection.escape(
    query
  )} IN NATURAL LANGUAGE MODE) AS score FROM pages ORDER BY score DESC;`;

  connection.query(sql, function (err, result) {
    if (err) throw err;
    return result;
  });
}

module.exports = {
  insertPage: insertPage,
  getResults: getResults,
};
