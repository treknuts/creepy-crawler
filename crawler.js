const axios = require("axios");
const cheerio = require("cheerio");
const db = require("./database");

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

crawl(sites);
