const puppeteer = require('puppeteer');

(async () => {

    let url = "https://www.imdb.com/title/tt2575988/?ref_=nv_sr_srsg_0";

    let browser = await puppeteer.launch();
    let page = await browser.newPage();

    await page.goto(url, {waitUntil: 'networkidle2'});

    let data = await page.evaluate(() => {
        let title = document.querySelector('div[class="title_wrapper"] > h1').innerText.trim();
        let rating = document.querySelector('span[itemprop="ratingValue"]').innerText;
        let ratingCount = document.querySelector('span[itemprop="ratingCount"]').innerText;

        return {
            title,
            rating,
            ratingCount
        };
    });
})();