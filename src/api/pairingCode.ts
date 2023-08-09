import { IPairingCode } from '../types/interfaces/interfaces';
import client from './client';

const endpoint = '/devices/pairing';
export const getPairingCode = ({ hardwareId, pairingCode }: IPairingCode) =>
  client.get(`${endpoint}/${hardwareId}/${pairingCode}`);

/**
 * Get the pairing code
 * @param {string} hardwareId
 * @returns
 */
export const pollPairingCode = (hardwareId: string, data: {}) => client.post(`${endpoint}/${hardwareId}/new`, data);

/**
 * Check if the pairing code is valid
 * @param {object} data
 * @returns
 * */
export const fetchPairingCode = (data: {}) => client.get(endpoint, data);

/**
 * Check if the pairing code is valid
 * @param {object} data
 * @returns
 * */
export const checkPairingCode = (data: {}) => client.post(endpoint, data);
