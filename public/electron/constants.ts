import { ISoftwareList, IStore } from '../interfaces/interfaces';
const Store = require('electron-store');

/**
 * Default configuration
 *  @type {string}
 */
const store: IStore = new Store({
  defaults: {
    settings: {
      account: {
        initialized: false,
        authToken: '',
        maxBarcodeLength: 10,
        minBarcodeLength: 9,
        allowedCharacters: '1234567890',
        orderKey: 'A210176',
        autoControl: true,
        hecThreshFL: 100,
        virusThreshFL: 300,
        checkBarcodesDB: true,
        checkOrder: true,
        submitRunSetup: true,
        showResults: false,
        submitResults: true,
        autoSubmitUnsubmitted: false,
        customCheckBarcodesEndpoint: '',
        customSubmitRunSetupEndpoint: '',
        customSubmitAutoControlEndpoint: '',
        customFetchAutoControlEndpoint: '',
        customSubmitResultsEndpoint: '',
        data: {
          id: 'fbdaac7d-4055-4b30-9f64-d0070447eca7',
          profileId: 'cef5b173-f8dc-494e-8ce0-62938441ae01',
          name: 'nu:dx PCR',
          email: 'l.roenfeldt@procomcure.de',
          lastSignIn: '2022-06-03T08:52:07.302061Z',
          authenticated: true,
          contactPerson: 'Leif Rönfeldt',
          address: 'tbd',
          emailConfirmedAt: '2022-05-23T10:03:44.944231Z',
          role: {
            name: 'poc-customer',
            isAdmin: true,
          },
        },
      },
      user: {
        tpcPos: 'A01',
        ntcPos: 'A02',
        locale: 'en',
        updateType: 'stable',
      },
    },
  },
});

let mainWindow;

let splash;

let lineGenePath: string = '';

const killProcess = (process: string | Object) => {
  spawn('taskkill', ['/f', '/im', process]);
};
export function spawn(arg0: string, arg1: (string | Object)[]) {
  throw new Error('Function not implemented.');
}

const forceConsole: boolean = false;

/**
 * check installed version of LineGene
 * @returns {string} the version of LineGene
 */
const softwareList: ISoftwareList[] = [
  {
    path: 'C:\\Bioer\\LineGene\\1600\\bin\\LineGene1600.exe',
    returnType: 16,
    name: 'LineGene1600',
  },
  {
    path: 'C:\\Bioer\\LineGene1600 for research\\1644\\bin\\LineGene1600.exe',
    returnType: 16,
    name: 'LineGene1644',
  },
  {
    path: 'C:\\BIOER\\LineGene1600 for research\\1640\\bin\\LineGene1600.exe',
    returnType: 16,
    name: 'LineGene1640',
  },
  {
    path: 'C:\\BIOER\\96\\bin\\Gene-9660.exe',
    returnType: 96,
    name: 'LineGene9600',
  },
];

module.exports = {
  store,
  lineGenePath,
  killProcess,
  forceConsole,
  softwareList,
  mainWindow,
  splash,
};
