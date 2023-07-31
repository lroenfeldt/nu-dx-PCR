import client from './client';
const endpoint = '/devices';

/**
 * Update the status of the device
 * @param {string} hardwareId
 * @returns
 */
const postStatus = (hardwareId: string, data: {}) => client.post(`${endpoint}/${hardwareId}/status`, data);

export default {
  postStatus,
};
