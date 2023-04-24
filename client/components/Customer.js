import { Button, IconButton, Tab } from '@material-ui/core';
import { withCustomer } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import BlockIcon from '@material-ui/icons/Block';
import EditIcon from '@material-ui/icons/Edit';

import Breadcrumbs from './Breadcrumbs';
import ContractsList from './ContractsList';
import ContactsList from './ContactsList';
import HeaderContextWrapper from './ui/HeaderContextWrapper';
import PageHeader from './ui/PageHeader';
import TabsWrapper from './ui/TabsWrapper';
import FlexHeaderRowWrapper from './ui/FlexHeaderRowWrapper';
import HeaderColumnWrapper from './ui/HeaderColumnWrapper';
import ModalCustomer from './ModalCustomer';
import ModalPaymentMethod from './ModalPaymentMethod';

class Customer extends PureComponent {
  initialState = {
    currentTab: 0,
    changePaymentMethodModalOpened: false,
    customerModalOpened: false,
    disabledButton: false,
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchCustomer();
  }

  handleChangeTab = (_, currentTab) => {
    this.setState({
      currentTab,
    });
  };

  fetchCustomer = () => {
    this.props.fetchCustomer(this.props.match.params.customerId);
  };

  handleChangePaymentMethod = newMethod => async (event) => {
    event.preventDefault();

    if (this.state.disabledButton) {
      return;
    }
    this.setState({disabledButton: true});

    const { changePaymentMethod, match } = this.props;
    await changePaymentMethod(match.params.customerId, { new_payment_method: newMethod });

    const { changePaymentMethodModalOpened, disabledButton } = this.initialState;

    this.setState({
      changePaymentMethodModalOpened, disabledButton,
    }, this.fetchCustomer);
  };

  handleRefreshAfterModify = () => {
    this.handleToggleCustomerModal(false)();
    this.fetchCustomer();
  };

  handleToggleChangePaymentMethodModal = opened => () => {
    this.setState({ changePaymentMethodModalOpened: opened });
  };

  handleToggleCustomerModal = opened => () => {
    this.setState({ customerModalOpened: opened });
  };

  renderEditCustomerButton = () => {
    const { customer } = this.props;

    return (
      <IconButton id="cpbr-edit-customer" onClick={this.handleToggleCustomerModal(true, customer)}>
        <EditIcon fontSize="small" />
      </IconButton>
    );
  };

  renderInactiveBadge = (inactive) => {
    if (!inactive) {
      return null;
    }

    return (
      <Chip icon={<BlockIcon fontSize="small" />} label={<FormattedMessage id="inactive" />} />
    );
  };

  renderPaymentMethod = (paymentMethod) => {
    const { intl } = this.props;
    const { formatMessage } = intl;

    if (paymentMethod) {
      return (
        <FlexHeaderRowWrapper>
          <HeaderColumnWrapper><span>{`${formatMessage({ id: 'payment_method' })}: ${paymentMethod}`}</span></HeaderColumnWrapper>
        </FlexHeaderRowWrapper>
      );
    }

    return null;
  }

  renderPaymentMethodButton = (paymentMethod) => {
    const message = paymentMethod ? <FormattedMessage id="change_payment_method" /> : <FormattedMessage id="new_payment_method" />;

    return (
      <FlexHeaderRowWrapper>
        <Button variant="contained" onClick={this.handleToggleChangePaymentMethodModal(true)}>
          {message}
        </Button>
      </FlexHeaderRowWrapper>
    );
  }

  renderPageHeader = () => {
    const { customer, intl } = this.props;
    const { formatMessage } = intl;
    const {
      address, franchiseName, inactive, paymentMethod,
    } = customer;

    const headerAddress = address ? <span>{address}</span> : '';
    const headerFranchise = franchiseName ? <span>{`${formatMessage({ id: 'franchise_name' })}: ${franchiseName}`}</span> : '';

    return (
      <div>
        <FlexHeaderRowWrapper>
          <HeaderColumnWrapper>{headerAddress}</HeaderColumnWrapper>
        </FlexHeaderRowWrapper>
        <FlexHeaderRowWrapper>
          <HeaderColumnWrapper>{headerFranchise}</HeaderColumnWrapper>
        </FlexHeaderRowWrapper>
        {this.renderPaymentMethod(paymentMethod)}
        {this.renderPaymentMethodButton(paymentMethod)}
        <FlexHeaderRowWrapper>
          <HeaderColumnWrapper>{this.renderInactiveBadge(inactive)}</HeaderColumnWrapper>
        </FlexHeaderRowWrapper>
      </div>
    );
  };

  renderTabContainer = () => {
    let Content = null;

    switch (this.state.currentTab) {
      case 0: {
        Content = ContractsList;
        break;
      }
      case 1: {
        Content = ContactsList;
        break;
      }
      default: {
        Content = 'div';
        break;
      }
    }

    return <Content {...this.props} />;
  };

  render() {
    const { customer, history } = this.props;
    const { changePaymentMethodModalOpened, customerModalOpened } = this.state;
    const { id, name } = customer;

    return (
      <div>
        <Breadcrumbs>
          <li><Link to="/customers"><FormattedMessage id="customers" /></Link></li>
          <li><FormattedMessage id="contract_and_contact" /></li>
        </Breadcrumbs>

        <HeaderContextWrapper>
          <PageHeader
            getBadge={this.renderEditCustomerButton}
            onBackClick={history.goBack}
            titleText={name}
          >
            {this.renderPageHeader()}
          </PageHeader>
        </HeaderContextWrapper>

        <TabsWrapper
          indicatorColor="primary"
          onChange={this.handleChangeTab}
          textColor="primary"
          value={this.state.currentTab}
        >
          <Tab label={<FormattedMessage id="contracts" />} />
          <Tab label={<FormattedMessage id="contacts" />} />
        </TabsWrapper>

        {this.renderTabContainer()}

        <ModalPaymentMethod
          firstChoiceButtonText="new_credit_card"
          onCancel={this.handleToggleChangePaymentMethodModal(false)}
          onClickFirstChoice={this.handleChangePaymentMethod('CreditCard')}
          onClickSecondChoice={this.handleChangePaymentMethod('Ppa')}
          onClickThirdChoice={this.handleChangePaymentMethod('JanPro')}
          open={changePaymentMethodModalOpened}
          secondChoiceButtonText="new_ppa"
          thirdChoiceButtonText="jan_pro"
          title={<FormattedMessage id="warning" />}
          disabledButton={this.state.disabledButton}
        >
          <FormattedMessage id="warning_change_payment_card" />
        </ModalPaymentMethod>

        <ModalCustomer
          actionName={<FormattedMessage id="edit" />}
          customer={customer}
          history={history}
          key={id}
          onClose={this.handleToggleCustomerModal(false)}
          open={customerModalOpened}
          refreshList={this.handleRefreshAfterModify}
        />
      </div>
    );
  }
}

Customer.propTypes = {
  changePaymentMethod: PropTypes.func.isRequired,
  customer: PropTypes.object.isRequired,
  fetchCustomer: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default injectIntl(withCustomer(Customer));
