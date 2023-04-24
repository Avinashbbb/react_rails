import { Tab } from '@material-ui/core';
import { withContract } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link, withRouter } from 'react-router-dom';
import moment from 'moment';

import Breadcrumbs from './Breadcrumbs';
import ContractLocationsList from './CustomerLocationsList';
import HeaderContextWrapper from './ui/HeaderContextWrapper';
import PageHeader from './ui/PageHeader';
import TabsWrapper from './ui/TabsWrapper';
import FlexHeaderRowWrapper from './ui/FlexHeaderRowWrapper';
import HeaderColumnWrapper from './ui/HeaderColumnWrapper';
import CustomerItemsList from './ContractCustomerItemsList';

class Contract extends PureComponent {
  state = {
    currentTab: 0,
  };

  componentDidMount = () => {
    const {fetchContract, match} = this.props;

    fetchContract(match.params.customerId, match.params.contractId);
  };

  handleChangeTab = (_, currentTab) => {
    this.setState({
      currentTab,
    });
  };

  renderPageHeader = () => {
    const { contract, history, intl } = this.props;
    const { expireDate, name, contractNo, startDate, status } = contract;
    const { formatMessage } = intl;

    return (
      <PageHeader titleText={`${name || contractNo}`} onBackClick={history.goBack}>
        <FlexHeaderRowWrapper>
          <HeaderColumnWrapper>{`${formatMessage({id: 'contract_start'})}: ${moment(startDate).format("YYYY-MM-DD")}`}</HeaderColumnWrapper>
        </FlexHeaderRowWrapper>
        {expireDate && (
          <FlexHeaderRowWrapper>
            <HeaderColumnWrapper>{`${formatMessage({id: 'end_date'})}: ${moment(expireDate).format("YYYY-MM-DD")}`}</HeaderColumnWrapper>
          </FlexHeaderRowWrapper>
        )}
        {status && (
          <FlexHeaderRowWrapper>
            <HeaderColumnWrapper><span>{`${formatMessage({id: 'status.title'})}: ${formatMessage({id: `status.${status.toLowerCase()}`})}`}</span></HeaderColumnWrapper>
          </FlexHeaderRowWrapper>
        )}
      </PageHeader>
    );
  };

  renderTabContainer = () => {
    let Content = null;

    switch (this.state.currentTab) {
      case 0: {
        Content = CustomerItemsList;
        break;
      }
      default: {
        Content = ContractLocationsList;
        break;
      }
    }

    return <Content {...this.props} />;
  };

  render() {
    return (
      <div>
        <Breadcrumbs>
          <li><Link to="/customers"><FormattedMessage id="customers" /></Link></li>
          <li><Link to={`/customers/${this.props.match.params.customerId}`}><FormattedMessage id="contract_and_contact" /></Link></li>
          <li><FormattedMessage id="contract.name" /></li>
        </Breadcrumbs>

        <HeaderContextWrapper>
          {this.renderPageHeader()}
        </HeaderContextWrapper>

        <TabsWrapper
          indicatorColor="primary"
          onChange={this.handleChangeTab}
          textColor="primary"
          value={this.state.currentTab}
        >
          <Tab label={<FormattedMessage id="customer_items"/>}/>
          <Tab label={<FormattedMessage id="locations"/>}/>
        </TabsWrapper>

        {this.renderTabContainer()}
      </div>
    );
  }
}

Contract.propTypes = {
  contract: PropTypes.object.isRequired,
  fetchContract: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default injectIntl(withRouter(withContract(Contract)));
