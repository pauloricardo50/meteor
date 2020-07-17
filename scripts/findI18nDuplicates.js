const fr = require('../core/lang/fr.json');

let duplicates = [];

Object.keys(fr).forEach((key, i, arr) => {
  const forwardKeys = arr.slice(i + 1, -1);

  const currentValue = fr[key];

  forwardKeys.forEach(k => {
    if (currentValue === fr[k]) {
      duplicates = [
        ...duplicates,
        {
          original: { key, value: currentValue },
          duplicate: { key: k, value: fr[k] },
        },
      ];
    }
  });
});

// const filteredDuplicates = duplicates.filter(({original, duplicate}) => !original.key.includes('.placeholder') && !duplicate.key.includes('.placeholder'))
// console.log('Duplicates:', JSON.stringify(filteredDuplicates, null, 2))
// console.log('Count:', filteredDuplicates.length)

const PDFDuplicates = duplicates.filter(
  ({ original, duplicate }) =>
    original.key.includes('PDF.') || duplicate.key.includes('PDF.'),
);
console.log('PDFDuplicates:', JSON.stringify(PDFDuplicates, null, 2));
console.log('PDFDuplicates count:', PDFDuplicates.length);
