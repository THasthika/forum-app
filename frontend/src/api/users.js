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

  const searchUsers = (query = {}) => {
    const qparts = [];
    Object.keys(query).forEach((cv) => {
      let t = '';
      if (cv === 'sortBy' && query[cv][0] !== null) {
        query['sortBy'] = `${query[cv][0]}:${query[cv][1]}`;
      }
      if (Array.isArray(query[cv])) {
        if (query[cv][0] === null || query[cv][0] === undefined) return;
        const ta = [];
        for (let i = 0; i < query[cv].length; i++) {
          ta.push(`${cv}=${query[cv][i]}`);
        }
        t = ta.join('&');
      } else {
        if (query[cv] === null || query[cv] === undefined) return;
        t = `${cv}=${query[cv]}`;
      }
      qparts.push(t);
    });
    const qs = qparts.join('&');
    return axios.get(`/users?${qs}`);
  };

  const deleteUser = (id) => {
    return axios.delete(`/users/${id}`);
  };

  const getUserById = (id) => {
    return axios.get(`/users/${id}`);
  };

  const updateUser = (id, userDetails) => {
    return axios.patch(`/users/${id}`, userDetails);
  };

  const addRole = (id, role) => {
    return axios.post(`/users/${id}/role/${role}`);
  };

  const removeRole = (id, role) => {
    return axios.delete(`/users/${id}/role/${role}`);
  };

  return {
    createUser,
    updateUser,
    searchUsers,
    deleteUser,
    getUserById,
    addRole,
    removeRole,
  };
}
