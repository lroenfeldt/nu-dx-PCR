const fs = require('fs');
const moment = require('moment');

const saveLogs = () => {
  // save console logs into file
  // create references and store the original console functions
  const originalLog = console.log;

  // initialize arrays
  const logs = [];

  // initialize a variable to initial state of false
  // used later for saving data
  let shouldSaveLogs = false;

  console.log = function () {
    // is responsible for invoking the original `console.log` function
    // with the same arguments and maintaining its behavior while
    // adding custom logic to store the log message and additional data in the `logs` array.
    originalLog.apply(console, Array.from(arguments));
    // push to array and create an object
    logs.push({
      message: Array.from(arguments),
      timestamp: new Date().toLocaleString('DE-de'),
    });
    // change the state to true to make it able to safe the data
    shouldSaveLogs = true;
  };

  setInterval(() => {
    if (shouldSaveLogs) {
      saveLogsToFile();
      shouldSaveLogs = false;
    }
    // check if data should be safe and set the state back to false
  }, 1000); // Save logs every second

  function saveLogsToFile() {
    const logsData = { logs };
    // Save logsData to a file, e.g., using the File System API or sending it to a server
    // converting to JSON data with pretty printing null and 2
    try {
      fs.readFile(`logging/savedLogs_${moment().format('DD_MM_YYYY')}.json`, 'utf-8', (err, data) => {
        if (err) {
          console.error(err, 'Error reading the file');
          return;
        }
        if (data) {
          // get old and new value and create a new js array
          const oldJsonData = JSON.parse(data);
          const newJsonData = logsData;
          const oldLogs = oldJsonData.logsData.logs;
          const newLogs = newJsonData.logs;
          let oldLogsArr = [];
          let newLogsArr = [];

          for (let i in oldLogs) oldLogsArr.push(oldLogs[i]);
          for (let i in newLogs) newLogsArr.push(newLogs[i]);

          let newArr = oldLogsArr.concat(newLogsArr);

          // check double and delte one of them
          const checkDoubleArr = newArr.reduce((doubleArr, oldObj) => {
            if (
              !doubleArr.some(
                (newObj) =>
                  newObj.code === oldObj.code &&
                  newObj.message[0] === oldObj.message[0] &&
                  newObj.timestamp === oldObj.timestamp
              )
            ) {
              doubleArr.push(oldObj);
            }
            return doubleArr;
          }, []);

          // initial state of json data
          let jsonData = {
            logsData: {
              logs: checkDoubleArr,
            },
          };

          // write and edit into json file
          fs.writeFile(
            `logging/savedLogs_${moment().format('DD_MM_YYYY')}.json`,
            JSON.stringify(jsonData, null, 2),
            (err) => {
              if (err) {
                console.error(err, 'Error while writing logs to file');
                return;
              }
              console.info('New data logs written to file successfully');
            }
          );
        }
      });
    } catch (error) {
      console.error('Error sending logs:', error);
    }
  }
};
module.exports = {
  saveLogs,
};
