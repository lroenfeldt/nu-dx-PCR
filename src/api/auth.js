import client from './client';
const endpoint = '/devices/pairing/';

/**
 *  check if the device is already paired
 * @param {string} hardwareId - the hardware id of the device
 * @param {string} token
 * @returns
 */
const checkToken = (hardwareId, token) => client.post(`${endpoint}${hardwareId}/check`, token);

export default {
  checkToken,
};
