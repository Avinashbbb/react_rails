import { Button, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { withUnits } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

import DialogWrapper from './ui/DialogWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';
import SelectUi from './ui/Select';
import withUsers from '../containers/withUsers';

const initialState = {
  errors: {
    name: false,
    userId: false,
  },
  name: '',
  userId: '-1',
};

class ModalUnit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
      ...props.unit,
    };
  }

  componentDidMount() {
    this.fetchUsers();
  }

  componentWillUnmount() {
    this.props.flushUsers();
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    const { userId } = this.state;

    // Validate the presence
    for (const name of ['name']) {
      if (!this.state[name].trim()) {
        valid = false;
        errors[name] = true;
      }
    }

    if (userId === '-1') {
      valid = false;
      errors.userId = true;
    }

    this.setState({ errors });

    return valid;
  }

  getErrorMessage = getErrorMessage.bind(this);

  fetchUsers = () => {
    this.props.fetchUsersByFranchise(this.props.match.params.franchiseId);
  };

  handleChangeFields = handleChangeFields.bind(this);

  handleChangeUser = ({ target }) => {
    const userId = target.value;

    this.setState({
      errors: {
        ...initialState.errors,
        userId: false,
      },
      userId,
    });
  };

  handleClose = () => {
    this.setState(initialState);
    this.props.onClose();
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const {
        unit, createUnit, editUnit, match, refreshList,
      } = this.props;

      const { name, userId } = this.state;

      const { id } = unit;
      const method = id ? editUnit : createUnit;

      await method(match.params.franchiseId, {
        name,
        user_id: userId,
      }, id);

      this.setState(initialState);

      refreshList();
    }
  };

  renderMenuItems = (label, data, key) => ([
    <MenuItem key="-1" value="-1">{label}</MenuItem>,
    ...data.map(({ id, ...remainingData }) => (
      <MenuItem key={id} value={id}>{remainingData[key]}</MenuItem>
    )),
  ]);

  render() {
    const {
      actionName,
      intl,
      users,
    } = this.props;

    const {
      errors,
      name,
      userId,
    } = this.state;

    const { formatMessage } = intl;

    const modalTitle = actionName.props.id === 'add' ? <FormattedMessage id="add_unit" /> : <FormattedMessage id="edit_unit" />;

    return (
      <DialogWrapper onClose={this.handleClose} open={this.props.open}>
        <DialogTitle>{modalTitle}</DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>

            <FormGroupWrapper>
              <TextFieldUi
                error={errors.name}
                helperText={this.getErrorMessage('name')}
                id="cpbr-name"
                label={<FormattedMessage id="units.name" />}
                onChange={this.handleChangeFields('name')}
                value={name || ''}
              />
            </FormGroupWrapper>

            <FormGroupWrapper>
              <SelectUi
                error={errors.userId}
                formControlError={errors.userId}
                formHelperErrorMsg={this.getErrorMessage('userId')}
                id="cpbr-users"
                inputLabelText={<FormattedMessage id="users" />}
                onChange={this.handleChangeUser}
                value={userId || ''}
              >
                {this.renderMenuItems(<FormattedMessage id="select_user" />, users, 'name')}
              </SelectUi>
            </FormGroupWrapper>
          </form>
        </DialogContent>

        <DialogActions>
          <Button color="default" onClick={this.handleClose}>
            <FormattedMessage id="cancel" />
          </Button>

          <Button onClick={this.handleSubmit} variant="contained">
            {actionName}
          </Button>
        </DialogActions>
      </DialogWrapper>
    );
  }
}

ModalUnit.defaultProps = {
  unit: {},
};

ModalUnit.propTypes = {
  actionName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  unit: PropTypes.object,
  createUnit: PropTypes.func.isRequired,
  editUnit: PropTypes.func.isRequired,
  fetchUsersByFranchise: PropTypes.func.isRequired,
  flushUsers: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withUsers(withUnits(withRouter(injectIntl(ModalUnit))));
