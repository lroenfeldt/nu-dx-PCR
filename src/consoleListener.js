export const consoleListener = () => {
  // changing the the console.log behaviour
  let log = console.log;
  console.log = function (...data) {
    log(...data);
    window.api.log(data);
  };
};
