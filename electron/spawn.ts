import { logger } from './logger';
import isDev from 'electron-is-dev';
import { spawn as childSpawn, SpawnOptions } from 'child_process';

/**
 *	@description Spawns a new process
 * @param {string} cmd - The command to run
 * @param {string[]} args - List of string arguments
 * @param {SpawnOptions} [options] - Options for the child process
 * @returns {Promise<void>} A promise that resolves when the process completes
 */
export const spawn = async (cmd: string, args: string[], options?: SpawnOptions): Promise<void> => {
    if (isDev) {
        return;
    }

    return new Promise<void>((resolve, reject) => {
        const child = options ? childSpawn(cmd, args, options) : childSpawn(cmd, args);
        let errorData = '';

        if (!child.stdout || !child.stderr) {
            reject(new Error(`Failed to create child process for cmd: ${cmd} with args: ${args.join(' ')}. Either stdout or stderr was null.`));
            return;
        }

        child.stdout.on('data', (data: string) => {
            logger(`success ${cmd} ${args.join(' ')}: ${data}`, 'spawn.txt');
        });

        child.stderr.on('data', (data: string) => {
            errorData += data;
            const errorMessage = `Error spawning ${cmd} ${args.join(' ')}: ${data}`;
            console.log(errorMessage);
            logger(errorMessage, 'spawn.txt');
        });

        child.on('close', (code: number) => {
            if (code === 0) {
                resolve();
            } else {
                const errorLog = `child process exited with code ${code}`;
                logger(errorLog, 'spawn.txt');
                reject(new Error(`${errorLog}: ${errorData}`));
            }
        });
    });
};
