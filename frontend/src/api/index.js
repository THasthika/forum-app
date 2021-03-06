import PostsApi from './posts';
import RolesApi from './roles';
import UsersApi from './users';

const { default: axios } = require('axios');
const { getUser, setUser } = require('utils/localStorage');
const { default: AuthApi } = require('./auth');

function createApiInstance() {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE || 'http://google.com',
  });
  return api;
}

const _api = createApiInstance();

const api = {
  call: async (link) => {
    return await _api.get(link);
  },
  auth: AuthApi(_api),
  users: UsersApi(_api),
  roles: RolesApi(_api),
  posts: PostsApi(_api),
};

_api.interceptors.request.use(
  (config) => {
    const user = getUser();
    if (user && user.accessToken) {
      config.headers['Authorization'] = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

_api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (!error.response) throw error;
    if (error.response.status === 401 && !originalConfig._retry) {
      try {
        const user = getUser();
        if (user) {
          const rs = await api.auth.refreshToken(user.refreshToken);
          const { accessToken, refreshToken } = rs.data;
          user.accessToken = accessToken;
          user.refreshToken = refreshToken;
          setUser(user);

          _api.defaults.headers.common[
            'Authorization'
          ] = `Bearer ${refreshToken}`;
          originalConfig._retry = true;
          return _api(originalConfig);
        }
      } catch (_error) {
        if (_error.statusCode === 400) {
          setUser(null);
        }
        if (_error.response && _error.response.data) {
          throw _error.response.data;
        }
        throw _error;
      }
    }
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  },
);

export default api;
