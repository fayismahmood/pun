import axios from 'axios'
import { DOMParser, parseHTML } from 'linkedom';
import fs from 'fs'
import chalk from 'chalk';
import cliProgress from 'cli-progress'

const endPoint = `https://en.wikipedia.org/wiki/Special:AllPages/`
const getByLetter = (letter: string) => {
    return `${endPoint}${letter}`
}

async function ScrapeLetterIndexPage(letter: string) {
    chalk.blue(`${letter} letter page scrape started`)
    const res = await axios.get(getByLetter(letter))

    const { document, } = parseHTML(res.data)

    const allSubs = document.querySelector(`.mw-allpages-body`)?.querySelectorAll(`li>a`)
    const toArr = allSubs ? Array.from(allSubs).map(e => {
        return {
            href: e.getAttribute(`href`),
            text: e.textContent
        }
    }) : null

    chalk.blue(`Scraped ${letter} index page; ${toArr?.length} pages are found`)
    return toArr
}


async function scrape(url: string) {
    chalk.green(`Scraping ${url}...`)
    const res = await axios.get(url)
    const { document, } = parseHTML(res.data)

    const content = document.querySelector(`.mw-parser-output`)
    const AllPs = Array.from(content?.querySelectorAll(`p`) || [])
    const toInp = AllPs.map(e => ({
        output: e.textContent?.replace(/\[(.*)?\]/g, ""),
        input: e.textContent?.replace(/\[(.*)?\]/g, "").replace(/[\.,\,,\",\n]/g, "")
    }))
    chalk.green(`Writing ${url} to file.....`)
    fs.writeFileSync(`./data/${url.split(`/`).pop()}.json`, JSON.stringify(toInp))
    chalk.green(`${url} scraped `)

}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const letterArr = ['B']
async function run() {
    chalk.green(`Scraping started`)

    letterArr.forEach(async (letter) => {
        const indexPage = await ScrapeLetterIndexPage(letter)

        const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        bar1.start(indexPage?.length, 0);
        indexPage?.forEach(async (e) => {
            console.log(e);
            
            await scrape(`https://en.wikipedia.org${e.href}`)
            bar1.increment();
            await sleep(2000);
        })
        bar1.stop();
    })

}
//scrape(`https://en.wikipedia.org/wiki/Lapsed_Catholic`)

run().then(() => {
    chalk.green(`Scraping completed`)
})