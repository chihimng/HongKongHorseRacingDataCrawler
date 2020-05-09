import puppeteer from 'puppeteer'
import { promisify } from 'util'
import fs from 'fs'
const sleep = promisify(setTimeout)
const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

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
            // break // for debug
        }
        await mkdir('./output/', { recursive: true })
        await writeFile('./output/horseRefs.json', JSON.stringify(horseRefs, null, 2), { flag: 'w' })
        const raceRecords:Object[] = []
        const horseRecords:Object[] = []
        for (let horseRef of horseRefs) {
            console.log(`Fetching horse ${horseRef}`)
            await page.goto(`https://racing.hkjc.com${horseRef}&Option=1`) // "Show All" option
            await page.waitForSelector('table[class="horseProfile"]')
            const raceRecordHeaders = await page.$$eval('td[class="hsubheader"]', (elems => elems.map(elem => elem.textContent?.replace(/^\s+/, '').replace(/\s+$/, '') ?? '')))
            const raceRecordCells = await page.$$eval('td[class="htable_eng_text"]', (elems => elems.map(elem => elem.textContent?.replace(/^\s+/, '').replace(/\s+$/, '') ?? '')))
            // TODO: parse and save horse info (e.g. sire, dam) => cross check what's available for future races
            let raceRecord:{[key: string]: string} = {}
            for (let i = 0; i < raceRecordCells.length; ++i) {
                raceRecord[raceRecordHeaders[i % raceRecordHeaders.length]] = raceRecordCells[i]
                if (i % raceRecordHeaders.length === raceRecordHeaders.length - 1) {
                    raceRecords.push(raceRecord)
                    raceRecord = {}
                }
            }
            const horseRecordCells = await page.$$eval('table[class="table_eng_text"] td', (elems => elems.map(elem => elem.textContent?.replace(/^\s+/, '').replace(/\s+$/, '') ?? ''))) 
            let horseRecord:{[key:string]: string} = {}
            for (let i = 2; i < horseRecordCells.length; i += 3) {
                horseRecord[horseRecordCells[i - 2]] = horseRecordCells[i]
            }
            horseRecords.push(horseRecord)
            console.log(`Found ${raceRecords.length} race records`)
            console.log(`Found ${horseRecords.length} horse records`)
            await sleep(500)
            // break // for debug
        }
        await writeFile('./output/raceRecords.json', JSON.stringify(raceRecords, null, 2), { flag: 'w' })
        await writeFile('./output/horseRecords.json', JSON.stringify(horseRecords, null, 2), { flag: 'w' })
    } catch (e) {
        console.error(e)
    } finally {
        await page.close()
        await browser.close()
    }
}

main()
