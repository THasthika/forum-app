export const setUserData = (dispatch, { token, name, email }) => {
  dispatch({
    type: 'SET_USER_DATA',
    payload: { token, name, email },
  });
};

export const logoutUser = (dispatch) => {
  dispatch({
    type: 'USER_LOGOUT',
  });
};
