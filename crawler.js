const axios = require("axios");
const cheerio = require("cheerio");
const insertPage = require("./database.js");
const db = require("./database.js");
const pages = [
  "http://www.stackoverflow.com",
  "http://www.codecademy.com",
  "https://tympanus.net/codrops/",
];

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
      insertPage(obj);
      // data.push(obj);
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
    pages.push(url + $(this).attr("href"));
  });
}

async function getData() {
  var i;
  for (i = 0; i < MAX_PAGES; i++) {
    await crawl(pages[i]);
  }
}

// USE THIS TO GET DATA OUT OF ASYNC FUNCTION
// (async () => {
//   console.log(await getData());
// })();

module.exports = getData;
