export enum ErrorType {
  moveResults = "moveResults",
  setting = "setting",
  default = "default",
  lid = "lid",
  read = "read",
  failedToReadTestData = "failedToReadTestData",
  failedToReadResultData = "failedToReadResultData",
  submit = "submit",
  failedToSaveControlSample = "failedToSaveControlSample",
  failedToMoveSubmittedFiles = "failedToMoveSubmittedFiles",
  saveIntoUSB = "saveIntoUSB",
  dbCon = "dbCon",
  dbConnection = "dbConnection",
  checkInternetConnection = "checkInternetConnection",
  pairingDbError = "pairingDbError",
  deviceRegistrationFailed = "deviceRegistrationFailed",
  offline = "offline",
  offlineNotAllow = "offlineNotAllow",
  stillOffline = "stillOffline",
  auth = "auth",
  authentication = "authentication",
  init = "init",
  cancelTest = "cancelTest",
  testFailed = "testFailed",
  startTest = "startTest",
}

export interface IErrObj {
  code: number;
  type: ErrorType;
  message: string;
}
