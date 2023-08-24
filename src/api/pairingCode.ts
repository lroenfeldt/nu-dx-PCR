import client from "./client";

const endpoint = "/devices/pairing";

interface PairingCodeParams {
  hardwareId: string;
  pairingCode: object;
}

const getPairingCode = ({ hardwareId, pairingCode }: PairingCodeParams) => client.get(`${endpoint}/${hardwareId}/${pairingCode}`);

/**
 * Get the pairing code
 * @param hardwareId
 * @param data
 * @returns
 **/
const pollPairingCode = (hardwareId: string, data: object) => client.post(`${endpoint}/${hardwareId}/new`, data); 

/**
 * Check if the pairing code is valid
 * @param data
 * @returns
 * */
const fetchPairingCode = (data: object) => client.get(endpoint, data); 

/**
 * Check if the pairing code is valid
 * @param data
 * @returns
 * */
const checkPairingCode = (data: object) => client.post(endpoint, data); 

export default {
	getPairingCode,
	pollPairingCode,
	fetchPairingCode,
	checkPairingCode,
};
