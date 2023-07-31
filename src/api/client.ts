import { create, ApiResponse } from 'apisauce';
import settings from '../config/settings';
import { AxiosRequestConfig } from 'axios';

type GetFunction = (url: string, params?: {}, axiosConfig?: AxiosRequestConfig) => Promise<ApiResponse<any>>;

const apiClient = create({
  baseURL: settings.api as string,
});

console.log('apiClient', settings.api);
const { get }: any = apiClient;

// Assign the type alias to the 'apiClient.get' function
(apiClient.get as GetFunction) = async (
  url: string,
  params?: any,
  axiosConfig?: AxiosRequestConfig
): Promise<ApiResponse<any>> => {
  const response = await get(url, params, axiosConfig);
  return response;
};

export default apiClient;
