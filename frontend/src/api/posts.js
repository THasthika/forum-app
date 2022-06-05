/**
 *
 * @param {import("axios").AxiosInstance} axios
 * @returns
 */
export default function PostsApi(axios) {
  const searchPosts = (query = {}) => {
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
    return axios.get(`/posts?${qs}`);
  };

  return {
    searchPosts,
  };
}
