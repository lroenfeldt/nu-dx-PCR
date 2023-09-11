const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

module.exports = {
  /**
   * @description log events
   * @param {string} message
   * @param {string} logName
   * @returns {void}
   * @example logger("Error spawning " + cmd + " " + args.join(" ") + ": " + data, "spawn.txt");
   **/
  logger: async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${JSON.stringify(message)}\n`;
    try {
      if (!fs.existsSync(path.resolve(app.getPath('userData'), 'logs'))) {
        await fs.promises.mkdir(path.resolve(app.getPath('userData'), 'logs'));
      }
      await fs.promises.appendFile(path.resolve(app.getPath('userData'), 'logs', logName), logItem);
    } catch (err) {
      console.log(err);
    }
  },
};
