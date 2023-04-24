import {Button, DialogActions, DialogContent, DialogTitle, FormGroup} from '@material-ui/core';
import { withDifferedTransactions } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import DialogWrapper from './ui/DialogWrapper';
import { getErrorMessage, handleChangeFields } from '../utils/form';
import TextFieldUi from "./ui/TextField";

const initialState = {
  errors: {
    amount: false,
  },
  amount: '',
};

class ModalDifferedTransactionCredit extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
      ...props.differedTransactionCredit,
    };
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    for (const name of ['amount']) {
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
        differedTransactionCredit, editDifferedTransaction, refreshList,
      } = this.props;

      const { amount } = this.state;

      const { id } = differedTransactionCredit;

      await editDifferedTransaction({amount}, id);

      this.setState(initialState);

      refreshList();
      this.handleClose();
    }
  };

  render() {
    const { errors, amount } = this.state;

    return (
      <div>
        <DialogWrapper onClose={this.handleClose} open={this.props.open}>
          <DialogTitle><FormattedMessage id="edit_differed_transaction" /></DialogTitle>

          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <FormGroup>
                <TextFieldUi
                  error={errors.amount}
                  helperText={this.getErrorMessage('amount')}
                  id="cpbr-amount"
                  inputProps={{ min: 0 }}
                  label={<FormattedMessage id="differed_transaction.amount" />}
                  onChange={this.handleChangeFields('amount')}
                  value={amount || ''}
                  type="number"
                />
              </FormGroup>
            </form>
          </DialogContent>

          <DialogActions>
            <Button color="default" onClick={this.handleClose}>
              <FormattedMessage id="cancel" />
            </Button>

            <Button onClick={this.handleSubmit} variant="contained">
              <FormattedMessage id="save" />
            </Button>
          </DialogActions>
        </DialogWrapper>
      </div>
    );
  }
}

ModalDifferedTransactionCredit.defaultProps = {
  differedTransactionCredit: {},
};

ModalDifferedTransactionCredit.propTypes = {
  differedTransactionCredit: PropTypes.object,
  editDifferedTransaction: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withDifferedTransactions(ModalDifferedTransactionCredit);
