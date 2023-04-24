import { reducers as optigoReducers } from 'optigo-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
// import logger from 'redux-logger';

import user from '../reducers/user';
import users from '../reducers/users';

const reducers = combineReducers({
  ...optigoReducers,
  user,
  users,
});

const { __PRELOADED_STATE__ } = global;
const { redux } = __PRELOADED_STATE__;

export default createStore(reducers, redux, applyMiddleware(thunk));
