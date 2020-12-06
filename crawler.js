const axios = require("axios");
const cheerio = require("cheerio");
const pages = ["http://www.w3schools.com", "http://www.arstechnica.com"];

const MAX_PAGES = 10;
let data = [];

async function crawl(url) {
  try {
    const results = await axios.get(url);

    if (results.status === 200) {
      const $ = cheerio.load(results.data, {
        xml: {
          normalizeWhitespace: true,
        },
      });

      await collectInternalLinks($, url);

      let obj = {
        url: url,
        title: $("title").text(),
        pageData: $("body").text().trim().toLowerCase(),
      };
      data.push(obj);
    }
  } catch (err) {
    console.log(err);
  }
}

async function collectInternalLinks($, url) {
  var relativeLinks = $("a[href^='/']");
  console.log("Found " + relativeLinks.length + " relative links on page");
  relativeLinks.each(function () {
    pages.push(url + $(this).attr("href"));
  });
}

async function getData() {
  var i;
  for (i = 0; i < MAX_PAGES; i++) {
    await crawl(pages[i]);
  }
  console.log(data.length);
}

getData();
