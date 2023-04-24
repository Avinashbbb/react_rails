import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toList } from 'optigo-redux/lib/utils/data';

import { fetchUsersByFranchise, flushUsers } from '../actions/users';

const mapStateToProps = ({ users }) => {
  const { count, data, loading } = users;

  const usersList = toList(data);

  return {
    users: usersList,
    usersCount: count || 0,
    usersLoading: loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchUsersByFranchise,
    flushUsers,
  }, dispatch);
};

const withUsers = (WrappedComponent) => {
  class ConnectedComponent extends PureComponent {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(ConnectedComponent);
};

export default withUsers;
