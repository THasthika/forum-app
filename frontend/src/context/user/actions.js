export const setUserData = (
  dispatch,
  { accessToken, refreshToken, username, email },
) => {
  dispatch({
    type: 'SET_USER_DATA',
    payload: { accessToken, refreshToken, username, email },
  });
};

export const logoutUser = (dispatch) => {
  dispatch({
    type: 'USER_LOGOUT',
  });
};
