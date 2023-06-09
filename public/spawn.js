const { logger } = require('./logger');
const isDev = require('electron-is-dev');
module.exports = {
  /**
   *	@description spawn a new process
   * @param {string} cmd
   * @param {Array} args
   * @param {object} options
   * @returns
   */
  spawn: async (cmd, args, options) => {
    if (isDev) {
      return;
    }
    return new Promise((resolve, reject) => {
      const child = require('child_process').spawn(cmd, args, options);
      let errorData = '';

      child.stdout.on('data', (data) => {
        console.log(data.toString());
        logger('success ' + cmd + ' ' + args.join(' ') + ': ' + data, 'spawn.txt');
      });

      child.stderr.on('data', (data) => {
        errorData += data;
        console.log('Error spawning ' + cmd + ' ' + args.join(' ') + ': ' + data);
        logger('Error spawning ' + cmd + ' ' + args.join(' ') + ': ' + data, 'spawn.txt');
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          console.log(`child process exited with code ${code}`);
          logger(`child process exited with code ${code}`, 'spawn.txt');
          reject(new Error(`child process exited with code ${code}: ${errorData}`));
        }
      });
    });
  },
};
