const puppeteer = require('puppeteer');

(async () => {

    let url = "https://www.imdb.com/title/tt2575988/?ref_=nv_sr_srsg_0";

    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto(url);


})();