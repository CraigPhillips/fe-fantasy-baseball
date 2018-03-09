const _ = require('privatize')();
const puppeteer = require('puppeteer');

const yahooLeagueUrlPrefix = 'https://baseball.fantasysports.yahoo.com/league/';

async function getBrowser(league) {
  if (!_(league).browser) {
    _(league).browser = await _(league).browserFactory.launch();
  }

  return _(league).browser;
}

class YahooFantasyBaseballLeague {
  constructor(leagueName, browserFactory = puppeteer) {
    if (!leagueName) throw new Error('league name is required');

    _(this).browserFactory = browserFactory;
    _(this).leagueName = leagueName;
  }

  async dispose() {
    const browser = await getBrowser(this);
    await browser.close();
  }

  async getLeagueInfo() {
    const browser = await getBrowser(this);
    const page = await browser.newPage();
    await page.goto(`${yahooLeagueUrlPrefix}${_(this).leagueName}`);
    await page.$eval('#login-username', el => el.value = '');
    await page.$eval('#login-signin', el => el.click());
    await page.waitForSelector('#login-passwd');
    await page.$eval('#login-passwd', el => el.value = '');
    await page.$eval('#login-signin', el => el.click());
    await page.waitForSelector('a[data-slk=Players]');
    await page.$eval('a[data-slk=Players]', el => el.click());
    await page.waitForSelector('input[name=search]');
    await page.$eval('input[name=search]', el => el.value='Trea Turner');
    await page.$eval('input[type=submit][value=Search]', el => el.click());
    await page.waitForSelector('a.Nowrap.name.F-link');
    const description = await page.evaluate(() => document.querySelector('.ysf-player-name span').textContent);
    console.log(description);

    await page.screenshot({ path: 'test.png'});

    return {
      test: 'wat',
    };
  }
};

module.exports = YahooFantasyBaseballLeague;