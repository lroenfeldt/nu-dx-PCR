import * as fs from 'fs';
import * as path from 'path';
import { app } from 'electron';
export function checkResultFile(event, testid): void {
  if (testid === 'demo') {
    event.returnValue = true;
    return;
  }

  const filepath = path.resolve(os.homedir(), 'Documents', `${testid}.csv`);
  const destDir = path.resolve(app.getPath('userData'), 'runs', testid);
  const destpath = path.resolve(destDir, `${testid}.csv`);

  try {
    fs.accessSync(filepath, fs.constants.F_OK);
  } catch (error: any) {
    const errorMsg = `Result file "${filepath}" is not present or not readable: ${error.message}`;
    console.error(errorMsg);
    logger(errorMsg, 'logErrors.txt');
    event.returnValue = false;
    return;
  }

  try {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    event.returnValue = true;
  } catch (error: any) {
    const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
    console.error(errorMsg);
    logger(errorMsg, 'logErrors.txt');
    event.returnValue = false;
  }
}

export function moveResultFile(event, testid): void {
  if (testid === 'demo') {
    event.returnValue = true;
    return;
  }

  const filepath = path.resolve(os.homedir(), 'Documents', `${testid}.csv`);
  const destpath = path.resolve(app.getPath('userData'), 'runs', testid, testid + '.csv');

  try {
    fs.renameSync(filepath, destpath);
    const successMsg = `Result file successfully moved to "${destpath}"`;
    
    logger(successMsg, 'logErrors.txt');
    event.returnValue = true;
  } catch (error:any) {
    const errorMsg = `Result file "${filepath}" could not be moved to "${destpath}" due to error: ${error.message}`;
    console.error(errorMsg);
    logger(errorMsg, 'logErrors.txt');
    event.returnValue = false;
  }
}

export async function  archiveRun(): void { 

  const userDataPath = app.getPath('userData');
const filepath = path.join(userDataPath, 'runs');
const destpath = path.join(userDataPath, 'archive');

try {
  if (!fs.existsSync(destpath)) {
    fs.mkdirSync(destpath);
  }
  if (!fs.existsSync(filepath)) {
    fs.mkdirSync(filepath);
  }

  const files = fs.readdirSync(filepath, { withFileTypes: true });

  for (let file of files) {
    if (file.isDirectory() && file.name !== 'demo') {
      const sourcePath = path.join(filepath, file.name);
      let destPath = path.join(destpath, file.name);

      if (fs.existsSync(destPath)) {
        const timestamp = Date.now();
        destPath = path.join(destpath, `${file.name}_${timestamp}`);
      }

      fs.renameSync(sourcePath, destPath);
    }
  }
} catch (error) {
  console.error(`Failed to archive runs: ${error}`);
  throw error; // re-throw the error to be handled by the renderer process
}
}

export function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
