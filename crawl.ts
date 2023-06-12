import axios from "axios";
import moment from 'moment'
import { parse } from 'node-html-parser'

/**
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2023/races.html
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2022/races.html
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2022/drivers.html
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2023/drivers.html
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2023/team.html
 * 
 */

const fromYear = 1950
const toYear = moment().year()

export interface IRaceResult {
  GRAND_PRIX?: string 
  DATE?: string 
  WINNER?: string 
  CAR?: string 
  LAPS?: number
}

const main = async () => {
  const resp = await axios.get('https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2023/races.html')
  const htmls = parse(resp.data)
  const tableBody = htmls.getElementsByTagName('tbody')
  const data: IRaceResult[] = tableBody[0].getElementsByTagName('tr').map(tr => {
    console.log(tr.querySelector('.bold .hide-for-mobile')?.innerText);
    return {
      GRAND_PRIX: tr.querySelectorAll('.dark .bold .ArchiveLink')[0]?.innerText,
      DATE: tr.querySelector('.dark .hide-for-mobile')?.innerText, 
      WINNER: tr.querySelector('.hide-for-mobile')?.innerText, 
      CAR: tr.querySelector('.semi-bold .uppercase')?.innerText, 
      LAPS: parseInt(tr.querySelector('.bold .hide-for-mobile')?.innerText || '0'),
    }
  })
  console.log(data);
}

main()