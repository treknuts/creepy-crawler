// const axios = require("axios");
// const cheerio = require("cheerio");
// const { response } = require("express");
//  const db = require("./database");
//  const fs = require("fs");
// const { normalize } = require("path");
// require("dotenv").config();

// const uri = process.env.MONGO_URI;

// const maxDepth = 3;

// const data = [];

// function crawl(pages, search, depth) {
//   pages.forEach((page) => {
//     var obj = {
//       url: page.url,
//       title: page.name,
//       description: page.description,
//     };
//     axios(page)
//       .then((res) => {
//         const html = res.data;
//         const $ = cheerio.load(html, {
//           xml: {
//             normalizeWhitespace: true,
//           },
//         });
//         const pageData = $("*").text();
//         obj["pageData"] = pageData;
//         console.log(obj);
//         data.push(obj);
//       })
//       .catch((err) => console.log(err));
//   });
// }

// const pages = JSON.parse(fs.readFileSync("pages.json", { encoding: "utf-8" }));

// crawl(JSON.parse(pages), "blah");

// console.log(data);

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var request = require("request");
var cheerio = require("cheerio");
var URL = require("url-parse");
const db = require("./database");
const fs = require("fs");

const data = [];

const pages = JSON.parse(fs.readFileSync("pages.json", { encoding: "utf-8" }));

var MAX_PAGES_TO_VISIT = 5;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];

pages.forEach((page) => {
  // page.files.forEach((file) => {
  //   pagesToVisit.push(page.baseUrl + file);
  // });
  pagesToVisit.push(page);
});

// console.log(pagesToVisit);

crawl();

function crawl() {
  if (numPagesVisited >= MAX_PAGES_TO_VISIT) {
    console.log("Reached max limit of number of pages to visit.");
    return;
  }
  var nextPage = pagesToVisit.pop();
  if (nextPage in pagesVisited) {
    // We've already visited this page, so repeat the crawl
    crawl();
  } else {
    // New page we haven't visited
    console.log(nextPage);
    nextPage.files.forEach((file) => {
      console.log(nextPage.baseUrl + file);
      visitPage(nextPage, nextPage.baseUrl + file, crawl);
    });
    // visitPage(page.baseUrl, crawl);
  }
}

function visitPage(page, url, callback) {
  // Add page to our set
  pagesVisited[url] = true;
  numPagesVisited++;
  // Make the request
  console.log("Visiting page " + url);
  request(url, function (error, response, body) {
    // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if (response.statusCode !== 200) {
      callback();
      return;
    }

    // Parse the document body
    var $ = cheerio.load(body);

    const pageData = $("*").text();
    collectInternalLinks(page, $);
  });
  crawl();
}

function collectInternalLinks(page, $) {
  var relativeLinks = $("a[href^='/']");
  console.log("Found " + relativeLinks.length + " relative links on page");
  relativeLinks.each((file) => {
    // pagesToVisit.push(baseUrl + $(this).attr('href'));
    page.files.push(file);
  });
}
