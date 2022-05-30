export const userReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        token: payload.token,
        name: payload.name,
        email: payload.email,
      };
    case 'USER_LOGOUT':
      return null;
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};
