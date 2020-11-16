const { Worker, isMainThread, parentPort } = require("worker_threads");
const axios = require("axios");
const cheerio = require("cheerio");
const url = "https://www.crawler-test.com";

/*
 * Workflow
 * 1. Create a list of pages to scrape
 * 2. Iterate over all pages and put page data into DB
 * 3. Add links from each page to the queue
 * 4. Set max depth so you don't just keep adding pages to the database
 *
 * Create a worker for database.js to store data into the DB
 */

var queue = [];

fetchData(url).then((res) => {
  const html = res.data;
  const $ = cheerio.load(html);
  const links = $("a");
  links.filter("canonical").attr("rel");
  links.each((i, el) => {
    queue[i] = $(el).attr("href");
  });
  // console.log(queue.join("\n"));
  console.log($("*").html());
});

async function fetchData(url) {
  console.log(`Crawling ${url}...`);
  let response = await axios(url).catch((err) => console.log(err));

  if (response.status !== 200) {
    console.log("Response was not 200. Aborting.");
    return;
  }
  return response;
}

// if (isMainThread) {
//   const worker = new Worker(__filename);
//   worker.once("message", (message) => {
//     console.log(message);
//   });
//   worker.postMessage("Main Thread: Hello!");
// } else {
//   parentPort.once("message", (message) => {
//     console.log(message);
//     parentPort.postMessage("Worker Thread: Hi there!");
//   });
// }
