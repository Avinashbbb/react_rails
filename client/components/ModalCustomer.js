import { Button, DialogActions, DialogContent, DialogTitle, FormGroup, TextField } from '@material-ui/core';
import { withCustomers } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import DialogWrapper from './ui/DialogWrapper';
import { getErrorMessage, handleChangeFields } from '../utils/form';

const initialState = {
  errors: {
    name: false,
  },
  name: '',
};

class ModalCustomer extends PureComponent {
  constructor(props) {
    super();

    this.state = {
      ...initialState,
      ...props.customer,
    };
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    for (const name of ['name']) {
      if (!this.state[name].trim()) {
        valid = false;
        errors[name] = true;
      }
    }

    this.setState({ errors });

    return valid;
  }

  getErrorMessage = getErrorMessage.bind(this);

  handleChangeFields = handleChangeFields.bind(this);

  handleClose = () => {
    this.setState(initialState);
    this.props.onClose();
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const {
        customer, createCustomer, editCustomer, refreshList,
      } = this.props;

      const { name } = this.state;

      const { id } = customer;
      const method = id ? editCustomer : createCustomer;

      await method({
        name,
      }, id);

      this.setState(initialState);

      refreshList();
    }
  };

  render() {
    const { actionName } = this.props;
    const { errors, name } = this.state;
    const modalTitle = actionName.props.id === 'add' ? <FormattedMessage id="add_customer" /> : <FormattedMessage id="edit_customer" />;

    return (
      <DialogWrapper onClose={this.handleClose} open={this.props.open}>
        <DialogTitle>{modalTitle}</DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <FormGroup>
              <TextField
                error={errors.name}
                helperText={this.getErrorMessage('name')}
                id="cpbr-name"
                label={<FormattedMessage id="name_simple" />}
                onChange={this.handleChangeFields('name')}
                value={name || ''}
              />
            </FormGroup>
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

ModalCustomer.defaultProps = {
  customer: {},
};

ModalCustomer.propTypes = {
  actionName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  customer: PropTypes.object,
  createCustomer: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withCustomers(ModalCustomer);
