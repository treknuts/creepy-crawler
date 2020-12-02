const axios = require("axios");
const cheerio = require("cheerio");
const { response } = require("express");
const db = require("./database");
const fs = require("fs");
const { normalize } = require("path");
require("dotenv").config();

const uri = process.env.MONGO_URI;

const maxDepth = 3;

const data = [];

function crawl(pages, search, depth) {
  pages.forEach((page) => {
    var obj = {
      url: page.url,
      title: page.name,
      description: page.description,
    };
    axios(page)
      .then((res) => {
        const html = res.data;
        const $ = cheerio.load(html, {
          xml: {
            normalizeWhitespace: true,
          },
        });
        const pageData = $("*").text();
        obj["pageData"] = pageData;
        console.log(obj);
        data.push(obj);
      })
      .catch((err) => console.log(err));
  });
}

const pages = fs.readFileSync("pages.json", { encoding: "utf-8" });

crawl(JSON.parse(pages), "blah");

console.log(data);
