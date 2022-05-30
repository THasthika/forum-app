/**
 *
 * @param {import("axios").AxiosInstance} axios
 * @returns
 */
export default function UsersApi(axios) {
  /**
   *
   * @param {string} email
   * @param {string} username
   * @param {string} password
   */
  const createUser = (email, username, password) => {
    return axios.post('/users', { email, username, password });
  };

  return {
    createUser,
  };
}
