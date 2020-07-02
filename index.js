const puppeteer = require('puppeteer');
let tickers = ["CBA.AX", 
"QAN.AX", 
"TSLA", 
"CSL.AX", 
"SCG.AX", 
"NAB.AX", 
"TLS.AX",
"BHP.AX"
];

async function runPuppet(ticker){

    let url = "https://au.finance.yahoo.com/";

    let browser = await puppeteer.launch({headless: true});
    let page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });
	await page.type("input[id='yfin-usr-qry']", ticker);
    await page.click("button[id='search-button'");
    await page.waitForNavigation({waitUntil: 'networkidle2'});
    

    let data = await page.evaluate(() => {

        let header = document.querySelector('div[id="quote-header-info"]');

        let spans = header.children[2].firstChild.querySelectorAll('span');
        let price = spans[0].innerText;
        let movements = spans[1].innerText.split(' ');
        let movementAmount = movements[0];
        let movementPercent = movements[1];

        let companyName = header.querySelector('h1').innerText;

        return {
            companyName,
            price,
            movementAmount,
            movementPercent
        };
    });
    data.ticker = ticker;

    console.log(data);

    await browser.close();

};

tickers.forEach(ticker => runPuppet(ticker));