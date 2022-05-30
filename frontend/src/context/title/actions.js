export const setDocumentTitle = (dispatch, { title }) => {
  dispatch({
    type: 'SET_DOCUMENT_TITLE',
    payload: title,
  });
};

export const setPageTitle = (dispatch, { title }) => {
  dispatch({
    type: 'SET_PAGE_TITLE',
    payload: title,
  });
};

export const setTitle = (dispatch, { pageTitle, documentTitle }) => {
  dispatch({
    type: 'SET_BOTH',
    payload: {
      documentTitle: documentTitle,
      pageTitle: pageTitle,
    },
  });
};
