const fs = require('fs');
const moment = require('moment');

const createFile = () => {
  // check if file exists
  const fileExists = fs.existsSync(`logging/savedLogs_${moment().format('DD_MM_YYYY')}.json`);

  if (!fileExists) {
    let jsonData = {
      logsData: {
        logs: [],
      },
    };
    fs.writeFile(
      `logging/savedLogs_${moment().format('DD_MM_YYYY')}.json`,
      JSON.stringify(jsonData, null, 2),
      (err) => {
        if (err) {
          console.error(err, 'Error while writing logs to file');
          return;
        }
        console.info('File created');
      }
    );
  }
};

module.exports = {
  createFile,
};
