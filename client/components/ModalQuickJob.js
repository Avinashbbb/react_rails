import {orderBy} from 'lodash';
import {Button, DialogActions, DialogContent, DialogTitle, FormHelperText, MenuItem} from '@material-ui/core';
import moment from 'moment';
import {
  withContracts,
  withCustomerLocations,
  withCustomers,
  withCustomerItems,
  withJobs,
  withJobTemplates,
  withLocations,
  withUnits
} from 'optigo-redux';
import PropTypes from 'prop-types';
import React, {Fragment, PureComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {withRouter} from 'react-router-dom';

import DatePicker from './form/DatePickerMui';
import Autocomplete from './ui/Autocomplete';
import DialogWrapper from './ui/DialogWrapper';
import FlexRowWrapper from './ui/FlexRowWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import HalfFormControl from './ui/HalfFormControl';
import SelectUi from './ui/Select';
import SelectHalfUi from './ui/SelectHalf';
import TextFieldUi from './ui/TextField';
import {getErrorMessage, handleChangeFields} from '../utils/form';
import {formattedDate} from '../utils/dates';

const initialState = {
  errors: {
    jobTemplateId: false,
    contractId: false,
    customerId: false,
    customerItemId: false,
    customerLocationId: false,
    startDate: false,
    unitId: false,
  },
  averageDuration: '',
  contractId: '-1',
  customerLocationId: '-1',
  customerId: null,
  customerItemId: '-1',
  jobTemplateId: '-1',
  noteSchedule: '',
  startDate: formattedDate(),
  supplierLocationId: '-1',
  unitId: '-1',
};

class ModalQuickJob extends PureComponent {
  state = {
    ...initialState,
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  componentWillUnmount() {
    this.props.flushCustomers();
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    for (const name of ['customerId', 'customerItemId', 'jobTemplateId', 'customerLocationId', 'unitId']) {
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
    this.props.fetchCustomerLocations(this.state.customerId.value, { limit: 200 });
  };

  fetchCustomers = () => {
    this.props.fetchCustomersWithOperatingContracts({
      limit: -1,
    });
  };

  fetchContracts = () => {
    const {customerId} = this.state;

    this.props.fetchContracts(customerId.value, {
      limit: -1,
      status: 'READY'
    });
  };

  fetchCustomerItems = () => {
    const {contractId, customerId} = this.state;

    if (customerId !== '-1' && contractId !== '-1') {
      this.fetchCustomerLocations();
      this.props.fetchCustomerItemsByContract(contractId, customerId.value, {
        limit: -1,
      });
    }
  };

  handleChangeCustomer = () => (value) => {
    this.setState({
      errors: {
        ...initialState.errors,
        customerId: false,
      },
      contractId: '-1',
      customerItemId: '-1',
      customerId: value,
    }, this.fetchContracts);
  };

  handleChangeContract = ({target}) => {
    const contractId = target.value;

    this.setState({
      errors: {
        ...initialState.errors,
        customerId: false,
      },
      customerItemId: '-1',
      contractId,
    }, this.fetchCustomerItems);
  };

  handleChangeCustomerItem = ({target}) => {
    const customerItemId = target.value;
    const customerItem = this.props.customerItems.find(({id}) => id === customerItemId) || {};

    this.setState({
      errors: {
        ...initialState.errors,
        customerItemId: false,
      },
      customerLocationId: customerItem.locationId,
      customerItemId,
    });
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
      const {createJob, refreshList} = this.props;

      const {
        averageDuration,
        customerItemId,
        customerLocationId,
        jobTemplateId,
        noteSchedule,
        startDate,
        supplierLocationId,
        unitId,
      } = this.state;

      await createJob(customerItemId, {
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

      this.handleClose();
    }
  };

  renderMenuItems = (label, data, key) => ([
    <MenuItem key="-1" value="-1">{label}</MenuItem>,

    ...data.map(({id, ...remainingData}) => (
      <MenuItem key={id} value={id}>{remainingData[key]}</MenuItem>
    )),
  ]);

  renderCustomerList = (data) => {
    const customerList = data.map(({id, name}) => ({value: id, label: name}));

    return orderBy(customerList, ['label'], ['asc']);
  };

  renderCustomer = () => {
    const {customers, customersLoading} = this.props;
    const {customerId, errors} = this.state;

    if (customersLoading || !customers.length) {
      return null;
    }

    return (
      <Autocomplete
        id="cpbr-customers"
        value={customerId}
        options={this.renderCustomerList(customers)}
        onChange={this.handleChangeCustomer(customerId)}
        placeholder="Saisir le nom du client..."
      />
    );
  };

  renderContract = () => {
    const {contracts, contractsLoading} = this.props;
    const {customerId, contractId, errors} = this.state;

    if (customerId === '-1' || contractsLoading || !contracts.length) {
      return null;
    }

    return (
      <FormGroupWrapper>
        <SelectUi
          error={errors.contractId}
          formControlError={errors.contractId}
          formHelperErrorMsg={this.getErrorMessage('contractId')}
          id="cpbr-contract"
          inputLabelText={<FormattedMessage id="contracts"/>}
          onChange={this.handleChangeContract}
          value={`${contractId}`}
        >
          {this.renderMenuItems(<FormattedMessage id="select_contract"/>, contracts, 'name')}
        </SelectUi>
      </FormGroupWrapper>
    );
  };

  renderCustomerItem = () => {
    const {customerItems, customerItemsLoading} = this.props;
    const {contractId, customerItemId, errors} = this.state;

    if (contractId === '-1' || customerItemsLoading || !customerItems.length) {
      return null;
    }

    return (
      <FormGroupWrapper>
        <SelectUi
          error={errors.customerItemId}
          formControlError={errors.customerItemId}
          formHelperErrorMsg={this.getErrorMessage('customerItemId')}
          id="cpbr-customer-items"
          inputLabelText={<FormattedMessage id="customer_items"/>}
          onChange={this.handleChangeCustomerItem}
          value={`${customerItemId}`}
        >
          {this.renderMenuItems(<FormattedMessage id="select_customer_item"/>, customerItems, 'name')}
        </SelectUi>
      </FormGroupWrapper>
    );
  };

  renderForm = () => {
    const {
      averageDuration,
      errors,
      customerLocationId,
      customerItemId,
      jobTemplateId,
      noteSchedule,
      startDate,
      unitId,
    } = this.state;

    const {
      customerLocations, jobTemplates, units,
    } = this.props;

    if (customerItemId === '-1') {
      return null;
    }

    return (
      <Fragment>
        <FormGroupWrapper>
          <SelectUi
            error={errors.customerLocationId}
            formControlError={errors.customerLocationId}
            formHelperErrorMsg={this.getErrorMessage('customerLocationId')}
            id="cpbr-customer-location"
            inputLabelText={<FormattedMessage id="location"/>}
            onChange={this.handleChangeFields('customerLocationId')}
            value={`${customerLocationId}`}
          >
            {this.renderMenuItems(<FormattedMessage id="select_location"/>, customerLocations, 'name')}
          </SelectUi>
        </FormGroupWrapper>

        <FormGroupWrapper>
          <FlexRowWrapper>
            <HalfFormControl error={errors.startDate}>
              <DatePicker
                error={errors.startDate}
                label="Date"
                value={moment(startDate)}
                onChange={this.handleChangeStartDate}
                variant="outlined"
                disablePast
              />

              <FormHelperText>{this.getErrorMessage('startDate')}</FormHelperText>
            </HalfFormControl>

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
          </FlexRowWrapper>
        </FormGroupWrapper>

        <FormGroupWrapper>
          <FlexRowWrapper>
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
      </Fragment>
    );
  };

  render() {
    return (
      <DialogWrapper onClose={this.handleClose} open={this.props.open}>
        <DialogTitle><FormattedMessage id="add_job" /></DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            {this.renderCustomer()}
            {this.renderContract()}
            {this.renderCustomerItem()}
            {this.renderForm()}
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

ModalQuickJob.defaultProps = {
  customersLoading: true,
  customerItemsLoading: true,
};

ModalQuickJob.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.object).isRequired,
  contractsLoading: PropTypes.bool,
  createJob: PropTypes.func.isRequired,
  customerItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  customerItemsLoading: PropTypes.bool,
  customers: PropTypes.arrayOf(PropTypes.object).isRequired,
  customerLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  customersLoading: PropTypes.bool,
  fetchContracts: PropTypes.func.isRequired,
  fetchCustomerItemsByContract: PropTypes.func.isRequired,
  fetchCustomerItemsByCustomer: PropTypes.func.isRequired,
  fetchCustomerLocations: PropTypes.func.isRequired,
  fetchCustomersWithOperatingContracts: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
  jobTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  refreshList: PropTypes.func.isRequired,
};

// eslint-disable-next-line max-len
export default withContracts(withJobs(withJobTemplates(withCustomerItems(withCustomerLocations(withCustomers(withLocations(withRouter(withUnits(ModalQuickJob)))))))));
