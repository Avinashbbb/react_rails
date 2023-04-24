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
import RecurrenceAnnualy from './RecurrenceAnnualy';
import RecurrenceMonthly from './RecurrenceMonthly';
import RecurrenceWeekly from './RecurrenceWeekly';
import RecurrenceDaily from './RecurrenceDaily';
import SelectUi from './ui/Select';
import SelectHalfUi from './ui/SelectHalf';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';
import { formattedDate } from '../utils/dates';

const frequencies = [
  { label: <FormattedMessage id="frequencies.daily" />, value: 'DAILY' },
  { label: <FormattedMessage id="frequencies.weekly" />, value: 'WEEKLY' },
  { label: <FormattedMessage id="frequencies.monthly" />, value: 'MONTHLY' },
  { label: <FormattedMessage id="frequencies.annualy" />, value: 'ANNUALY' },
];

const initialState = {
  errors: {
    customerLocationId: false,
    jobTemplateId: false,
    frequency: false,
    recurrence: false,
    startDate: false,
    unitId: false,
  },
  averageDuration: '',
  customerLocationId: '-1',
  frequency: frequencies[0].value,
  jobTemplateId: '-1',
  noteSchedule: '',
  recurrence: { interval: null },
  startDate: formattedDate(),
  supplierLocationId: '-1',
  unitId: '-1',
};

class ModalRecurrence extends PureComponent {
  state = {
    ...initialState,
  };

  componentDidMount() {
    this.fetchCustomerLocations();
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    for (const name of ['frequency', 'customerLocationId', 'jobTemplateId', 'unitId']) {
      if (this.state[name] === '-1') {
        valid = false;
        errors[name] = true;
      }
    }

    if (!this.state.recurrence.interval) {
      valid = false;
      errors.recurrence = true;
    }

    if (this.state.recurrence.type === 'monthly-DOM') {
      if (!this.state.recurrence.days_of_month ||
          this.state.recurrence.days_of_month.length === 0) {
        valid = false;
        errors.recurrence = true;
      }
    }

    if (this.state.recurrence.type === 'monthly-DOW') {
      if (!this.state.recurrence.days_of_week ||
          Object.keys(this.state.recurrence.days_of_week).every(i =>
            this.state.recurrence.days_of_week[i].length === 0)) {
        valid = false;
        errors.recurrence = true;
      }
    }

    if (this.state.recurrence.type === 'weekly') {
      if (!this.state.recurrence.days || this.state.recurrence.days.length === 0) {
        valid = false;
        errors.recurrence = true;
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

  handleChangeFrequency = ({ target }) => {
    this.setState({
      errors: {
        ...this.state.errors,
        frequency: false,
        recurrence: false,
      },
      frequency: target.value,
      recurrence: {},
    });
  };

  handleChangeRecurrenceInterval = type => ({ target }) => {
    this.setState({
      errors: {
        ...this.state.errors,
        recurrence: false,
      },
      recurrence: {
        ...this.state.recurrence,
        interval: target.value,
        type,
      },
    });
  };

  handleChangeRecurrenceDays = key => (days) => {
    this.setState({
      recurrence: {
        ...this.state.recurrence,
        [key]: days,
      },
    });
  };

  handleChangeRecurrenceType = (type) => {
    this.setState({
      recurrence: {
        ...this.state.recurrence,
        type,
      },
    });
  };

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

  handleDisplayFrequencyComponent = () => {
    const { frequency, recurrence } = this.state;

    let Component;
    let onIntervalChange;

    switch (frequency) {
      case 'ANNUALY': {
        Component = RecurrenceAnnualy;
        onIntervalChange = this.handleChangeRecurrenceInterval('yearly');
        break;
      }
      case 'MONTHLY': {
        Component = RecurrenceMonthly;
        onIntervalChange = this.handleChangeRecurrenceInterval;
        break;
      }
      case 'WEEKLY': {
        Component = RecurrenceWeekly;
        onIntervalChange = this.handleChangeRecurrenceInterval('weekly');
        break;
      }
      default: {
        Component = RecurrenceDaily;
        onIntervalChange = this.handleChangeRecurrenceInterval('daily');
        break;
      }
    }

    return (
      <Component
        error={this.getErrorMessage('recurrence')}
        onDaysChange={this.handleChangeRecurrenceDays}
        onIntervalChange={onIntervalChange}
        onTypeChange={this.handleChangeRecurrenceType}
        value={recurrence.interval}
      />
    );
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
        recurrence,
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
        recurrence,
      });

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
      averageDuration,
      errors,
      frequency,
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

            <FormGroupWrapper>
              <FlexRowWrapper>

                <SelectHalfUi
                  error={errors.frequency}
                  formControlError={errors.frequency}
                  formHelperErrorMsg={this.getErrorMessage('frequency')}
                  id="cpbr-job-frequency"
                  inputLabelText={<FormattedMessage id="frequency" />}
                  onChange={this.handleChangeFrequency}
                  value={frequency}
                >
                  {frequencies.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </SelectHalfUi>
              </FlexRowWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper>
              {this.handleDisplayFrequencyComponent()}
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

ModalRecurrence.propTypes = {
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
export default withJobs(withJobTemplates(withCustomerLocations(withLocations(withRouter(withUnits(ModalRecurrence))))));
