import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

/**
 * @description log events
 * @param {string} message
 * @param {string} logName
 * @returns {void}
 * @example logger("Error spawning " + cmd + " " + args.join(" ") + ": " + data, "spawn.txt");
 **/
export const logger = async (message: string, logName: string): Promise<void> => {
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
};
