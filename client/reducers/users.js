const initialState = {
  count: 0,
  error: false,
  loading: true,
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING_USERS':
      return {
        ...state,
        loading: true,
      };
    case 'LOADED_USERS':
      return {
        ...state,
        loading: false,
      };
    case 'FLUSH_USERS':
      return {
        ...initialState,
      };
    case 'SET_USERS':
      const { count, data } = action;

      return {
        ...state,
        data,
        count,
      };
    default:
      return state;
  }
};

export default users;
