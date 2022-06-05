export const setUserData = (
  dispatch,
  { accessToken, refreshToken, username, email, permissions },
) => {
  dispatch({
    type: 'SET_USER_DATA',
    payload: { accessToken, refreshToken, username, email, permissions },
  });
};

export const logoutUser = (dispatch) => {
  dispatch({
    type: 'USER_LOGOUT',
  });
};
