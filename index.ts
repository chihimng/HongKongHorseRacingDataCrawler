import puppeteer from 'puppeteer'
import { promisify } from 'util'
import fs from 'fs'
const sleep = promisify(setTimeout)
const writeFile = promisify(fs.writeFile)

async function main () {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    try {
        // get horse page refs in index
        const horseRefs:(String|null)[] = []
        for (let char of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
            console.log(`Fetching index ${char}`)
            const indexUrl = `https://racing.hkjc.com/racing/information/english/Horse/SelectHorsebyChar.aspx?ordertype=${char}`
            await page.goto(indexUrl)
            await page.waitForSelector('li a[class="table_eng_text"]')
            const length = horseRefs.push(...await page.$$eval('li a[class="table_eng_text"]', elems => elems.map(elem => elem.getAttribute('href')))) 
            console.log(`Found ${length} links`)
            await sleep(500)
        }
        await writeFile('./horseRefs.json', JSON.stringify(horseRefs))
        for (let horseRef of horseRefs) {
            await page.goto(`https://racing.hkjc.com${horseRef}&Option=1`) // "Show All" option
            await page.waitForSelector('table[class="bigborder"]')
            const headers = await page.$$eval('table[class="bigborder"] tr td[class="hsubheader"]', (elems => elems.map(elem => elem.textContent)))
            const cells = await page.$$eval('table[class="bigborder"] tr td[class="htable_eng_text"]', (elems => elems.map(elem => elem.textContent)))
            // TODO: save as record rows
            // TODO: parse horse info (e.g. sire, dam) => cross check what's available for future races
        }
    } catch (e) {
        console.error(e)
    } finally {
        await page.close()
        await browser.close()
    }
}

main()
