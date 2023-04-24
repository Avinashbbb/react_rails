import MomentUtils from '@date-io/moment';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import frLocale from 'moment/locale/fr';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import React, { Component } from 'react';
import { addLocaleData, IntlProvider } from 'react-intl';
import fr from 'react-intl/locale-data/fr';
import { Route } from 'react-router-dom';
import styled, { injectGlobal, ThemeProvider } from 'styled-components';

import AccountStatementsList from "./AccountStatementsList";
import AssignmentDashboard from './AssignmentDashboard';
import CalendarDashboard from './CalendarDashboard';
import Contract from './Contract';
import ContractsList from './ContractsList';
import Customer from './Customer';
import CustomerItem from './CustomerItem';
import CustomersList from './CustomersList';
import DifferedTransactionsCreditList from './DifferedTransactionsCreditList';
import ErrorBoundary from './ErrorBoundary';
import Franchise from './Franchise';
import FranchisesList from './FranchisesList';
import Header from './header/Header';
import ItemsList from './ItemsList';
import Job from './Job';
import locales from '../locales';
import muiTheme from '../styles/mui-theme';
import theme from '../styles/theme';

// import ModalConnectQuickbooks from './ModalConnectQuickbooks';
// <ModalConnectQuickbooks onClose={() => { console.log('hiphop'); }} opened={false} />

// eslint-disable-next-line no-unused-expressions
injectGlobal`
  html {
    overflow-x: hidden;
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: ${props => props.theme.app.mainFont}; 
`;

addLocaleData(fr);

class App extends Component {
  state = { hasError: false };

  componentDidCatch() {
    const { hasError } = this.state;

    this.setState({ hasError: !hasError });
  }

  render() {
    const { hasError } = this.state;

    return (
      <MuiThemeProvider theme={muiTheme}>
        <ThemeProvider theme={theme}>
          <IntlProvider locale="fr" messages={locales.fr}>
            <MuiPickersUtilsProvider locale={frLocale} utils={MomentUtils}>
              <Wrapper>
                <CssBaseline />
                <Header />
                <ErrorBoundary hasError={hasError}>
                  <Route component={FranchisesList} path="/franchises" exact />
                  <Route component={Franchise} path="/franchises/:franchiseId" exact />
                  <Route component={AssignmentDashboard} path="/" exact />
                  <Route component={CalendarDashboard} path="/calendar" exact />
                  <Route component={ContractsList} path="/preparations" exact />
                  <Route component={CustomerItem} path="/preparations/:customerItemId" exact />
                  <Route component={Contract} path="/customers/:customerId/contracts/:contractId" exact />
                  <Route component={CustomerItem} path="/customers/:customerId/contracts/:contractId/preparations/:customerItemId" exact />
                  <Route component={CustomersList} path="/customers" exact />
                  <Route component={Customer} path="/customers/:customerId" exact />
                  <Route component={Job} path="/customers/:customerId/contracts/:contractId/preparations/:customerItemId/jobs/:jobId" exact />
                  <Route component={Job} path="/jobs/:jobId" exact />
                  <Route component={ItemsList} path="/items" exact />
                  <Route component={DifferedTransactionsCreditList} path="/differed_transactions_credit" exact />
                </ErrorBoundary>
              </Wrapper>
            </MuiPickersUtilsProvider>
          </IntlProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    );
  }
}

export default App;
