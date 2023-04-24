import { Button, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { withAccountStatement, withFranchise } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import DialogWrapper from './ui/DialogWrapper';
import FlexRowWrapper from './ui/FlexRowWrapper';
import FormGroupWrapper from './ui/FormGroupWrapper';
import HalfFormControl from './ui/HalfFormControl';
import TextFieldUi from './ui/TextField';
import { getErrorMessage, handleChangeFields } from '../utils/form';

const initialState = {
  errors: {
    weeklyProductSale: false,
    weeklySupplyReserveUsed: false,
  },
  weeklyProductSale: '',
  weeklySupplyReserveUsed: '',
};

class ModalSalesAndSupplies extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      ...initialState,
    };
  }

  get valid() {
    const errors = { ...initialState.errors };
    let valid = true;

    for (const name of ['weeklyProductSale', 'weeklySupplyReserveUsed']) {
      if (this.state[name].toString().trim() === '' || this.state[name].toString().trim() === '-1') {
        valid = false;
        errors[name] = true;
      }
    }

    this.setState({ errors });

    return valid;
  }

  getErrorMessage = getErrorMessage.bind(this);

  handleChangeFields = handleChangeFields.bind(this);

  extractAccountStatement = () => {
    const { accountStatementId, accountStatements } = this.props;

    if (accountStatementId === '') {
      return null;
    }

    const filteredAccountStatement = _.filter(accountStatements, ['id', accountStatementId]);

    return filteredAccountStatement;
  }

  handleClose = () => {
    const { actionName } = this.props;
    if (actionName.props.id === 'add') {
      this.setState(initialState);
    }
    this.props.onClose();
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.valid) {
      const {
        accountStatementId, addWeeklySalesAndSupplies, franchise, refreshList,
      } = this.props;

      const { data } = franchise;
      const { id } = data;

      const selectedAccountStatement = this.extractAccountStatement();

      const {
        weeklyProductSale,
        weeklySupplyReserveUsed,
      } = this.state;

      const productSaleDatabase = parseFloat(selectedAccountStatement[0].productSale) || 0;
      const supplyReserveUsedDatabase = parseFloat(selectedAccountStatement[0].supplyReserveUsed) || 0;

      const totalProductSale = (productSaleDatabase + parseFloat(weeklyProductSale)).toFixed(2);
      const totalSupplyReserveUsed = (supplyReserveUsedDatabase + parseFloat(weeklySupplyReserveUsed)).toFixed(2);

      await addWeeklySalesAndSupplies(id, {
        product_sale: totalProductSale,
        supply_reserve_used: totalSupplyReserveUsed,
      }, accountStatementId);

      this.setState(initialState);

      refreshList();
    }
  };

  render() {
    const { actionName } = this.props;
    const {
      errors,
      weeklyProductSale,
      weeklySupplyReserveUsed,
    } = this.state;

    const modalTitle = <FormattedMessage id="weekly_sales" />;

    return (
      <DialogWrapper onClose={this.handleClose} open={this.props.open}>
        <DialogTitle>{modalTitle}</DialogTitle>

        <DialogContent>
          <form onSubmit={this.handleSubmit}>
            <FormGroupWrapper>
              <FlexRowWrapper>
                <HalfFormControl>
                  <TextFieldUi
                    error={errors.weeklyProductSale}
                    helperText={this.getErrorMessage('weeklyProductSale')}
                    id="cpbr-unit-product-sale"
                    inputProps={{ min: 0 }}
                    label={<FormattedMessage id="product_sale" />}
                    onChange={this.handleChangeFields('weeklyProductSale')}
                    value={weeklyProductSale || ''}
                    type="number"
                  />
                </HalfFormControl>

                <HalfFormControl>
                  <TextFieldUi
                    error={errors.weeklySupplyReserveUsed}
                    helperText={this.getErrorMessage('weeklySupplyReserveUsed')}
                    id="cpbr-unit-supply-reserved-used"
                    inputProps={{ min: 0 }}
                    label={<FormattedMessage id="supply_reserve_used" />}
                    onChange={this.handleChangeFields('weeklySupplyReserveUsed')}
                    value={weeklySupplyReserveUsed || ''}
                    type="number"
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

ModalSalesAndSupplies.defaultProps = {
  accountStatementId: {},
  franchise: {},
};

ModalSalesAndSupplies.propTypes = {
  accountStatementId: PropTypes.object,
  accountStatements: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionName: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  addWeeklySalesAndSupplies: PropTypes.func.isRequired,
  franchise: PropTypes.object,
  refreshList: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withAccountStatement(withFranchise(ModalSalesAndSupplies));
