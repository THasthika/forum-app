export const titleReducer = (state, { type, payload }) => {
  switch (type) {
    case 'SET_PAGE_TITLE':
      return {
        ...state,
        pageTitle: payload,
      };
    case 'SET_DOCUMENT_TITLE':
      return {
        ...state,
        documentTitle: `${payload} - Forum`,
      };
    case 'SET_BOTH':
      return {
        ...state,
        documentTitle: `${payload.documentTitle} - Forum`,
        pageTitle: payload.pageTitle,
      };
    default:
      throw new Error(`Unhandled action type: ${type}`);
  }
};
