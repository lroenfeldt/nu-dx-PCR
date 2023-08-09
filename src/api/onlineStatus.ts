import client from './client';
const endpoint = '/devices';

/**
 * Update the status of the device
 * @param {string} hardwareId
 * @returns
 */

export const postStatus = (hardwareId: string, data: {}) => client.post(`${endpoint}/${hardwareId}/status`, data);
