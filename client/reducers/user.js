const initialState = {
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case 'FLUSH_CURRENT_USER': {
      return initialState;
    }
    case 'LOADED_CURRENT_USER': {
      return {
        ...state,
        loading: false,
      };
    }
    case 'LOADING_CURRENT_USER':
      return {
        ...state,
        loading: true,
      };
    case 'SET_CURRENT_USER': {
      const { data, count } = action;

      return {
        ...state,
        data,
        count,
      };
    }
    default: {
      return state;
    }
  }
};

export default user;
