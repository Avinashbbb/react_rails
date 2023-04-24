import { destroy, get, post, put } from 'rails-fetch';

export const fetchUsersByFranchise = franchiseId => async (dispatch) => {
  try {
    dispatch({ type: 'LOADING_USERS' });

    const response = await get(`/api/v1/users?franchise_id=${franchiseId}`);
    const { count, instances } = await response.json();

    dispatch({ type: 'SET_USERS', data: instances.data, count });
    dispatch({ type: 'LOADED_USERS' });
    return instances.data;
  } catch (error) {
    dispatch({ type: 'SET_ERROR', error });
    return [];
  }
};

export const flushUsers = () => async (dispatch) => {
  try {
    dispatch({ type: 'FLUSH_USERS' });
  } catch (error) {
    console.log(error); // TODO error handling
  }
};
