import { Button, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, MenuItem } from '@material-ui/core';
import moment from 'moment';
import { withCustomerLocations, withJobs, withJobTemplates, withLocations, withUnits } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import DatePicker from './form/DatePickerMui';
import ModalWarning from './ModalWarning';
import DialogWrapper from './ui/DialogWrapper';
import FlexRowWrapper from './ui/FlexRowWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import HalfFormControl from './ui/HalfFormControl';
import SelectUi from './ui/Select';
import SelectHalfUi from './ui/SelectHalf';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';
import { formattedDate } from '../utils/dates';

const ButtonDelete = styled(Button)`
  && {
    color: ${({ theme }) => theme.app.warningColor};
  }
`;

const DialogActionsSC = styled(DialogActions)`
  && {
    justify-content: space-between;
    button {
       margin: 0 4px;
    }
  }
`;

const initialState = {
  errors: {
    kind: false,
    customerLocationId: false,
    startDate: false,
    unitId: false,
  },
  deleteWarningModalOpened: false,
};

class ModalEditJob extends PureComponent {
  state = {
    ...initialState,
    ...this.props.job,
  };

  componentDidMount() {
    this.fetchCustomerLocations();
    this.fetchUnits();
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    for (const name of ['customerLocationId', 'kind', 'unitId']) {
      if (this.state[name] === '-1') {
        valid = false;
        errors[name] = true;
      }
    }

    if (!this.state.startDate) {
      valid = false;
      errors.startDate = true;
    }

    this.setState({ errors });

    return valid;
  }

  getErrorMessage = getErrorMessage.bind(this);

  fetchCustomerLocations = () => {
    const { customerItem, fetchCustomerLocations } = this.props;

    fetchCustomerLocations(customerItem.customerId, { limit: 200 });
  };

  fetchUnits = () => {
    const { customerItem, fetchUnits } = this.props;

    fetchUnits(customerItem.franchiseId, {});
  };

  handleChangeFields = handleChangeFields.bind(this);

  handleChangeStartDate = (date) => {
    this.setState({
      errors: {
        ...this.state.errors,
        startDate: false,
      },
      assignmentDate: formattedDate(date),
      startDate: formattedDate(date),
    });
  };

  handleClose = () => {
    this.setState({
      ...initialState,
      ...this.props.job,
    });

    this.props.onClose();
  };

  handleDeleteJob = async () => {
    const { deleteJob, history, job } = this.props;
    const { id, customerItemId } = job;

    await deleteJob(id);

    history.replace(`/preparations/${customerItemId}`);
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const { job, refreshList, updateJob } = this.props;

      const {
        assignmentDate,
        averageDuration,
        customerLocationId,
        kind,
        noteSchedule,
        startDate,
        supplierLocationId,
        unitId,
      } = this.state;

      await updateJob(job.id, {
        assignment_date: assignmentDate,
        average_duration: averageDuration.trim(),
        customer_location_id: customerLocationId,
        note_schedule: noteSchedule.trim(),
        start_date: startDate,
        supplier_location_id: supplierLocationId,
        kind,
        unit_id: unitId,
      });

      this.setState(initialState);

      refreshList();
    }
  };

  handleToggleWarningbModal = deleteWarningModalOpened => () => {
    this.setState({
      deleteWarningModalOpened,
    });
  };

  renderJobTemplatesMenuItems = () => ([
    <MenuItem key="-1" value="-1">
      <FormattedMessage id="select_flow" />
    </MenuItem>,

    ...this.props.jobTemplates.map(({ id, kind }) => (
      <MenuItem key={id} value={kind}>{kind}</MenuItem>
    )),
  ]);

  renderMenuItems = (label, data, key) => ([
    <MenuItem key="-1" value="-1">{label}</MenuItem>,

    ...data.map(({ id, ...remainingData }) => (
      <MenuItem key={id} value={id}>{remainingData[key]}</MenuItem>
    )),
  ]);

  render() {
    const {
      averageDuration,
      errors,
      deleteWarningModalOpened,
      customerLocationId,
      kind,
      noteSchedule,
      startDate,
      unitId,
    } = this.state;

    const { customerLocations, open, units } = this.props;

    return (
      <DialogWrapper onClose={this.handleClose} open={open}>
        <DialogTitle><FormattedMessage id="edit_job" /></DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>

            <FormGroupWrapper>
              <SelectUi
                error={errors.customerLocationId}
                formControlError={errors.customerLocationId}
                formHelperErrorMsg={this.getErrorMessage('customerLocationId')}
                id="cpbr-customer-location"
                inputLabelText={<FormattedMessage id="location" />}
                onChange={this.handleChangeFields('customerLocationId')}
                value={`${customerLocationId}`}
              >
                {this.renderMenuItems(<FormattedMessage id="select_location" />, customerLocations, 'name')}
              </SelectUi>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <FormControl error={errors.startDate}>
                <DatePicker
                  error={errors.startDate}
                  label="Date"
                  value={moment(startDate)}
                  onChange={this.handleChangeStartDate}
                  variant="outlined"
                  disablePast
                />

                <FormHelperText>{this.getErrorMessage('startDate')}</FormHelperText>
              </FormControl>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <FlexRowWrapper>
                <SelectHalfUi
                  error={errors.kind}
                  formControlError={errors.kind}
                  formHelperErrorMsg={this.getErrorMessage('customerLocationId')}
                  id="cpbr-job-template"
                  inputLabelText={<FormattedMessage id="flow" />}
                  onChange={this.handleChangeFields('kind')}
                  value={kind}
                >
                  {this.renderJobTemplatesMenuItems()}
                </SelectHalfUi>

                <SelectHalfUi
                  error={errors.unitId}
                  formControlError={errors.unitId}
                  formHelperErrorMsg={this.getErrorMessage('unitId')}
                  id="cpbr-unit"
                  inputLabelText={<FormattedMessage id="unit" />}
                  onChange={this.handleChangeFields('unitId')}
                  value={`${unitId}`}
                >
                  {this.renderMenuItems(<FormattedMessage id="select_unit" />, units, 'name')}
                </SelectHalfUi>
              </FlexRowWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <FlexRowWrapper>
                <HalfFormControl>
                  <TextFieldUi
                    error={errors.noteSchedule}
                    helperText={this.getErrorMessage('noteSchedule')}
                    label={<FormattedMessage id="collect_hour" />}
                    onChange={this.handleChangeFields('noteSchedule')}
                    value={noteSchedule}
                  />
                </HalfFormControl>

                <HalfFormControl>
                  <TextFieldUi
                    error={errors.averageDuration}
                    helperText={this.getErrorMessage('averageDuration')}
                    label={<FormattedMessage id="intervention_duration" />}
                    onChange={this.handleChangeFields('averageDuration')}
                    value={averageDuration}
                  />
                </HalfFormControl>
              </FlexRowWrapper>
            </FormGroupWrapper>
          </form>
        </DialogContent>

        <DialogActionsSC>
          <ButtonDelete onClick={this.handleToggleWarningbModal(true)}>
            <FormattedMessage id="delete_job" />
          </ButtonDelete>

          <span>
            <Button color="default" onClick={this.handleClose}>
              <FormattedMessage id="cancel" />
            </Button>

            <Button onClick={this.handleSubmit} variant="contained">
              <FormattedMessage id="edit" />
            </Button>
          </span>

        </DialogActionsSC>

        <ModalWarning
          onCancel={this.handleToggleWarningbModal(false)}
          onSubmit={this.handleDeleteJob}
          open={deleteWarningModalOpened}
          title={<FormattedMessage id="warning" />}
        >
          <FormattedMessage id="warning_delete_job" />
        </ModalWarning>
      </DialogWrapper>
    );
  }
}

ModalEditJob.propTypes = {
  customerItem: PropTypes.object.isRequired,
  customerLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteJob: PropTypes.func.isRequired,
  fetchCustomerLocations: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
  job: PropTypes.object.isRequired,
  jobTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  refreshList: PropTypes.func.isRequired,
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
  updateJob: PropTypes.func.isRequired,
};

// eslint-disable-next-line max-len
export default withJobs(withJobTemplates(withCustomerLocations(withLocations(withRouter(withUnits(ModalEditJob))))));
