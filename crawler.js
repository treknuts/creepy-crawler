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

var query = "How much wood does the wood chuck chuck";

var document1 =
  "If a wood chuck could chuck wood would a wood chuck wood chuck wood";

var document2 = "The quick brown fox does some shit";

var document3 = "A wood chipper chips wood";

var documents = [document1, document2, document3];

sims = textProcessor.similaritiesFromText(query, documents);
console.log(sims);

// crawl(sites);
