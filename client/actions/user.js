import { destroy, get } from 'rails-fetch';
import { setData, setLoaded, setLoading } from '../utils/actions';

const NAME = 'CURRENT_USER';

export const signOut = () => (
  async (dispatch) => {
    try {
      await destroy('/users/sign_out', dispatch);
      window.location = '/users/sign_in'; // eslint-disable-line no-undef
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchCurrentUser = () => (
  async (dispatch) => {
    try {
      dispatch(setLoading(NAME));

      const response = await get('/api/v1/show_current_user');
      const data = await response.json();

      dispatch(setData(NAME, data));
      dispatch(setLoaded(NAME));
      return data;
    } catch (error) {
      console.log(error); // TODO error handling
      return null;
    }
  }
);
