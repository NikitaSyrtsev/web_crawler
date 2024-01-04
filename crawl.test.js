import { normalizeURL, getURLfromHTML } from "./crawl";
import { test, expect } from "@jest/globals";

test("normalizeURL", () => {
  const input = "https://www.youtube.com/account";
  const actual = normalizeURL(input);
  const expected = "www.youtube.com/account";
  expect(actual).toEqual(expected);
});

test("normalizeURL slashSign", () => {
  const input = "https://www.youtube.com/account/";
  const actual = normalizeURL(input);
  const expected = "www.youtube.com/account";
  expect(actual).toEqual(expected);
});

test("getURLfromHTML absolute", () => {
  const inputHTML = `
  <html>
    <body>
      <a href="https://www.youtube.com/account/">
      </a>
    </body>
  </html>
  
  `;

  const inputURL = "https://www.youtube.com/account/";
  const actual = getURLfromHTML(inputHTML, inputURL);
  const expected = ["https://www.youtube.com/account/"];
  expect(actual).toEqual(expected);
});

test("getURLfromHTML relative", () => {
  const inputHTML = `
  <html>
    <body>
      <a href="/account/">
      </a>
    </body>
  </html>
  
  `;

  const inputURL = "https://www.youtube.com";
  const actual = getURLfromHTML(inputHTML, inputURL);
  const expected = ["https://www.youtube.com/account/"];
  expect(actual).toEqual(expected);
});

test("getURLfromHTML both", () => {
  const inputHTML = `
  <html>
    <body>
      <a href="/account/"></a>
      <a href="https://www.youtube.com/account1/"></a>
    </body>
  </html>
  
  `;

  const inputURL = "https://www.youtube.com";
  const actual = getURLfromHTML(inputHTML, inputURL);
  const expected = [
    "https://www.youtube.com/account/",
    "https://www.youtube.com/account1/",
  ];
  expect(actual).toEqual(expected);
});
