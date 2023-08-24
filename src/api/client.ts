import { create, ApiResponse } from 'apisauce';
// import cache from '../utility/cache';
import settings from '../config/settings';

const apiClient = create({
  baseURL: settings.api,
});

const { get } = apiClient;

apiClient.get = async <T, U = any>(
  url: string, 
  params?: object, 
  axiosConfig?: object
): Promise<ApiResponse<T, U>> => {
  const response = await get<T, U>(url, params, axiosConfig);
  return response;
};


export default apiClient;
