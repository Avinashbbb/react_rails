import {Button, DialogActions, DialogContent, DialogTitle, FormGroup, MenuItem} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {withContainerKinds, withCustomerItems, withItems, withCustomerLocations} from 'optigo-redux';
import PropTypes from 'prop-types';
import React, {PureComponent} from 'react';
import {FormattedMessage} from 'react-intl';

import ModalCustomerLocation from './ModalCustomerLocation';
import DialogWrapper from './ui/DialogWrapper';
import FlexRowWrapper from './ui/FlexRowWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import HalfButtonWrapper from './ui/HalfButtonWrapper';
import SelectHalfUi from './ui/SelectHalf';
import TextAreaUi from './ui/TextArea';
import TextFieldUi from './ui/TextField';
import {getErrorMessage, handleChangeFields} from '../utils/form';

const initialErrorState = {
  containerKindId: false,
  locationId: false,
};

const initialState = {
  containerKindId: -1,
  errors: {...initialErrorState},
  itemId: -1,
  locationId: -1,
  locationModalOpened: false,
};

const labels = {
  noteAccess: <FormattedMessage id="preparation.note_access"/>,
  noteBeforeStart: <FormattedMessage id="preparation.note_before_start"/>,
  noteComments: <FormattedMessage id="preparation.note_comments"/>,
  noteSchedule: <FormattedMessage id="preparation.note_schedule"/>,
};

class ModalPreparation extends PureComponent {
  constructor(props) {
    super();

    const {
      containerKindId, itemId, locationId, ...customerItemProps
    } = props.customerItem;

    this.state = {
      ...initialState,
      ...customerItemProps,
      containerKindId: containerKindId || initialState.containerKindId,
      itemId: itemId || initialState.itemId,
      locationId: locationId || initialState.locationId,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return (nextProps.customerLocations.length > 0 && prevState.locationId === -1)
      ? { locationId: nextProps.customerLocations[0].id }
      : null ;
  }

  get valid() {
    const errors = {...initialErrorState};
    let valid = true;

    for (const name of ['locationId']) {
      if (this.state[name] === '-1' || this.state[name] === -1) {
        valid = false;
        errors[name] = true;
      }
    }

    this.setState({errors});

    return valid;
  }

  getErrorMessage = getErrorMessage.bind(this);

  fetchCustomerLocations = () => {
    const {customerItem, fetchCustomerLocations} = this.props;

    fetchCustomerLocations(customerItem.customerId, { limit: 200 });
  };

  fetchCustomerLocationsAndCloseModal = () => {
    this.setState({
      locationModalOpened: false,
    }, this.fetchCustomerLocations);
  };

  handleChangeFields = handleChangeFields.bind(this);

  handleClose = () => {
    this.setState(initialState);
    this.props.onClose();
  };

  handleOnEntering = () => {
    this.fetchCustomerLocations();
    this.props.fetchItems();
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const {
        customerItem, editCustomerItem, refresh,
      } = this.props;

      const {
        containerKindId,
        itemId,
        locationId,
        noteAccess,
        noteBeforeStart,
        noteComments,
        noteSchedule,
      } = this.state;

      const {id} = customerItem;

      await editCustomerItem({
        container_kind_id: containerKindId,
        item_id: itemId,
        location_id: locationId,
        note_access: noteAccess,
        note_before_start: noteBeforeStart,
        note_comments: noteComments,
        note_schedule: noteSchedule,
        prepared: true,
      }, id);

      refresh();
    }
  };

  handleToggleLocationModal = opened => () => {
    this.setState({
      locationModalOpened: opened,
    });
  };

  renderMenuItems = (label, data, valueIsIdentifier = false) => ([
    <MenuItem key="-1" value="-1">{label}</MenuItem>,

    ...data.map(({id, identifier, name}) => {
      const text = valueIsIdentifier ? identifier : name;

      return <MenuItem key={id} value={id}>{text}</MenuItem>;
    }),
  ]);

  renderTextFields = () => {
    const {errors} = this.state;

    return (
      ['noteAccess', 'noteBeforeStart', 'noteComments'].map(name => (
        <FormGroupWrapper key={name}>
          <TextAreaUi
            error={errors[name]}
            helperText={this.getErrorMessage(name)}
            id={`cpbr-${name}`}
            label={labels[name]}
            onChange={this.handleChangeFields(name)}
            value={this.state[name] || ''}
          />
        </FormGroupWrapper>
      ))
    );
  };

  render() {
    const {
      customerLocations, containerKinds, customerItem, items, open,
    } = this.props;

    const {
      containerKindId, errors, itemId, locationId,
    } = this.state;

    return (
      <DialogWrapper onEntering={this.handleOnEntering} open={open}>
        <DialogTitle><FormattedMessage id="prepare"/></DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <FormGroupWrapper>
              <FlexRowWrapper>
                <SelectHalfUi
                  error={errors.locationId}
                  formControlError={errors.locationId}
                  formControlWidthClass="two-thirds"
                  formHelperErrorMsg={this.getErrorMessage('locationId')}
                  id="cpbr-location"
                  inputLabelText={<FormattedMessage id="location"/>}
                  onChange={this.handleChangeFields('locationId')}
                  value={`${locationId}`}
                >
                  {this.renderMenuItems(<FormattedMessage id="select_location"/>, customerLocations)}
                </SelectHalfUi>

                <HalfButtonWrapper className="one-sixth">
                  <Button
                    classes={{contained: 'cta-add-location'}}
                    color="default"
                    onClick={this.handleToggleLocationModal(true)}
                    variant="contained"
                  >
                    <AddIcon fontSize="small"/>
                    <FormattedMessage id="preparation.add_location_button"/>
                  </Button>
                </HalfButtonWrapper>
              </FlexRowWrapper>
            </FormGroupWrapper>

            {/*<FormGroupWrapper>*/}
              {/*<FlexRowWrapper>*/}
                {/*<SelectHalfUi*/}
                  {/*error={errors.containerKindId}*/}
                  {/*formControlError={errors.containerKindId}*/}
                  {/*formHelperErrorMsg={this.getErrorMessage('containerKindId')}*/}
                  {/*id="cpbr-container-kind"*/}
                  {/*inputLabelText={<FormattedMessage id="container_type"/>}*/}
                  {/*onChange={this.handleChangeFields('containerKindId')}*/}
                  {/*value={`${containerKindId}`}*/}
                {/*>*/}
                  {/*{this.renderMenuItems(<FormattedMessage id="select_container_type"/>, containerKinds)}*/}
                {/*</SelectHalfUi>*/}

                {/*<SelectHalfUi*/}
                  {/*id="cpbr-container-selected"*/}
                  {/*inputLabelText={<FormattedMessage id="container_used"/>}*/}
                  {/*onChange={this.handleChangeFields('itemId')}*/}
                  {/*value={`${itemId}`}*/}
                {/*>*/}
                  {/*{this.renderMenuItems(<FormattedMessage id="select_container"/>, items, true)}*/}
                {/*</SelectHalfUi>*/}
              {/*</FlexRowWrapper>*/}
            {/*</FormGroupWrapper>*/}

            <FormGroup>
              {this.renderTextFields()}

              <FormGroupWrapper>
                <TextFieldUi
                  error={errors.noteSchedule}
                  helperText={this.getErrorMessage('noteSchedule')}
                  id="cpbr-noteSchedule"
                  label={labels.noteSchedule}
                  onChange={this.handleChangeFields('noteSchedule')}
                  value={this.state.noteSchedule || ''}
                />
              </FormGroupWrapper>
            </FormGroup>

            <ModalCustomerLocation
              actionName={<FormattedMessage id="add"/>}
              customerId={customerItem.customerId}
              customerLocation={{}}
              onClose={this.handleToggleLocationModal(false)}
              open={this.state.locationModalOpened}
              refreshList={this.fetchCustomerLocationsAndCloseModal}
            />
          </form>
        </DialogContent>

        <DialogActions>
          <Button color="default" onClick={this.handleClose}>
            <FormattedMessage id="cancel"/>
          </Button>

          <Button onClick={this.handleSubmit} variant="contained">
            <FormattedMessage id="save"/>
          </Button>
        </DialogActions>
      </DialogWrapper>
    );
  }
}

ModalPreparation.propTypes = {
  containerKinds: PropTypes.arrayOf(PropTypes.object).isRequired,
  customerItem: PropTypes.object.isRequired,
  customerLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  editCustomerItem: PropTypes.func.isRequired,
  fetchItems: PropTypes.func.isRequired,
  fetchCustomerLocations: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
};

// eslint-disable-next-line max-len
export default withContainerKinds(withCustomerItems(withItems(withCustomerLocations(ModalPreparation))));
