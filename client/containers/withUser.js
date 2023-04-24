import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchCurrentUser, signOut } from '../actions/user';

const mapStateToProps = ({ user }) => ({
  user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCurrentUser,
  signOut,
}, dispatch);

const withUser = (WrappedComponent) => {
  const Component = props => <WrappedComponent {...props} />;

  return connect(mapStateToProps, mapDispatchToProps)(Component);
};

export default withUser;
