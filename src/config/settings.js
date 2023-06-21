let api;
if (!import.meta.env.MODE || import.meta.env.MODE === 'development') {
  api = 'https://devpoc.myprocomcure.de/api/';
} else {
  api = 'https://poc.myprocomcure.de/api/';
}

const TESTMETHOD = 'd5b3cef9-918c-4566-bb09-fabe9b0af8d3';
const checkBarcodeUrl = `https://${import.meta.env.VITE_POC_USER}:${
  import.meta.env.VITE_POC_PASSWORD
}@labordatenbank.com/procomcure/stats/view/515/https_json/`;
const submitControlUrl = `https://${import.meta.env.VITE_PROCOMCUREPOC_USER}:${
  import.meta.env.VITE_PROCOMCUREPOC_PASSWORD
}@labordatenbank.com/procomcure/imports/import/166/0/https`;
const fetchControlUrl = `https://${import.meta.env.VITE_POC_USER}:${
  import.meta.env.VITE_POC_PASSWORD
}@labordatenbank.com/procomcure/stats/view/526/https_json/`;
const resultUrl = `https://${import.meta.env.VITE_PROCOMCUREPOC_USER}:${
  import.meta.env.VITE_PROCOMCUREPOC_PASSWORD
}@labordatenbank.com/procomcure/imports/import/163/0/https`;

export default {
  api,
  resultUrl,
  TESTMETHOD,
  checkBarcodeUrl,
  fetchControlUrl,
  submitControlUrl,
};
