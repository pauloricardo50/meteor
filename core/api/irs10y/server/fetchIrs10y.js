import { Meteor } from 'meteor/meteor';

const cheerio = require('cheerio');
const request = require('request');

const URL =
  'https://kurse.vermoegenszentrum.ch/vermoegenszentrum/details/details.jsp?listingId=211372,433,1';

export const fetchIrs10y = () =>
  new Promise((resolve, reject) => {
    request(URL, (error, response, html) => {
      if (!error && response.statusCode === 200) {
        const $ = cheerio.load(html);
        let result = $('.kum-bht-value').text();
        result = result.split('%')[0] / 100;
        resolve(result);
      }
      reject(new Meteor.Error(error));
    });
  });
