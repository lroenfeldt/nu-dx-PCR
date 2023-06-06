let api;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  api = 'https://devpoc.myprocomcure.de/api/';
} else {
  api = 'https://poc.myprocomcure.de/api/';
}

const TESTMETHOD = 'd5b3cef9-918c-4566-bb09-fabe9b0af8d3';
const checkBarcodeUrl = 'https://POC:Ybd3nuKEPrjUXDPjaZkpSCSa@labordatenbank.com/procomcure/stats/view/515/https_json/';
const submitControlUrl =
  'https://procomcurepoc:PCMhhWBgesMmtjrkWArpgK2q@labordatenbank.com/procomcure/imports/import/166/0/https';
const fetchControlUrl = 'https://POC:Ybd3nuKEPrjUXDPjaZkpSCSa@labordatenbank.com/procomcure/stats/view/526/https_json/';
const resultUrl =
  'https://procomcurepoc:PCMhhWBgesMmtjrkWArpgK2q@labordatenbank.com/procomcure/imports/import/163/0/https';
export default {
  api,
  resultUrl,
  TESTMETHOD,
  checkBarcodeUrl,
  fetchControlUrl,
  submitControlUrl,
};
