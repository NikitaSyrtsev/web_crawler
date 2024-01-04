import { crawlPage } from "./crawl.js";

async function main() {
  if (process.argv.length == 3) {
    const baseUrl = process.argv[2];
    console.log("--------------------");
    const pages = await crawlPage(baseUrl, baseUrl, {});

    for (page of Object.entries(pages)) {
      console.log(page);
    }
  } else {
    console.log("Error");
    process.exit(1);
  }
}

main();
