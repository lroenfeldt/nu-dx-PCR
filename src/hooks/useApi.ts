import { useState } from 'react';
import { IGetPairingCode, IPostStatus } from '../types/interfaces/api';
import { IResponse } from '../types/interfaces/interfaces';

/**
 * Returns a stateful value for api calls and a function to update it.
 * @param {function} apiFunc
 * @returns {object}
 * @example const { data, error, loading, request } = useApi(authApi.login);
 * */

export default function useApi(apiFunc: IPostStatus | IGetPairingCode): object {
  // created multiple interfaces for the postStatus function,
  // because useApi requires multiple types in arguments of the function
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * invokes the api function and updates the state
   * @returns {object}
   * @example request({ email: " ", password: " " });
   */
  const request = async ({ ...args }) => {
    setLoading(true);
    const response = (await apiFunc(args[0], args[1])) as IResponse;
    // changed from rest parameter ...args to args[0], args[1] because two arg are expected
    setLoading(false);
    if (response.ok) {
      setData(response.data);
    } else {
      setError(!response.ok);
      setData([]);
    }

    return response;
  };

  return { data, error, loading, request };
}
