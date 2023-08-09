/**
 * substutite the variables in the string with the values
 * @param {*} str - given string
 * @param {*} obj - object with key value pairs
 * @returns {string} the string with the variables replaced
 */
const substitute = (str: string, obj: Record<string, any>): string => {
  return str.replace(/%\w+%/g, (all) => {
    return obj[all] || all;
  });
};

function hexToRGB(hex: string, alpha: string) {
  if (hex == null) return null;
  if (hex == 'orange') hex = '#FFA500';
  if (hex == 'red') hex = '#FF0000';
  if (hex == 'green') hex = '#00FF00';
  if (hex == 'blue') hex = '#0000FF';
  if (hex == 'yellow') hex = '#FFFF00';
  if (hex == 'purple') hex = '#800080';
  if (hex == 'pink') hex = '#FFC0CB';
  if (hex == 'white') hex = '#FFFFFF';
  if (hex == 'black') hex = '#000000';
  if (hex == 'grey') hex = '#808080';
  if (hex == 'gray') hex = '#808080';
  if (hex == 'brown') hex = '#A52A2A';
  if (hex == 'cyan') hex = '#00FFFF';
  if (hex == 'magenta') hex = '#FF00FF';
  if (hex == 'lime') hex = '#00FF00';
  var r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
}

export { substitute, hexToRGB };
