const fs = require('fs');
const yargs = require('yargs');
const fr = require('../core/lang/fr.json');

// Finds all duplicated i18n strings
// Filters out placeholders
//
// Options:
// --filter, -f    filter to apply on duplicated keys
// --out, -o       file location to store the results at
//
// Example:
// bable-node findi18nDuplicates.js -f "PDF." -o "./duplicates.json"
// will output only duplicated strings which key contains "PDF." and save the result to "./duplicates.json"
//
// Sample output:
//  {
//   "count": 3,
//   "filter": "PDF.",
//   "data": [
//     {
//       "original": {
//         "key": "PDF.PropertyPage.realEstateValue",
//         "value": "Valeur"
//       },
//       "duplicates": [
//         {
//           "key": "Forms.rules.value",
//           "value": "Valeur"
//         },
//         {
//           "key": "Forms.otherFortune.value",
//           "value": "Valeur"
//         }
//       ]
//     },
//     {
//       "original": {
//         "key": "PDF.lenderRules",
//         "value": "Critères d'octroi"
//       },
//       "duplicates": [
//         {
//           "key": "OrganisationTabs.lenderRules",
//           "value": "Critères d'octroi"
//         }
//       ]
//     },
//   ]
// }

const { argv: { filter, out } = {} } = yargs
  .string('filter')
  .alias('f', 'filter')
  .describe('filter', 'filter on duplicated i18n keys')
  .string('out')
  .alias('o', 'out')
  .describe('out', 'file location to store the results at');

let duplicates = [];

Object.keys(fr).forEach((key, i, arr) => {
  const forwardKeys = arr.slice(i + 1, -1);

  const currentValue = fr[key];

  const forwardDuplicates = forwardKeys.filter(
    k =>
      currentValue === fr[k] &&
      !duplicates.find(({ duplicates: dupl = [] }) =>
        dupl.some(({ key: duplicateKey }) => duplicateKey === k),
      ),
  );

  if (forwardDuplicates.length) {
    duplicates = [
      ...duplicates,
      {
        original: { key, value: currentValue },
        duplicates: forwardDuplicates.map(k => ({ key: k, value: fr[k] })),
      },
    ];
  }
});

const duplicatesWithoutPlacehohlder = duplicates
  .map(({ duplicates: dupl, original }) => ({
    original,
    duplicates: dupl.filter(({ key }) => !key.includes('.placeholder')),
  }))
  .filter(({ original }) => !original.key.includes('.placeholder'))
  .filter(({ duplicates: dupl = [] }) => dupl.length);

let result = duplicatesWithoutPlacehohlder;

if (filter) {
  result = duplicatesWithoutPlacehohlder.filter(
    ({ original, duplicates: dupl = [] }) =>
      original.key.includes(filter) ||
      dupl.some(({ key }) => key.includes(filter)),
  );
}

const count = result.reduce(
  (total, { duplicates: dupl = [] }) => total + dupl.length,
  0,
);

result = {
  count,
  filter,
  data: result,
};

console.log('result:', JSON.stringify(result, null, 2));

if (out) {
  fs.writeFileSync(out, JSON.stringify(result, null, 2));
}
