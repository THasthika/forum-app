export const modeReducer = (state, { type }) => {
  switch (type) {
    case 'TOGGLE_THEME':
      return state === 'light' ? 'dark' : 'light';
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};
