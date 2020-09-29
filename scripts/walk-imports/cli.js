const walkApp = require('.');

const archList = ['client'];
const startTime = new Date();
let count = 0;

walkApp(process.cwd(), archList, () => {
  count += 1;
});

const endTime = new Date();

console.log('Spent', endTime.getTime() - startTime.getTime(), 'ms');
console.log('Found:', count, 'imports');
