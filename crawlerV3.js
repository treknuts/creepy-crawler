var request = require("request");
var cheerio = require("cheerio");
var URL = require("url-parse");
const fs = require("fs");

const pages = JSON.parse(fs.readFileSync("pages.json", { encoding: "utf-8" }));
var data = gatherPageData();
console.log(data);

function gatherPageData() {
  var data = [];
  pages.forEach((page) => {
    var START_URL = page.baseUrl;
    var MAX_PAGES_TO_VISIT = 10;

    var pagesVisited = {};
    var numPagesVisited = 0;
    var pagesToVisit = [];
    var url = new URL(START_URL);
    var baseUrl = url.protocol + "//" + url.hostname;

    pagesToVisit.push(START_URL);
    var data = crawl();

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
        var $ = cheerio.load(body);
        var bodyText = $("html > body").text().toLowerCase();
        var title = $("title").text();
        var pageObj = { url: url, title: title, pageData: bodyText };
        data.push(pageObj);
        collectInternalLinks($);
        // In this short program, our callback is just calling crawl()
        callback();
      });
    }

    function collectInternalLinks($) {
      var relativeLinks = $("a[href^='/']");
      console.log("Found " + relativeLinks.length + " relative links on page");
      relativeLinks.each(function () {
        pagesToVisit.push(baseUrl + $(this).attr("href"));
      });
    }
  });
  return data;
}
