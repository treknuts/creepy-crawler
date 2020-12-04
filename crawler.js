var request = require("request");
var cheerio = require("cheerio");
const db = require("./database");
const fs = require("fs");

const data = [];

const pages = JSON.parse(fs.readFileSync("pages.json", { encoding: "utf-8" }));

var MAX_PAGES_TO_VISIT = 4;

var pagesVisited = {};
var numPagesVisited = 0;
var pagesToVisit = [];

pages.forEach((page) => {
  pagesToVisit.push(page);
});

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
    nextPage.files.forEach((file) => {
      visitPage(nextPage, nextPage.baseUrl + file, crawl);
    });
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
  console.log(
    "Found " + relativeLinks.length + " relative links on " + page.baseUrl
  );
  relativeLinks.each((idx, file) => {
    var fileToAdd = file.attribs["href"];
    page.files.push(fileToAdd);
    console.log(fileToAdd);
  });
}
