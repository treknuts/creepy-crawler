const axios = require("axios");
const cheerio = require("cheerio");
const insertPage = require("./database.js");
const db = require("./database.js");

const pages = ["http://www.codecademy.com", "http://www.edx.org"];
const MAX_PAGES = 500;

async function crawl(url) {
  try {
    const results = await axios.get(url);

    if (results.status === 200) {
      const $ = cheerio.load(results.data);
      var title = $("title").text();
      var content = $("body").text();
      content.trimEnd();
      content.trimStart();

      let obj = {
        url: url,
        title: title,
        content: content,
      };
      db.insertPage(obj);
      // insertPage(obj);
      await collectInternalLinks($, url);
    }
  } catch (err) {
    console.log("Oopsies! Response status wasn't 200 :(", err);
  }
}

async function collectInternalLinks($, url) {
  var relativeLinks = $("a[href^='/']");
  console.log("Found " + relativeLinks.length + " relative links on page");
  relativeLinks.each(function () {
    if (!pages.includes(url + $(this).attr("href"))) {
      pages.push(url + $(this).attr("href"));
    }
  });
}

async function getData() {
  var i;
  for (i = 0; i < MAX_PAGES; i++) {
    console.log(pages[i]);
    await crawl(pages[i]);
  }
}

// USE THIS TO GET DATA OUT OF ASYNC FUNCTION
// (async () => {
//   console.log(await getData());
// })();

module.exports = getData;
