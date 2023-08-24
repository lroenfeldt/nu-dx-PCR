import client from "./client";

const endpoint = "/devices";

/**
 * Update the status of the device.
 * @param hardwareId - The hardware ID of the device.
 * @param data - The status data to update.
 * @returns Promise with response data.
 */
const postStatus = (hardwareId: string, data:  {
    status: string,
    timesStamp: number,
    cyclerVersion: string,
  }) => 
    client.post(`${endpoint}/${hardwareId}/status`, data);

export default {
    postStatus,
};
