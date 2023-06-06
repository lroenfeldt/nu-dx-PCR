import client from "./client";
const endpoint = "/devices";

/**
 * Update the status of the device
 * @param {string} hardwareId
 * @param {object} status
 *
 * @returns
 **/
const postStatus = (hardwareId, data) => client.post(`${endpoint}/${hardwareId}/status`, data);

export default {
	postStatus,
};
