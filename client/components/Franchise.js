import { Tab } from '@material-ui/core';
import { withFranchise, withFranchises } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Breadcrumbs from './Breadcrumbs';
import HeaderContextWrapper from './ui/HeaderContextWrapper';
import PageHeader from './ui/PageHeader';
import TabsWrapper from './ui/TabsWrapper';
import AccountStatementsList from './AccountStatementsList';
import BankAccountData from './BankAccountData';
import PerformanceReportsList from './PerformanceReportsList';
import UnitsList from './UnitsList';
import withUser from '../containers/withUser';

class Franchise extends PureComponent {
  state = {
    currentTab: 0,
  };

  async componentDidMount() {
    await this.fetchFranchise();
  }

  fetchFranchise = async () => {
    const { fetchCurrentUser, fetchFranchise, match } = this.props;

    await fetchFranchise(match.params.franchiseId);

    const user = await fetchCurrentUser();
    const userFranchiseId = user.opportunist_id;

    this.setState({
      userFranchiseId,
    });
  }

  handleChangeTab = (_, currentTab) => {
    this.setState({
      currentTab,
    });
  };

  renderPageHeader = () => {};

  renderTabContainer = () => {
    let Content = null;

    switch (this.state.currentTab) {
      case 0: {
        Content = AccountStatementsList;
        break;
      }
      case 1: {
        Content = UnitsList;
        break;
      }
      case 2: {
        Content = PerformanceReportsList;
        break;
      }
      case 3: {
        Content = BankAccountData;
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
    const {
      franchise,
      franchiseLoading,
      franchisesRootAccess,
      history,
    } = this.props;

    const { userFranchiseId } = this.state;

    if (franchiseLoading || Object.keys(franchise).length === 0) {
      return null;
    }

    const { data } = franchise;

    if (data === undefined) {
      return null;
    }

    const { id, name } = data;

    const showBankTab = franchisesRootAccess || id === userFranchiseId;

    return (
      <div>
        <Breadcrumbs>
          <li><Link to="/franchises"><FormattedMessage id="franchises" /></Link></li>
          <li>{name.toLowerCase()}</li>
        </Breadcrumbs>

        <HeaderContextWrapper>
          <PageHeader titleText={name} onBackClick={history.goBack}>
            {this.renderPageHeader()}
          </PageHeader>
        </HeaderContextWrapper>

        <TabsWrapper
          indicatorColor="primary"
          onChange={this.handleChangeTab}
          textColor="primary"
          value={this.state.currentTab}
        >
          <Tab label={<FormattedMessage id="account_statements" />} />
          <Tab label={<FormattedMessage id="units.title" />} />
          {franchisesRootAccess &&
            <Tab label={<FormattedMessage id="performance_reports" />} />
          }
          {showBankTab &&
            <Tab label={<FormattedMessage id="bank.data" />} />
          }
        </TabsWrapper>

        {this.renderTabContainer()}
      </div>
    );
  }
}

Franchise.propTypes = {
  fetchCurrentUser: PropTypes.func.isRequired,
  fetchFranchise: PropTypes.func.isRequired,
  franchise: PropTypes.object.isRequired,
  franchiseLoading: PropTypes.bool.isRequired,
  franchisesRootAccess: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withUser(withFranchises(withFranchise(Franchise)));
