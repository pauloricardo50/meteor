const fs = require('fs');
const https = require('https');

const URL = 'https://kurse.vermoegenszentrum.ch/vermoegenszentrum/iChart?lid=211372,433,1&mode=snap&vt=yes&max=2800&period=1d';
const CSV_SEPARATOR = ';';
const REPLACE_DOTS_WITH_COMMAS = false;
const SAVE_PATH = '/tmp/IRS10Y_RAW.csv';

const convertAndFormatUnixTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

const makeRequest = url =>
  new Promise((resolve, reject) => {
    let obj = {};

    const callback = (response) => {
      let str = '';

      response.on('data', (chunk) => {
        str += chunk;
      });
      response.on('end', () => {
        obj = JSON.parse(str);
        resolve(obj);
      });
    };

    https.get(url, callback).on('error', reject);
  });

const saveRates = ({ prices }) => {
  const items = prices.map(({ d, c }) => ({
    date: convertAndFormatUnixTimestamp(d),
    rate: REPLACE_DOTS_WITH_COMMAS
      ? (c / 100).toString().replace('.', ',')
      : c / 100,
  }));

  const replacer = (key, value) => (value === null ? '' : value);
  const header = Object.keys(items[0]);

  let csv = items.map(row =>
    header
      .map(fieldName => JSON.stringify(row[fieldName], replacer))
      .join(CSV_SEPARATOR));
  csv.unshift(header.join(CSV_SEPARATOR));
  csv = csv.join('\r\n');

  fs.writeFile(SAVE_PATH, csv, () => null);
};

makeRequest(URL).then(saveRates);
