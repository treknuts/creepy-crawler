const axios = require("axios");
const cheerio = require("cheerio");

const sites = [
  "http://www.freecodecamp.org",
  "http://www.stackoverflow.com",
  "http://www.codecademy.com/catalog",
  "http://www.w3schools.com",
  "http://www.edx.org",
];

function crawl(pages) {
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
