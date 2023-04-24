import { Button, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, MenuItem } from '@material-ui/core';
import moment from 'moment';
import { withCustomerLocations, withJobs, withJobTemplates, withLocations, withUnits } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import DatePicker from './form/DatePickerMui';
import DialogWrapper from './ui/DialogWrapper';
import FlexRowWrapper from './ui/FlexRowWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import HalfFormControl from './ui/HalfFormControl';
import SelectUi from './ui/Select';
import SelectHalfUi from './ui/SelectHalf';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';
import { formattedDate } from '../utils/dates';

const initialState = {
  errors: {
    jobTemplateId: false,
    customerLocationId: false,
    startDate: false,
    unitId: false,
  },
  averageDuration: '',
  jobTemplateId: '-1',
  noteSchedule: '',
  startDate: formattedDate(),
  supplierLocationId: '-1',
  unitId: '-1',
};

class ModalJob extends PureComponent {
  state = {
    ...initialState,
    customerLocationId: this.props.customerItem.locationId,
  };

  componentDidMount() {
    this.fetchCustomerLocations();
    this.fetchUnits();
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    for (const name of ['jobTemplateId', 'customerLocationId', 'unitId']) {
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
      startDate: formattedDate(date),
    });
  };

  handleClose = () => {
    this.setState(initialState);
    this.props.onClose();
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const { createJob, match, refreshList } = this.props;

      const {
        averageDuration,
        jobTemplateId,
        customerLocationId,
        noteSchedule,
        startDate,
        supplierLocationId,
        unitId,
      } = this.state;

      await createJob(match.params.customerItemId, {
        average_duration: averageDuration.trim(),
        job_template_id: jobTemplateId,
        customer_location_id: customerLocationId,
        note_schedule: noteSchedule.trim(),
        start_date: startDate,
        supplier_location_id: supplierLocationId,
        unit_id: unitId,
      });

      this.setState(initialState);

      refreshList();
    }
  };

  handleToggleWarningbModal = jobModalOpened => () => {
    this.setState({
      jobModalOpened,
    });
  };

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
      jobTemplateId,
      customerLocationId,
      noteSchedule,
      startDate,
      unitId,
    } = this.state;

    const {
      customerLocations, jobTemplates, open, units,
    } = this.props;

    return (
      <DialogWrapper onClose={this.handleClose} open={open}>
        <DialogTitle><FormattedMessage id="add_job" /></DialogTitle>

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
                  error={errors.jobTemplateId}
                  formControlError={errors.jobTemplateId}
                  formHelperErrorMsg={this.getErrorMessage('customerLocationId')}
                  id="cpbr-job-template"
                  inputLabelText={<FormattedMessage id="flow" />}
                  onChange={this.handleChangeFields('jobTemplateId')}
                  value={`${jobTemplateId}`}
                >
                  {this.renderMenuItems(<FormattedMessage id="select_flow" />, jobTemplates, 'kind')}
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

        <DialogActions>
          <Button color="default" onClick={this.handleClose}>
            <FormattedMessage id="cancel" />
          </Button>

          <Button onClick={this.handleSubmit} variant="contained">
            <FormattedMessage id="add" />
          </Button>
        </DialogActions>
      </DialogWrapper>
    );
  }
}

ModalJob.propTypes = {
  createJob: PropTypes.func.isRequired,
  customerItem: PropTypes.object.isRequired,
  customerLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchCustomerLocations: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
  jobTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  refreshList: PropTypes.func.isRequired,
};

// eslint-disable-next-line max-len
export default withJobs(withJobTemplates(withCustomerLocations(withLocations(withRouter(withUnits(ModalJob))))));
