import { useState } from "react";

/**
 * Returns a stateful value for api calls and a function to update it.
 * @param {function} apiFunc
 * @returns {object}
 * @example const { data, error, loading, request } = useApi(authApi.login);
 * */

export default function useApi(apiFunc) {
	const [data, setData] = useState([]);
	const [error, setError] = useState(false);
	const [loading, setLoading] = useState(false);

	/**
	 * invokes the api function and updates the state
	 * @param {object} params
	 * @returns {object}
	 * @example request({ email: " ", password: " " });
	 * */
	const request = async (...args) => {
		setLoading(true);
		const response = await apiFunc(...args);
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
