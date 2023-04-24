import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { withContacts } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

import DialogWrapper from './ui/DialogWrapper';
import FlexRowWrapper from './ui/FlexRowWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import HalfFormControl from './ui/HalfFormControl';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';

const initialState = {
  errors: {
    cellPhone: false,
    email: false,
    firstName: false,
    homePhone: false,
    lastName: false,
    workPhone: false,
    workPhoneExt: false,
  },
  cellPhone: '',
  email: '',
  firstName: '',
  homePhone: '',
  lastName: '',
  workPhone: '',
  workPhoneExt: '',
};

class ModalContact extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
      ...props.contact,
    };
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    // Validate the presence
    for (const name of ['email', 'firstName', 'lastName']) {
      if (!this.state[name].trim()) {
        valid = false;
        errors[name] = true;
      }
    }

    // Validate if phone is a number and has 10 digits
    for (const name of ['homePhone', 'workPhone', 'cellPhone']) {
      const phoneNumber = this.state[name];
      phoneNumber.replace(/[^\d]/g, '');

      if (phoneNumber.length !== 0 && phoneNumber.length !== 10) {
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
        contact, createContact, editContact, match, refreshList,
      } = this.props;

      const {
        cellPhone, email, firstName, homePhone, lastName, workPhone, workPhoneExt,
      } = this.state;

      const { id } = contact;
      const method = id ? editContact : createContact;

      await method(match.params.customerId, {
        cell_phone: cellPhone,
        first_name: firstName,
        home_phone: homePhone,
        last_name: lastName,
        work_phone: workPhone,
        work_phone_ext: workPhoneExt,
        email,
      }, id);

      this.setState(initialState);

      refreshList();
    }
  };

  render() {
    const {
      actionName,
      intl,
    } = this.props;

    const {
      cellPhone,
      email,
      errors,
      firstName,
      homePhone,
      lastName,
      workPhone,
      workPhoneExt,
    } = this.state;

    const { formatMessage } = intl;

    const modalTitle = actionName.props.id === 'add' ? <FormattedMessage id="add_contact" /> : <FormattedMessage id="edit_contact" />;

    return (
      <DialogWrapper onClose={this.handleClose} open={this.props.open}>
        <DialogTitle>{modalTitle}</DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>

            <FormGroupWrapper>
              <FlexRowWrapper>
                <HalfFormControl>
                  <TextFieldUi
                    error={errors.firstName}
                    fullWidth
                    helperText={this.getErrorMessage('firstName')}
                    id="cpbr-first-name"
                    label={<FormattedMessage id="contact.first_name" />}
                    onChange={this.handleChangeFields('firstName')}
                    value={firstName || ''}
                  />
                </HalfFormControl>

                <HalfFormControl>
                  <TextFieldUi
                    error={errors.lastName}
                    fullWidth
                    helperText={this.getErrorMessage('lastName')}
                    id="cpbr-last-name"
                    label={<FormattedMessage id="contact.last_name" />}
                    onChange={this.handleChangeFields('lastName')}
                    value={lastName || ''}
                  />
                </HalfFormControl>
              </FlexRowWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <TextFieldUi
                error={errors.email}
                helperText={this.getErrorMessage('email')}
                id="cpbr-email"
                label={<FormattedMessage id="contact.email" />}
                onChange={this.handleChangeFields('email')}
                value={email || ''}
              />
            </FormGroupWrapper>

            <FormGroupWrapper>
              <FlexRowWrapper>
                <HalfFormControl>
                  <TextFieldUi
                    error={errors.homePhone}
                    fullWidth
                    helperText={this.getErrorMessage('homePhone', 'invalid')}
                    id="cpbr-home-phone"
                    label={`${formatMessage({ id: 'contact.home_phone_full' })} ${formatMessage({ id: 'optional' })}`}
                    onChange={this.handleChangeFields('homePhone')}
                    value={homePhone || ''}
                  />
                </HalfFormControl>
              </FlexRowWrapper>

            </FormGroupWrapper>

            <FormGroupWrapper>
              <FlexRowWrapper>
                <HalfFormControl>
                  <TextFieldUi
                    error={errors.workPhone}
                    fullWidth
                    helperText={this.getErrorMessage('workPhone', 'invalid')}
                    id="cpbr-work-phone"
                    label={`${formatMessage({ id: 'contact.work_phone_full' })} ${formatMessage({ id: 'optional' })}`}
                    onChange={this.handleChangeFields('workPhone')}
                    value={workPhone || ''}
                  />
                </HalfFormControl>

                <HalfFormControl>
                  <TextFieldUi
                    error={errors.workPhoneExt}
                    fullWidth
                    helperText={this.getErrorMessage('workPhoneExt')}
                    id="cpbr-work-phone-ext"
                    label={`${formatMessage({ id: 'contact.ext' })} ${formatMessage({ id: 'optional' })}`}
                    onChange={this.handleChangeFields('workPhoneExt')}
                    value={workPhoneExt || ''}
                  />
                </HalfFormControl>
              </FlexRowWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <FlexRowWrapper>
                <HalfFormControl>
                   <TextFieldUi
                    error={errors.cellPhone}
                    fullWidth
                    helperText={this.getErrorMessage('cellPhone', 'invalid')}
                    id="cpbr-cell-phone"
                    label={`${formatMessage({ id: 'contact.cell_phone_full' })} ${formatMessage({ id: 'optional' })}`}
                    onChange={this.handleChangeFields('cellPhone')}
                    value={cellPhone || ''}
                  />
                </HalfFormControl>

              </FlexRowWrapper>
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

ModalContact.defaultProps = {
  contact: {},
};

ModalContact.propTypes = {
  actionName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  contact: PropTypes.object,
  createContact: PropTypes.func.isRequired,
  editContact: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withContacts(withRouter(injectIntl(ModalContact)));
