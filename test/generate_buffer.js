const puppeteer = require('puppeteer');
const fs = require("fs");
const path = require('path');
const getStdin = require('get-stdin');

(async () => {
	const browser = await puppeteer.launch({'args':['--allow-file-access-from-files','--no-sandbox'],'headless':true});
	// var testjson = await getStdin()
	// var testinfo = JSON.parse(testjson)
	var generator = process.argv[2];
	var options = Object.fromEntries(process.argv[3].split(/(?<!\\),/).map(x => {return x.split(/(?<!\\)=/)}));
	var text = process.argv.slice(4).join(" ");
	options = Object.assign(options, {"main-text": text})
	console.log(options)
	const indexURL = 'file://' + path.resolve(__dirname,'../index.html') + '#' + generator;
	const page = await browser.newPage();
	await page.goto(indexURL)
	var output={}
	await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './'});
	await page.evaluate("fontInfo.scale=1")
	await page.waitForFunction(
		info => setOptions(info),
		{}, options
	)
	await page.evaluate('renderText()');
	var image = await page.evaluate('getDataURLImage()')
	var imageData = Buffer.from(image.split(",", 2)[1], "base64")
	await page.close();
	await browser.close();
	fs.writeFile("output.png", imageData, (err) => {
		if (err) {
			console.log("failed to save image")
			throw err
		};
	});
	//console.log(JSON.stringify(results))
})();
