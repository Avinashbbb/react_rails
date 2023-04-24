import { Button, DialogContent, FormControl, Grid } from '@material-ui/core';
import { withFranchise } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import FormGroupWrapper from './ui/FormGroupWrapper';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';
import ModalWarning from './ModalWarning';

class BankAccountData extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialState = {
    errors: {
      accountNumber: false,
      institutionNumber: false,
      transitNumber: false,
    },
    accountNumber: '',
    institutionNumber: '',
    transitNumber: '',
  };

  state = {
    ...this.initialState,
  };

  fetchFranchise = () => {
    const { fetchFranchise, match } = this.props;

    fetchFranchise(match.params.franchiseId);
  }

  get valid() {
    const errors = { ...this.initialState.errors };
    let valid = true;

    const regex = /^[0-9\b]+$/;

    for (const name of ['accountNumber', 'institutionNumber', 'transitNumber']) {
      if (!this.state[name].trim() || regex.test(this.state[name]) === false) {
        valid = false;
        errors[name] = true;
      }
    }

    for (const name of ['accountNumber']) {
      if (this.state[name].length < 7) {
        valid = false;
        errors[name] = true;
      }
    }

    for (const name of ['institutionNumber']) {
      if (this.state[name].length < 3) {
        valid = false;
        errors[name] = true;
      }
    }

    for (const name of ['transitNumber']) {
      if (this.state[name].length < 5) {
        valid = false;
        errors[name] = true;
      }
    }

    this.setState({ errors });

    return valid;
  }

  getErrorMessage = getErrorMessage.bind(this);
  handleChangeFields = handleChangeFields.bind(this);

  handleDeleteBankAccountData = async () => {
    const { deleteBankAccountData, match } = this.props;
    await deleteBankAccountData(match.params.franchiseId, this.state.bankAccountDataToDelete);

    const { bankAccountDataToDelete, deleteBankAccountDataModalOpened } = this.initialState;

    this.setState({
      bankAccountDataToDelete,
      deleteBankAccountDataModalOpened,
    }, this.fetchFranchise());
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const { franchise, createBankAccountData } = this.props;

      const { accountNumber, institutionNumber, transitNumber } = this.state;

      const { data } = franchise;
      const { id } = data;

      await createBankAccountData({
        account_number: accountNumber,
        institution_id: institutionNumber,
        transit: transitNumber,
      }, id);

      this.setState(this.fetchFranchise());
    }
  };

  handleToggleDeleteBankAccountDataModal = (opened, bankAccountDataId) => () => {
    const bankAccountDataToDelete = opened ? bankAccountDataId : this.initialState.bankAccountDataToDelete;

    this.setState({ deleteBankAccountDataModalOpened: opened, bankAccountDataToDelete });
  };

  render() {
    const {
      deleteBankAccountDataModalOpened,
      errors,
      accountNumber,
      institutionNumber,
      transitNumber,
    } = this.state;

    const { franchise } = this.props;
    const { data } = franchise;
    const { has_bank_data, id } = data;

    return (
      <PageContainer>
        <PaperWrapper>
          <DialogContent>
            <form>
              <FormGroupWrapper>
                {!has_bank_data &&
                  <Grid container justify="space-between">
                    <Grid item md={4}>
                      <FormControl fullWidth style={{ padding: '0 5px' }}>
                        <TextFieldUi
                          error={errors.institutionNumber}
                          helperText={this.getErrorMessage('institutionNumber')}
                          id="cpbr-bank-institution-number"
                          inputProps={{ maxLength: 3 }}
                          label={<FormattedMessage id="bank.institution" />}
                          onChange={this.handleChangeFields('institutionNumber')}
                          value={institutionNumber || ''}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={4}>
                      <FormControl fullWidth style={{ padding: '0 5px' }}>
                        <TextFieldUi
                          error={errors.transitNumber}
                          helperText={this.getErrorMessage('transitNumber')}
                          id="cpbr-bank-transit-number"
                          inputProps={{ maxLength: 5 }}
                          label={<FormattedMessage id="bank.transit" />}
                          onChange={this.handleChangeFields('transitNumber')}
                          value={transitNumber || ''}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={4}>
                      <FormControl fullWidth style={{ padding: '0 5px' }}>
                        <TextFieldUi
                          error={errors.accountNumber}
                          helperText={this.getErrorMessage('accountNumber')}
                          id="cpbr-bank-account-number"
                          inputProps={{ maxLength: 7 }}
                          label={<FormattedMessage id="bank.account" />}
                          onChange={this.handleChangeFields('accountNumber')}
                          value={accountNumber || ''}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                }

                {has_bank_data &&
                  <Grid container justify="center">
                    <Grid item>
                      <FormattedMessage id="bank.already_has_data" />
                    </Grid>
                  </Grid>
                }
              </FormGroupWrapper>

              <Grid container justify="center">
                <Grid item>
                  {!has_bank_data &&
                    <Button onClick={this.handleSubmit} variant="contained">
                      <FormattedMessage id="save" />
                    </Button>
                  }

                  {has_bank_data &&
                    <Button
                      id="cpbr-delete-bank-account-data"
                      onClick={this.handleToggleDeleteBankAccountDataModal(true, id)}
                      variant="contained"
                    >
                      <FormattedMessage id="delete" />
                    </Button>
                  }
                </Grid>
              </Grid>
            </form>
          </DialogContent>
        </PaperWrapper>

        <ModalWarning
          onCancel={this.handleToggleDeleteBankAccountDataModal(false)}
          onSubmit={this.handleDeleteBankAccountData}
          open={deleteBankAccountDataModalOpened}
          title={<FormattedMessage id="warning" />}
        >
          <FormattedMessage id="warning_delete_bank_account_data" />
        </ModalWarning>
      </PageContainer>
    );
  }
}

BankAccountData.defaultProps = {
  franchise: {},
};

BankAccountData.propTypes = {
  createBankAccountData: PropTypes.func.isRequired,
  deleteBankAccountData: PropTypes.func.isRequired,
  fetchFranchise: PropTypes.func.isRequired,
  franchise: PropTypes.object,
  match: PropTypes.object.isRequired,
};

export default withRouter(withFranchise(BankAccountData));
