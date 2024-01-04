import { JSDOM } from "jsdom";

export async function crawlPage(baseURL, currentUrl, pages = {}) {
  const baseUrlobject = new URL(baseURL);
  const currentUrlobject = new URL(currentUrl);

  if (baseUrlobject.hostname !== currentUrlobject.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentUrl);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }
  pages[normalizedCurrentURL] = 1;

  console.log(`Actively crawling: ${currentUrl}`);

  try {
    const response = await fetch(currentUrl);
    if (response.status > 399) {
      console.log(`Error in downloading with the status ${response.status}`);
      return pages;
    }
    const contentType = response.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(`Non HTML response type on page ${currentUrl}`);
      return pages;
    }

    const htmlBody = await response.text();

    const nextURLs = getURLfromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  return pages;
}

function getURLfromHTML(htmlBody, baseUrl) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      try {
        const urlObject = new URL(`${baseUrl}${linkElement.href}`);
        urls.push(urlObject.href); //relative url
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const urlObject = new URL(linkElement.href);
        urls.push(urlObject.href); //absolute url
      } catch (error) {
        console.log(error);
      }
    }
  }
  return urls;
}

export function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  } else {
    return hostPath;
  }
}
