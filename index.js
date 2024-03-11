const playwright = require('playwright');
const fs = require('fs');
const https = require('https');


module.exports = {
    runBrowser: (async () => {

        const browser = await playwright.chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://www.rijksoverheid.nl');
        const products = await page.$$eval('div.brick', all_bricks => {
            const data = [];
            all_bricks.forEach(brick => {
                const title = brick.querySelector('h3')?.textContent;
                const caption = brick.querySelector('.brick-text p')?.textContent;
                data.push({ title, caption })
            });
       return data;
   })
   console.log(products)
   await browser.close()
    })
};

module.exports.runBrowser();