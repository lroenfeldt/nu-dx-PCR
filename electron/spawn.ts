import { logger } from './logger';
import isDev from 'electron-is-dev';
import { spawn as childSpawn } from 'child_process';

/**
 *	@description spawn a new process
 * @param {string} cmd
 * @param {Array} args
 * @param {object} options
 * @returns
 */
export const spawn = async (cmd: string, args: Array<string>, options?: object): Promise<void> => {
    if (isDev) {
     
      return;
    }
    return new Promise<void>((resolve, reject) => {
      const child = childSpawn(cmd, args, options);
      let errorData = '';

      child.stdout.on('data', (data: string) => {
       
        logger('success ' + cmd + ' ' + args.join(' ') + ': ' + data, 'spawn.txt');
      });

      child.stderr.on('data', (data: string) => {
        errorData += data;
        console.log('Error spawning ' + cmd + ' ' + args.join(' ') + ': ' + data);
        logger('Error spawning ' + cmd + ' ' + args.join(' ') + ': ' + data, 'spawn.txt');
      });

      child.on('close', (code: number) => {
        if (code === 0) {
          resolve();
        } else {
          
          logger(`child process exited with code ${code}`, 'spawn.txt');
          reject(new Error(`child process exited with code ${code}: ${errorData}`));
        }
      });
    });
};
