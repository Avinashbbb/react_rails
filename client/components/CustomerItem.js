import { Tab } from '@material-ui/core';
import { withCustomerItem } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Breadcrumbs from './Breadcrumbs';
import FlexHeaderRowWrapper from './ui/FlexHeaderRowWrapper';
import HeaderLabel from './ui/HeaderLabel';
import HeaderContextWrapper from './ui/HeaderContextWrapper';
import HeaderColumnWrapper from './ui/HeaderColumnWrapper';
import JobsList from './JobsList';
import PageHeader from './ui/PageHeader';
import RecurrencesList from './RecurrencesList';
import TabsWrapper from './ui/TabsWrapper';

const BundleNote = styled.div`
  max-width: 550px;
  margin-top: 15px;
  font-style: italic;
`;

class CustomerItem extends PureComponent {
  state = {
    currentTab: 0,
  };

  componentDidMount() {
    this.fetchCustomerItem();
  }

  fetchCustomerItem = () => {
    const { fetchCustomerItem, match } = this.props;

    fetchCustomerItem(match.params.customerItemId);
  };

  handleChangeTab = (_, currentTab) => {
    this.setState({
      currentTab,
    });
  };

  renderBreadCrumbs = () => {
    const {match} = this.props;
    const {params} = match;
    const {contractId, customerId} = params;

    if (contractId && customerId) {
      return (
        <Breadcrumbs>
          <li><Link to="/customers"><FormattedMessage id="customers"/></Link></li>
          <li><Link to={`/customers/${customerId}`}><FormattedMessage id="contract_and_contact"/></Link></li>
          <li><Link to={`/customers/${customerId}/contracts/${contractId}`}><FormattedMessage id="contract.name"/></Link>
          </li>
          <li><FormattedMessage id="customer_item"/></li>
        </Breadcrumbs>
      );
    }

    return (
      <Breadcrumbs>
        <li><Link to="/preparations"><FormattedMessage id="preparations"/></Link></li>
        <li><FormattedMessage id="tasks"/></li>
      </Breadcrumbs>
    );
  };

  renderPageHeader = () => {
    const { customerItem, customerItemLoading } = this.props;

    if (customerItemLoading) {
      return null;
    }

    const {
      addressSimple,
      bundleNote,
      containerKindName,
      customerName,
      contractNo,
      contractName,
      itemIdentifier,
      locationName,
      name,
      startDate,
    } = customerItem;

    const location = addressSimple ?
      <HeaderColumnWrapper>
        <HeaderLabel>{locationName}</HeaderLabel>{addressSimple}<br/>
      </HeaderColumnWrapper> : '';
    const item = itemIdentifier ?
      <HeaderColumnWrapper>
        <HeaderLabel>Conteneur {itemIdentifier}</HeaderLabel>{containerKindName}
      </HeaderColumnWrapper> : '';
    const note = bundleNote ? <BundleNote>{bundleNote}</BundleNote> : '';

    return (
      <PageHeader titleText={name}>
        <FlexHeaderRowWrapper>
          <HeaderColumnWrapper>
            <HeaderLabel>
              Contrat : {contractName || contractNo}
            </HeaderLabel>
            {customerName}<br />
            Travaux débutent le {startDate}
            {note}
          </HeaderColumnWrapper>
          {location}
          {item}
        </FlexHeaderRowWrapper>
      </PageHeader>
    );
  };

  renderTabContainer = () => {
    if (!this.props.customerItem.id) {
      return null;
    }

    let Content = null;

    switch (this.state.currentTab) {
      case 0: {
        Content = JobsList;
        break;
      }
      default: {
        Content = RecurrencesList;
        break;
      }
    }

    return <Content {...this.props} refresh={this.fetchCustomerItem} />;
  };

  render() {
    return (
      <div>
        {this.renderBreadCrumbs()}

        <HeaderContextWrapper>
          {this.renderPageHeader()}
        </HeaderContextWrapper>

        <TabsWrapper
          indicatorColor="primary"
          onChange={this.handleChangeTab}
          textColor="primary"
          value={this.state.currentTab}
        >
          <Tab label={<FormattedMessage id="tasks" />} />
          <Tab label={<FormattedMessage id="recurrence" />} />
        </TabsWrapper>

        {this.renderTabContainer()}
      </div>
    );
  }
}

CustomerItem.defaultProps = {
  customerItemLoading: true,
};

CustomerItem.propTypes = {
  customerItem: PropTypes.object.isRequired,
  customerItemLoading: PropTypes.bool,
  fetchCustomerItem: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withCustomerItem(CustomerItem);
