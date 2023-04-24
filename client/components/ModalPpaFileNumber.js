import { Button, DialogActions, DialogContent, DialogTitle, FormGroup, Grid, ListItemText, ListItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withDifferedTransactions } from 'optigo-redux';

import DialogWrapper from './ui/DialogWrapper';
import { getErrorMessage, handleChangeFields } from '../utils/form';
import TextFieldUi from './ui/TextField';
import styled from 'styled-components';
import WalletIcon from '@material-ui/icons/AccountBalanceWallet';

const ButtonWrapper = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const initialState = {
  errors: {
    ppaFileNumber: false,
  },
  ppaFileNumberModalOpened: false,
  loading: false,
  ppaFileNumber: '',
};

class ModalPpaFileNumber extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...initialState,
    };
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    const regex = /^[0-9\b]+$/;

    for (const name of ['ppaFileNumber']) {
      if (!this.state[name].trim() || regex.test(this.state[name]) === false
        || this.state[name].length < 4 || this.state[name] === '0000') {
        valid = false;
        errors[name] = true;
      }
    }

    this.setState({ errors });

    return valid;
  }

  getErrorMessage = getErrorMessage.bind(this);

  handleChangeFields = handleChangeFields.bind(this);

  keepMenuInContext = (value) => {
    const { handleTogglePpaFileNumberModal } = this.props;
    handleTogglePpaFileNumberModal(value);
  }

  handleClose = () => {
    const { fileToGenerate } = this.props;
    this.setState(initialState);

    if (fileToGenerate === 'ppa') {
      this.keepMenuInContext(false);
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const { fileToGenerate, generateDddFile, generatePpaFile } = this.props;
      const { ppaFileNumber } = this.state;

      if (fileToGenerate === 'ppa') {
        await generatePpaFile({
          ppa_file_number: ppaFileNumber,
        });
      } else {
        await generateDddFile({
          ddd_file_number: ppaFileNumber,
        });
      }
      this.props.refreshList();
      this.handleClose();
    }
  };

  handleOpenModal = (fileNumber) => {
    const { fileToGenerate } = this.props;

    this.setState({ ppaFileNumberModalOpened: true, ppaFileNumber: fileNumber });

    if (fileToGenerate === 'ppa') {
      this.keepMenuInContext(true);
    }
  }

  handleActionsButton = () => {
    const { fileNumber, differedTransactions, fileToGenerate } = this.props;

    if (fileToGenerate === 'ddd') {
      return (
        <ButtonWrapper>
          <Grid container justify="center">
            <Grid item>
              {differedTransactions.length > 0 &&
              <Button onClick={() => this.handleOpenModal(fileNumber)} variant="contained">
                <FormattedMessage id="differed_transaction.generate_file" />
              </Button>
              }
            </Grid>
          </Grid>
        </ButtonWrapper>
      );
    }
    return (
      <ListItem id="cpbr-add-ppa-file-number" onClick={() => this.handleOpenModal('')} button>
        <WalletIcon classes={{ root: 'menu-icon-color' }} />
        <ListItemText className="adjust-padd-right" primary={<FormattedMessage id="common.title.ppa_file_no" />} />
      </ListItem>
    );
  }

  render() {
    const {
      errors, loading, ppaFileNumber, ppaFileNumberModalOpened,
    } = this.state;

    return (
      <div>
        { this.handleActionsButton() }
        <DialogWrapper onClose={this.handleClose} open={ppaFileNumberModalOpened}>
          <DialogTitle><FormattedMessage id="ppa.add_file_number" /></DialogTitle>
          <DialogContent>
            <form onSubmit={this.handleSubmit}>
              <FormGroup>
                <TextFieldUi
                  disabled={loading}
                  error={errors.ppaFileNumber}
                  helperText={this.getErrorMessage('ppaFileNumber', 'invalid')}
                  id="cpbr-ppa-file-number"
                  inputProps={{ maxLength: 4 }}
                  label={<FormattedMessage id="ppa.file_number" />}
                  onChange={this.handleChangeFields('ppaFileNumber')}
                  placeholder="ex: 0001"
                  value={ppaFileNumber || ''}
                />
              </FormGroup>
            </form>
          </DialogContent>

          <DialogActions>
            <Button color="default" onClick={this.handleClose}>
              <FormattedMessage id="cancel" />
            </Button>

            <Button disabled={loading} onClick={this.handleSubmit} variant="contained">
              <FormattedMessage id="ppa.generate_file" />
            </Button>
          </DialogActions>
        </DialogWrapper>
      </div>
    );
  }
}

ModalPpaFileNumber.defaultProps = {
  fileToGenerate: 'ppa',
};

ModalPpaFileNumber.propTypes = {
  actionName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  generateDddFile: PropTypes.func.isRequired,
  generatePpaFile: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  fileToGenerate: PropTypes.string,
  fileNumber: PropTypes.string,
};

export default withDifferedTransactions(ModalPpaFileNumber);
