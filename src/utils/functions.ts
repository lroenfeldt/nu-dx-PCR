/**
 * Refactor Seconds to display remaining Time
 * @param {*} d - date object
 * @returns {string}
 */
const secondsToHms = (d: number): string => {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + ':' : '';
  var mDisplay = m < 10 ? '0' + m + ':' : m + ':';
  var sDisplay = s < 10 ? '0' + s : s;

  return hDisplay + mDisplay + sDisplay;
};

export default { secondsToHms };
