const fs = require('fs');
const path = require('path');
const { createRandRestaurant } = require('./helpers.js');

const dbName = 'Mongo';
const writeStream = fs.createWriteStream(path.join(__dirname, `/data/sampleData${dbName}.csv`));
const numRecords = 10000000;
let percentComplete = 0;
let i = 1;
console.time('Runtime');

const writeRecords = () => {
  let notBuffering = true;
  while (i <= numRecords && notBuffering) {
    const entry = createRandRestaurant(i);
    notBuffering = writeStream.write(`${JSON.stringify(entry)}\n`);

    if (i % (numRecords / 20) === 0 && i !== 0) {
      percentComplete += 5;
      const loadingMsg = `Writing to file...[${percentComplete}% complete]`;
      console.log(loadingMsg);
    }
    if (i === numRecords) {
      console.log('WRITING HAS COMPLETED!');
      console.timeEnd('Runtime');
    }

    i += 1;
  }

  if (!notBuffering) {
    writeStream.once('drain', () => {
      writeRecords();
    });
  }
};

writeRecords();
