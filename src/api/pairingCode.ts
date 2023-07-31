import { IPairingCode } from '../types/interfaces/interfaces';
import client from './client';

const endpoint = '/devices/pairing';
const getPairingCode = ({ hardwareId, pairingCode }: IPairingCode) =>
  client.get(`${endpoint}/${hardwareId}/${pairingCode}`);

/**
 * Get the pairing code
 * @param {string} hardwareId
 * @param {object} pairingCode
 * @returns
 **/
const pollPairingCode = (hardwareId: string, data: {}) => client.post(`${endpoint}/${hardwareId}/new`, data);

/**
 * Check if the pairing code is valid
 * @param {object} data
 * @returns
 * */
const fetchPairingCode = (data: {}) => client.get(endpoint, data);

/**
 * Check if the pairing code is valid
 * @param {object} data
 * @returns
 * */
const checkPairingCode = (data: {}) => client.post(endpoint, data);

export default {
  getPairingCode,
  pollPairingCode,
  fetchPairingCode,
  checkPairingCode,
};
