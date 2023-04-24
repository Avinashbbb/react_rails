import { Button, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PictureAsPdf from '@material-ui/icons/PictureAsPdf';
import { debounce } from 'lodash';
import { withAccountStatements, withFranchises } from 'optigo-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';

import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableCellNoData from './ui/TableCellNoData';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';
import TablePaginationWrapper from './ui/TablePaginationWrapper';
import TextFieldUi from './ui/TextField';
import ModalSalesAndSupplies from './ModalSalesAndSupplies';
import {
  filteringState,
  handleFilter,
  handlePageChange,
  handleRowsPerPageChange,
  handleSort,
  sortedData,
} from '../utils/filtering';

const data = {
  actions: { label: <FormattedMessage id="actions" /> },
  endAt: { label: <FormattedMessage id="account_statement.scope_end_at" /> },
  pdf: { label: <FormattedMessage id="account_statement.pdf" /> },
  sales: { label: <FormattedMessage id="account_statement.sales" /> },
  startAt: { label: <FormattedMessage id="account_statement.scope_start_at" /> },
  total: { label: <FormattedMessage id="account_statement.total" /> },
};

class AccountStatementsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    deleteAccountStatementModalOpened: false,
    accountStatementModalOpened: false,
    accountStatementToEdit: {},
    accountStatementToDelete: null,
    salesAndSuppliesModalOpened: false,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchAccountStatements();
  }

  componentWillUnmount() {
    this.props.flushAccountStatements();
  }

  debouncedFetchAccountStatements = debounce(() => {
    this.fetchAccountStatements();
  }, 300);

  downloadFile = (franchiseId, id, fileType) => () => {
    setTimeout(() => {
      const response = fileType === 'xlsx' ? {
        file: `/optigo/api/v1/franchises/${franchiseId}/account_statements/${id}/export`,
      } : {
        file: `/optigo/api/v1/franchises/${franchiseId}/account_statements/${id}/export_pdf`,
      };
      window.open(response.file);
    }, 100);
  };

  fetchAccountStatements = () => {
    const { filter, limit, page } = this.state;
    const { fetchAccountStatements, match } = this.props;

    fetchAccountStatements({
      franchiseId: match.params.franchiseId,
      filter: filter.trim(),
      page: page + 1,
      limit,
    });
  };

  fetchAndResetPagination = () => {
    this.setState(
      {
        ...this.initialState,
      },
      this.fetchAccountStatements,
    );
  };

  handleFilter = handleFilter(this.debouncedFetchAccountStatements).bind(this);
  handlePageChange = handlePageChange(this.fetchAccountStatements).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchAccountStatements).bind(this);
  handleSort = handleSort.bind(this);

  handleRowClick = path => () => {
    this.props.history.push(path);
  };

  handleToggleSalesAndSuppliesModal = (opened, accountStatement) => () => {
    const accountStatementToEdit = opened ? accountStatement : this.initialState.accountStatementToEdit;

    this.setState({
      salesAndSuppliesModalOpened: opened,
      accountStatementToEdit,
    });
  };

  renderTableHead = () => {
    const { franchisesRootAccess } = this.props;

    const { columnName, direction } = this.state.sort;

    const basicHeaders = ['startAt', 'endAt', 'pdf']
    // const basicHeaders = ['startAt', 'endAt', 'sales', 'pdf']
    const headers = franchisesRootAccess ? basicHeaders.concat('actions') : basicHeaders;

    return (
      <TableHead>
        <TableRow>
          {headers.map(name => (
            <TableCell key={name}>
              <TableSortLabel
                active={columnName === name}
                direction={direction}
                onClick={this.handleSort(name)}
              >
                {data[name].label}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  renderTableRows = () => {
    const { accountStatements, accountStatementsLoading, franchisesRootAccess, match } = this.props;

    if (accountStatementsLoading) {
      return <TableLoading />;
    }

    if (!accountStatements.length) {
      return <TableCellNoData />;
    }

    const franchiseId = match.params.franchiseId;

    return sortedData(accountStatements, this.state).map((accountStatement) => {
      const { id, scopeEndAt, scopeStartAt } = accountStatement;

      return (
        <TableRow key={id}>
          <TableCell>{moment(scopeStartAt).format('YYYY-MM-DD')}</TableCell>
          <TableCell>{moment(scopeEndAt).format('YYYY-MM-DD')}</TableCell>
          {/*<TableCell>*/}
          {/*  {*/}
          {/*    moment().isAfter(moment(scopeStartAt).subtract(1, 'days'), 'day') &&*/}
          {/*    moment().isBefore(moment(scopeEndAt).add(1, 'days'), 'day') &&*/}
          {/*    <Button variant="contained" onClick={this.handleToggleSalesAndSuppliesModal(true, id)}>*/}
          {/*      <FormattedMessage id="weekly_sales" />*/}
          {/*    </Button>*/}
          {/*  }*/}
          {/*</TableCell>*/}
          <TableCell classes={{ root: 'action-cell' }}>
            <IconButton onClick={this.downloadFile(franchiseId, id, 'pdf')}>
              <PictureAsPdf fontSize="small" />
            </IconButton>
          </TableCell>
          {
            franchisesRootAccess &&
            <TableCell classes={{ root: 'action-cell' }}>
              <IconButton onClick={this.downloadFile(franchiseId, id, 'xlsx')}>
                <CloudDownloadIcon fontSize="small" />
              </IconButton>
            </TableCell>
          }
        </TableRow>
      );
    });
  };

  render() {
    const { accountStatements } = this.props;

    const {
      accountStatementToEdit, filter, limit, page, salesAndSuppliesModalOpened,
    } = this.state;

    const actionName = <FormattedMessage id="add" />;

    return (
      <PageContainer>
        <PaperWrapper>
          <TableOverflowWrapper>
            <Toolbar>
              <TextFieldUi
                id="cpbr-filtre"
                label={<FormattedMessage id="filter" />}
                onChange={this.handleFilter}
                type="search"
                value={filter}
              />
            </Toolbar>

            <Table>
              {this.renderTableHead()}

              <TableBody>
                {this.renderTableRows()}
              </TableBody>
            </Table>
          </TableOverflowWrapper>

          <ModalSalesAndSupplies
            key={accountStatementToEdit}
            actionName={actionName}
            accountStatementId={accountStatementToEdit}
            accountStatements={accountStatements}
            onClose={this.handleToggleSalesAndSuppliesModal(false)}
            open={salesAndSuppliesModalOpened}
            refreshList={this.fetchAndResetPagination}
          />

          <TablePaginationWrapper
            component="div"
            count={this.props.accountStatementsCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />
        </PaperWrapper>
      </PageContainer>
    );
  }
}

AccountStatementsList.defaultProps = {
  accountStatementsLoading: true,
};

AccountStatementsList.propTypes = {
  accountStatements: PropTypes.arrayOf(PropTypes.object).isRequired,
  accountStatementsLoading: PropTypes.bool,
  accountStatementsCount: PropTypes.number.isRequired,
  fetchAccountStatements: PropTypes.func.isRequired,
  flushAccountStatements: PropTypes.func.isRequired,
  franchisesRootAccess: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};

export default withFranchises(withRouter(withAccountStatements(AccountStatementsList)));
