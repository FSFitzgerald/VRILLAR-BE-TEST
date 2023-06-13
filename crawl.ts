import axios from "axios";
import moment from "moment";
import { parse } from "node-html-parser";
import fs from 'fs'

/**
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2023/races.html
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2022/races.html
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2022/drivers.html
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2023/drivers.html
 * https://www.formula1.com/en/results/jcr:content/resultsarchive.html/2023/team.html
 *
 */

export interface IRaceResult {
  YEAR: number;
  GRAND_PRIX?: string;
  DATE?: string;
  WINNER?: string;
  CAR?: string;
  LAPS?: number;
  TIME: string;
}

export interface IDriverResult {
  YEAR: number;
  POS: number;
  DRIVER: string;
  NATIONALITY: string;
  CAR: string;
  PTS: number;
}

export interface ITeamResult {
  YEAR: number 
  POS: number 
  TEAM: string 
  PTS: number
}

const main = async () => {
  const fromYear = 1950;
  const toYear = moment().year();

  //crawl races data
  const racesData: IRaceResult[] = [];
  const racesDataPromises = Array(toYear - fromYear + 1)
    .fill(0)
    .map((_, idx) => fromYear + idx)
    .map(async (year) => {
      const resp = await axios.get(
        `https://www.formula1.com/en/results/jcr:content/resultsarchive.html/${year}/races.html`
      );
      const htmls = parse(resp.data);
      const tableBody = htmls.getElementsByTagName("tbody");
      tableBody[0].getElementsByTagName("tr").forEach((tr) => {
        racesData.push({
          YEAR: year,
          GRAND_PRIX: tr
            .querySelectorAll("a")[0]
            .innerText.replace("\n", "")
            .trimStart()
            .trimEnd(),
          DATE: tr.querySelector(".hide-for-mobile")?.innerText,
          WINNER: tr.querySelector(".dark .hide-for-mobile")?.innerText,
          CAR: tr.querySelector(".semi-bold")?.innerText,
          LAPS: parseInt(tr.getElementsByTagName("td")[5]?.innerText || "0"),
          TIME: tr.querySelectorAll("td")[6].innerText,
        });
      });
    });

  await Promise.all(racesDataPromises);
  // console.log(racesData);
  fs.writeFileSync('races.json', JSON.stringify(racesData))

  //crawl driver data
  const driversData: IDriverResult[] = [];
  const driversDataPromises = Array(toYear - fromYear + 1)
    .fill(0)
    .map((_, idx) => fromYear + idx)
    .map(async (year) => {
      const resp = await axios.get(
        `https://www.formula1.com/en/results/jcr:content/resultsarchive.html/${year}/drivers.html`
      );
      const htmls = parse(resp.data);
      const tableBody = htmls.getElementsByTagName("tbody");
      tableBody[0].getElementsByTagName("tr").forEach((tr) => {
        driversData.push({
          YEAR: year,
          POS: parseInt(tr.getElementsByTagName("td")[1].innerText || "0"),
          DRIVER:
            tr.querySelector(".hide-for-tablet")?.innerText +
            " " +
            tr.querySelector(".hide-for-mobile")?.innerText,
          NATIONALITY: tr.getElementsByTagName("td")[3].innerText,
          CAR: tr.querySelectorAll("a")[1].innerText,
          PTS: parseInt(tr.getElementsByTagName("td")[5].innerText || "0"),
        });
      });
    });

  // await Promise.all(driversDataPromises);
  // console.log(driversData);
  // fs.writeFileSync('drivers.json', JSON.stringify(driversData))

  //crawl team data
  const teamsData: ITeamResult[] = [];
  const teamsDataPromises = Array(toYear - fromYear + 1)
    .fill(0)
    .map((_, idx) => fromYear + idx)
    .map(async (year) => {
      const resp = await axios.get(
        `https://www.formula1.com/en/results/jcr:content/resultsarchive.html/${year}/team.html`
      );
      const htmls = parse(resp.data);
      const tableBody = htmls.getElementsByTagName("tbody");
      // console.log(tableBody.length);
      tableBody[0]?.getElementsByTagName("tr").forEach((tr) => {
        teamsData.push({
          YEAR: year,
          POS: parseInt(tr.getElementsByTagName('td')[1].innerText || '0'), 
          TEAM: tr.querySelectorAll('a')[0].innerText, 
          PTS: parseInt(tr.getElementsByTagName('td')[3].innerText || '0'), 
        });
      });
    });

  // await Promise.all(teamsDataPromises);
  // console.log(teamsData);
  // fs.writeFileSync('teams.json', JSON.stringify(teamsData))
};

main();
