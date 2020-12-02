const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const db = require("./database");
const fs = require("fs");
require("dotenv").config();

const uri = process.env.MONGO_URI;

const maxDepth = 3;

const data = {};

function crawl(pages, search, depth) {
  /*
   * 1) Store the html of the first 10 links for each page
   */

  pages.forEach((page) => {
    axios(page)
      .then((res) => {
        const html = res.data;
        const $ = cheerio.load(html);
      })
      .catch((err) => console.log(err));
  });
}

const pages = fs.readFileSync("pages.json", { encoding: "utf-8" });

crawl(JSON.parse(pages), "blah");
