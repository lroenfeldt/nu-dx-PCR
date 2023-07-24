const util = require('util');
const exec = util.promisify(require('child_process').exec);

const serialNumber = async () => {
  let delimiter = ': ';
  let vals = ['Serial', 'UUID'];
  let cmd: string = '';
  switch (process.platform) {
    case 'win32':
      delimiter = '\r\n';
      vals[0] = 'IdentifyingNumber';
      cmd = 'wmic bios get serialnumber ';
      break;

    case 'darwin':
      cmd = 'system_profiler SPHardwareDataType | grep ';
      break;

    case 'linux':
      if (process.arch === 'arm') {
        vals[1] = 'Serial';
        cmd = 'cat /proc/cpuinfo | grep ';
      } else {
        cmd = 'dmidecode -t system | grep ';
      }
      break;

    case 'freebsd':
      cmd = 'dmidecode -t system | grep ';
      break;
  }

  const { stdout, stderr } = await exec(cmd);
  return stdout.slice(stdout.indexOf(delimiter) + 2).trim();
};
module.exports = exports = serialNumber;
