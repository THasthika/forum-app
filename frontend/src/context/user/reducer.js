export const userReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        refreshToken: payload.refreshToken,
        accessToken: payload.accessToken,
        username: payload.username,
        email: payload.email,
        id: payload.id,
      };
    case 'USER_LOGOUT':
      return null;
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};
