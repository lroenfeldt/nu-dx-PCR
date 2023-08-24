
export async function getConfig(event, store, isDev, app,macaddress): Promise<void> {
  let settings = store.get('settings');
  let wellCount = getDeviceType() ;
  settings.isDev = isDev;
  settings.version = app.getVersion();
  let hardwareId = await macaddress.one().then((mac) => mac);
  let serialNumber = ''; // await getSerialNumber();
  settings.device = { hardwareId, wellCount, serialNumber };
  event.returnValue = settings;
}

export function saveConfig(event, store, config): void {
  try {
    store.set('settings', config);

    return true;
  } catch (err) {
    console.log(err);
    logger(`saveConfig ${err}`, 'logErrors.txt');
    throw Error('Settings could not be saved');
  }
}

export function clearConfig(event, store): void {
  try {
    store.clear();

    return true;
  } catch (err) {
    console.log(err);
    logger(`clearConfig ${err}`, 'logErrors.txt');
    throw Error('Settings could not be cleared');
  }
}