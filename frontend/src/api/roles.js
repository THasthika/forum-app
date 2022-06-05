/**
 *
 * @param {import("axios").AxiosInstance} axios
 * @returns
 */
export default function RolesApi(axios) {
  const getAllRoles = () => {
    return axios.get(`/roles`);
  };

  return {
    getAllRoles,
  };
}
