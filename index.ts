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
        const horseRefs:string[] = []
        for (let char of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
            console.log(`Fetching index ${char}`)
            const indexUrl = `https://racing.hkjc.com/racing/information/english/Horse/SelectHorsebyChar.aspx?ordertype=${char}`
            await page.goto(indexUrl)
            await page.waitForSelector('li a[class="table_eng_text"]')
            horseRefs.push(...await page.$$eval('li a[class="table_eng_text"]', elems => elems.map(elem => elem.getAttribute('href') ?? ''))) 
            console.log(`Found ${horseRefs.length} links`)
            await sleep(500)
            break // for debug
        }
        await writeFile('./output/horseRefs.json', JSON.stringify(horseRefs))
        const raceRecords:Object[] = []
        for (let horseRef of horseRefs) {
            console.log(`Fetching horse ${horseRef}`)
            await page.goto(`https://racing.hkjc.com${horseRef}&Option=1`) // "Show All" option
            await page.waitForSelector('table[class="bigborder"]')
            const headers = await page.$$eval('table[class="bigborder"] tr td[class="hsubheader"]', (elems => elems.map(elem => elem.textContent ?? '')))
            const cells = await page.$$eval('table[class="bigborder"] tr td[class="htable_eng_text"]', (elems => elems.map(elem => elem.textContent ?? '')))
            // TODO: parse and save horse info (e.g. sire, dam) => cross check what's available for future races
            let raceRecord : { [key: string]: string } = {}
            for (let i = 0; i < cells.length; ++i) {
                raceRecord[headers[i % headers.length]] = cells[i].replace(/^\s+/, '').replace(/\s+$/, '')
                if (i % headers.length === headers.length - 1) {
                    raceRecords.push(raceRecord)
                    raceRecord = {}
                }
            }
            console.log(`Found ${raceRecords.length} race records`)
            await sleep(500)
            break // for debug
        }
        await writeFile('./output/raceRecords.json', JSON.stringify(raceRecords))
    } catch (e) {
        console.error(e)
    } finally {
        await page.close()
        await browser.close()
    }
}

main()
