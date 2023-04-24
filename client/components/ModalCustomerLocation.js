import { Button, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { withCustomerLocations } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import DialogWrapper from './ui/DialogWrapper';
import FlexRowWrapper from './ui/FlexRowWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import HalfFormControl from './ui/HalfFormControl';
import SelectHalfUi from './ui/SelectHalf';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';

const initialState = {
  errors: {
    adr1: false,
    adr2: false,
    apt: false,
    city: false,
    doorNo: false,
    name: false,
    postalCode: false,
    province: false,
  },
  adr1: '',
  adr2: '',
  apt: '',
  city: '',
  doorNo: '',
  name: '',
  postalCode: '',
  province: '',
};

const provinces = [
  { name: <FormattedMessage id="provinces.ab" />, code: 'AB' },
  { name: <FormattedMessage id="provinces.bc" />, code: 'BC' },
  { name: <FormattedMessage id="provinces.pe" />, code: 'PE' },
  { name: <FormattedMessage id="provinces.mb" />, code: 'MB' },
  { name: <FormattedMessage id="provinces.nb" />, code: 'NB' },
  { name: <FormattedMessage id="provinces.ns" />, code: 'NS' },
  { name: <FormattedMessage id="provinces.on" />, code: 'ON' },
  { name: <FormattedMessage id="provinces.qc" />, code: 'QC' },
  { name: <FormattedMessage id="provinces.sk" />, code: 'SK' },
  { name: <FormattedMessage id="provinces.nl" />, code: 'NL' },
  { name: <FormattedMessage id="provinces.nu" />, code: 'NU' },
  { name: <FormattedMessage id="provinces.nt" />, code: 'NT' },
  { name: <FormattedMessage id="provinces.yt" />, code: 'YT' },
];

class ModalCustomerLocation extends PureComponent {
  constructor(props) {
    super();

    this.state = {
      ...initialState,
      ...props.customerLocation,
    };
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    for (const name of ['adr1', 'city', 'doorNo', 'name', 'postalCode', 'province']) {
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
        customerId,
        customerLocation,
        createCustomerLocation,
        editLocation,
        match,
        refreshList,
      } = this.props;

      const {
        adr1, adr2, apt, city, doorNo, name, postalCode, province,
      } = this.state;

      const { id } = customerLocation;
      const method = id ? editLocation : createCustomerLocation;
      const editedCustomerId = customerId || match.params.customerId;

      await method(editedCustomerId, {
        adr_1: adr1,
        adr_2: adr2,
        apt,
        door_no: doorNo,
        postal_code: postalCode,
        city,
        name,
        province,
      }, id);

      this.setState(initialState);

      refreshList();
    }
  };

  renderMenuItems = (label, data) => ([
    <MenuItem key="-1" value="-1">{label}</MenuItem>,

    ...data.map(({ name, code }) => <MenuItem key={code} value={code}>{name}</MenuItem>),
  ]);

  render() {
    const { actionName } = this.props;
    const {
      adr1, adr2, apt, city, doorNo, errors, name, postalCode, province,
    } = this.state;
    const modalTitle = actionName.props.id === 'add' ? <FormattedMessage id="add_location" /> : <FormattedMessage id="edit_location" />;

    return (
      <DialogWrapper onClose={this.handleClose} open={this.props.open}>
        <DialogTitle>{modalTitle}</DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <FormGroupWrapper>
              <TextFieldUi
                error={errors.name}
                fullWidth
                helperText={this.getErrorMessage('name')}
                id="cpbr-name"
                label={<FormattedMessage id="name_simple" />}
                onChange={this.handleChangeFields('name')}
                value={name || ''}
              />
            </FormGroupWrapper>

            <FormGroupWrapper>
              <FlexRowWrapper>
                <HalfFormControl>
                  <TextFieldUi
                    error={errors.doorNo}
                    fullWidth
                    helperText={this.getErrorMessage('doorNo')}
                    id="cpbr-door-no"
                    label={<FormattedMessage id="address.door_no" />}
                    onChange={this.handleChangeFields('doorNo')}
                    value={doorNo || ''}
                  />
                </HalfFormControl>

                <HalfFormControl>
                  <TextFieldUi
                    error={errors.postalCode}
                    fullWidth
                    helperText={this.getErrorMessage('postalCode')}
                    id="cpbr-postal-code"
                    label={<FormattedMessage id="address.postal_code" />}
                    onChange={this.handleChangeFields('postalCode')}
                    value={postalCode || ''}
                  />
                </HalfFormControl>
              </FlexRowWrapper>
            </FormGroupWrapper>

            <FormGroupWrapper>
              <TextFieldUi
                error={errors.adr1}
                fullWidth
                helperText={this.getErrorMessage('adr1')}
                id="cpbr-adr1"
                label={<FormattedMessage id="address.adr_1" />}
                onChange={this.handleChangeFields('adr1')}
                value={adr1 || ''}
              />
            </FormGroupWrapper>

            <FormGroupWrapper>
              <FlexRowWrapper>
                <HalfFormControl>
                  <TextFieldUi
                    error={errors.adr2}
                    fullWidth
                    helperText={this.getErrorMessage('adr2')}
                    id="cpbr-adr2"
                    label={<FormattedMessage id="address.adr_2" />}
                    onChange={this.handleChangeFields('adr2')}
                    value={adr2 || ''}
                  />
                </HalfFormControl>

                <HalfFormControl>
                  <TextFieldUi
                    error={errors.apt}
                    fullWidth
                    helperText={this.getErrorMessage('apt')}
                    id="cpbr-apt"
                    label={<FormattedMessage id="address.apt" />}
                    onChange={this.handleChangeFields('apt')}
                    value={apt || ''}
                  />
                </HalfFormControl>
              </FlexRowWrapper>
            </FormGroupWrapper>

            <FlexRowWrapper>
              <HalfFormControl>
                <TextFieldUi
                  error={errors.city}
                  fullWidth
                  helperText={this.getErrorMessage('city')}
                  id="cpbr-city"
                  label={<FormattedMessage id="address.city" />}
                  onChange={this.handleChangeFields('city')}
                  value={city || ''}
                />
              </HalfFormControl>

              <SelectHalfUi
                className="cpbr-province-select"
                formControlError={errors.province}
                formHelperErrorMsg={this.getErrorMessage('province')}
                id="cpbr-province"
                inputLabelText={<FormattedMessage id="address.province" />}
                onChange={this.handleChangeFields('province')}
                value={`${province || ''}`}
              >
                {this.renderMenuItems(<FormattedMessage id="select_province" />, provinces)}
              </SelectHalfUi>
            </FlexRowWrapper>
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

ModalCustomerLocation.defaultProps = {
  customerId: null,
  customerLocation: {},
};

ModalCustomerLocation.propTypes = {
  actionName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  customerId: PropTypes.number,
  customerLocation: PropTypes.object,
  createCustomerLocation: PropTypes.func.isRequired,
  refreshList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withCustomerLocations(withRouter(ModalCustomerLocation));
