var request = require("request");
var cheerio = require("cheerio");
var URL = require("url-parse");
const fs = require("fs");

var MAX_PAGES_TO_VISIT = 3;

const data = {};

const pages = JSON.parse(fs.readFileSync("pages.json", { encoding: "utf-8" }));

pages.forEach((page) => {
  var START_URL = page.baseUrl;

  var pagesVisited = {};
  var numPagesVisited = 0;
  var pagesToVisit = [];
  var url = new URL(START_URL);
  var baseUrl = url.protocol + "//" + url.hostname;

  pagesToVisit.push(START_URL);
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
      visitPage(nextPage, crawl);
    }
    console.log(data);
  }

  function visitPage(url, callback) {
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
      var $ = cheerio.load(body, {
        xml: {
          normalizeWhitespace: true,
        },
      });
      var bodyText = $("html > body").text().toLowerCase();
      data[url] = bodyText;
      collectInternalLinks($);
      // In this short program, our callback is just calling crawl()
      callback();
    });
  }

  //   function searchForWord($, word) {
  //     var bodyText = $("html > body").text().toLowerCase();
  //     return bodyText.indexOf(word.toLowerCase()) !== -1;
  //   }

  function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page");
    relativeLinks.each(function () {
      pagesToVisit.push(baseUrl + $(this).attr("href"));
    });
  }
});
