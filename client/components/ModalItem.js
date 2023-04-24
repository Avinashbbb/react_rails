import { Button, DialogActions, DialogContent, DialogTitle, MenuItem } from '@material-ui/core';
import { withItems, withItemKinds, withItemSpecs } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import DialogWrapper from './ui/DialogWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import SelectUi from './ui/Select';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';

const initialState = {
  errors: {
    identifier: false,
    itemKindId: false,
    itemSpecId: false,
  },
  identifier: '',
  itemKindId: '',
  itemSpecId: '',
};

class ModalItem extends PureComponent {
  constructor(props) {
    super();

    this.state = {
      ...initialState,
      ...props.item,
    };
  }

  get itemKinds() {
    return this.props.itemKinds;
  }

  get itemSpecs() {
    return this.props.itemSpecs.filter(itemSpec => (
      itemSpec.itemKindId === this.state.itemKindId
    ));
  }

  get valid() {
    const { identifier, itemKindId, itemSpecId } = this.state;

    const errors = { ...initialState.errors };
    let valid = true;

    if (!identifier.trim()) {
      valid = false;
      errors.identifier = true;
    }

    if (!itemKindId) {
      valid = false;
      errors.itemKindId = true;
    }

    if (!itemSpecId) {
      valid = false;
      errors.itemSpecId = true;
    }

    this.setState({ errors });

    return valid;
  }

  getErrorMessage = getErrorMessage.bind(this);

  handleChangeFields = handleChangeFields.bind(this);

  handleChangeItemKind = ({ target }) => {
    this.setState({
      errors: {
        ...this.state.errors,
        itemKindId: false,
        itemSpecId: false,
      },
      itemKindId: target.value,
      itemSpecId: '',
    });
  };

  handleClose = () => {
    this.setState(initialState);
    this.props.onClose();
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const { identifier, itemKindId, itemSpecId } = this.state;
      const {
        createItem, editItem, item, refreshList,
      } = this.props;

      const { id } = item;
      const method = id ? editItem : createItem;

      await method({ identifier, item_kind_id: itemKindId, item_spec_id: itemSpecId }, id);

      this.setState(initialState);

      refreshList();
    }
  };

  renderItemKindsSelect = () => {
    const { errors, itemKindId } = this.state;

    return (
      <FormGroupWrapper>
        <SelectUi
          formControlError={errors.itemKindId}
          formHelperErrorMsg={this.getErrorMessage('itemKindId')}
          inputLabelText={<FormattedMessage id="items.item_kind" />}
          onChange={this.handleChangeItemKind}
          value={itemKindId}
        >
          {this.itemKinds.map(({ id, name }) => (
            <MenuItem key={id} value={id}>{name}</MenuItem>
          ))}
        </SelectUi>
      </FormGroupWrapper>
    );
  };

  renderItemSpecsSelect = () => {
    const { errors, itemKindId, itemSpecId } = this.state;

    return (
      <FormGroupWrapper className={!itemKindId ? 'form-group-disabled' : ''}>
        <SelectUi
          disabled={!itemKindId}
          formControlError={errors.itemSpecId}
          formHelperErrorMsg={this.getErrorMessage('itemSpecId')}
          inputLabelText={<FormattedMessage id="characteristic" />}
          onChange={this.handleChangeFields('itemSpecId')}
          value={itemSpecId}
        >
          {this.itemSpecs.map(({ id, name }) => (
            <MenuItem key={id} value={id}>{name}</MenuItem>
          ))}
        </SelectUi>
      </FormGroupWrapper>
    );
  };

  render() {
    const { actionName } = this.props;
    const { errors, identifier } = this.state;
    const modalTitle = actionName.props.id === 'add' ? <FormattedMessage id="items.add_item" /> : <FormattedMessage id="items.edit_item" />;

    return (
      <DialogWrapper onClose={this.handleClose} open={this.props.open}>
        <DialogTitle>{modalTitle}</DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <FormGroupWrapper>
              <TextFieldUi
                error={errors.identifier}
                helperText={this.getErrorMessage('identifier')}
                label={<FormattedMessage id="items.identifier" />}
                onChange={this.handleChangeFields('identifier')}
                value={identifier}
              />
            </FormGroupWrapper>

            {this.renderItemKindsSelect()}
            {this.renderItemSpecsSelect()}
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

ModalItem.defaultProps = {
  item: {},
};

ModalItem.propTypes = {
  actionName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  createItem: PropTypes.func.isRequired,
  item: PropTypes.object,
  itemKinds: PropTypes.arrayOf(PropTypes.object).isRequired,
  itemSpecs: PropTypes.arrayOf(PropTypes.object).isRequired,
  refreshList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withItems(withItemKinds(withItemSpecs(ModalItem)));
