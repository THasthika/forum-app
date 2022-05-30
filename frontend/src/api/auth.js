/**
 *
 * @param {import("axios").AxiosInstance} axios
 * @returns
 */
export default function AuthApi(axios) {
  /**
   *
   * @param {string} email
   * @param {string} password
   */
  const login = (email, password) => {
    return axios.post(
      '/auth/login',
      {
        email,
        password,
      },
      {
        method: 'post',
      },
    );
  };

  /**
   *
   * @param {string} refreshToken
   */
  const refreshToken = (refreshToken) => {
    return axios.post(
      '/auth/refresh',
      { refreshToken },
      {
        method: 'post',
      },
    );
  };

  return {
    login,
    refreshToken,
  };
}
