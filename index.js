const puppeteer = require("puppeteer");
let tickers = ["CBA.AX", /*"QAN.AX", "TSLA", "CSL.AX", "SCG.AX", "NAB.AX", "TLS.AX", "BHP.AX"*/];

async function runPuppet(ticker) {
	let url = "https://au.finance.yahoo.com/";

	let data = {};
	data.ticker = ticker;

	let browser = await puppeteer.launch({ headless: true });
	let page = await browser.newPage();

	await page.goto(url, { waitUntil: "networkidle2" });
	await page.type("input[id='yfin-usr-qry']", ticker);
	await page.click("button[id='search-button']" );
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    
	let summaryData = await page.evaluate(() => {
		let header = document.querySelector('div[id="quote-header-info"]');
		let companyName = header.querySelector("h1").innerText;

		let spans = header.children[2].firstChild.querySelectorAll("span");
		let price = spans[0].innerText;
		let movements = spans[1].innerText.split(" ");
		let movementAmount = movements[0];
		let movementPercent = movements[1];

		let quoteSummary = document.querySelector("#quote-summary");
		let leftTable = quoteSummary.children[0].firstChild;
		let rightTable = quoteSummary.children[1].firstChild;
		let rightTableTDs = Array.from(rightTable.querySelectorAll("td"));
		let ttmPELabel = rightTableTDs.find((e) => e.innerText == "PE ratio (TTM)");
		let ttmPEValue = ttmPELabel.parentElement.children[1].innerText;

		let ttmEPSLabel = rightTableTDs.find((e) => e.innerText == "EPS (TTM)");
		let ttmEPSValue = ttmEPSLabel.parentElement.children[1].innerText;

        let buttons = document.querySelector("#quote-nav").querySelectorAll('li');
		/*QuoteNav Mappings
        0 = Summary
        1 = Chart
        2 = Statistics
        3 = Historical data
        4 = Profile
        5 = Financials 
        6 = Analysis
        7 = Options
        8 = Holders
        9 = Sustainability
    */
        buttons[6].setAttribute("data-scraper-id", "scraper-analysis");
        
		

		return {
			companyName,
			price,
			movementAmount,
			movementPercent,
			ttmPEValue,
			ttmEPSValue,
		};
    });
    //console.log(summaryData);
    
    await page.click('li[data-scraper-id="scraper-analysis"]');

    
    await page.waitForSelector('section[data-test="qsp-analyst"]');

    let analysisData = await page.evaluate(() => {
        let tableDataElements = Array.from(document.querySelectorAll('td'));
        let fiveYearGrowthLabel = tableDataElements.find((e) => e.innerText == "Next 5 years (per annum)");
        let fiveYearGrowthValue = fiveYearGrowthLabel.parentElement.children[1].innerText;


        return {
			growth: fiveYearGrowthValue
		};
    });
    //console.log(analysisData);

    for(var prop in summaryData)
        data[prop] = summaryData[prop];

    for(var prop in analysisData)
        data[prop] = analysisData[prop];

    console.log(data);


	await browser.close();
}

tickers.forEach(async (ticker) => {
	await runPuppet(ticker);
});
