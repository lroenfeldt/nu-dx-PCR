import client from './client';

const endpoint = '/devices/pairing/';

/**
 * Check if the device is already paired.
 * @param hardwareId - The hardware id of the device.
 * @param token - The token to validate.
 * @returns Promise with response data.
 */
const checkToken = (hardwareId: string, token: string) => 
    client.post(`${endpoint}${hardwareId}/check`, token);

export default {
    checkToken,
};
