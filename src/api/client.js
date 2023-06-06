import { create } from "apisauce";
//import cache from '../utility/cache';
import settings from "../config/settings";

const apiClient = create({
  baseURL: settings.api,
});

const { get } = apiClient;
apiClient.get = async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig);
  return response;
};

export default apiClient;
