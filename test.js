const getData = require("./crawler.js");
const { getResults } = require("./database.js");
const db = require("./database.js");

(async () => {
  const query = "python for loop";
  const results = await getResults(query);
  console.log("Query results", results);
})();

// const axios = require("axios");
// const cheerio = require("cheerio");

// axios.get("http://www.w3schools.com").then((response) => {
//   // console.log(response);
//   var $ = cheerio.load(response.data);
//   $(".w3-code").remove();
//   var data = $("body").text();
//   data.trim();
//   console.log(data);
// });
