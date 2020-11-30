const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./database");
const textProcessor = require("./preprocessor");

function crawl(pages, search) {
  pages.forEach((page) => {
    axios(page)
      .then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        console.log(`${page} - ${$("title").text()}`);
      })
      .catch((err) => console.log(err));
  });
}

// sims = textProcessor.similaritiesFromText(query, documents);
// console.log(sims);

// crawl(sites);
