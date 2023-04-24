import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
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

import {
  filteringState,
  handleFilter,
  handlePageChange,
  handleRowsPerPageChange,
  handleSort,
  sortedData,
} from '../utils/filtering';

const data = {
  reports: { label: <FormattedMessage id="common.title.reports" /> },
  endAt: { label: <FormattedMessage id="account_statement.scope_end_at" /> },
  startAt: { label: <FormattedMessage id="account_statement.scope_start_at" /> },
};

class PerformanceReportsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
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

  downloadFile = (franchiseId, id) => () => {
    setTimeout(() => {
      const response = {
        file: `/optigo/api/v1/franchises/${franchiseId}/account_statements/${id}/perform_excel`,
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

  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['startAt', 'endAt', 'reports'].map(name => (
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
    const {
      accountStatements, accountStatementsLoading, match,
    } = this.props;

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
          <TableCell classes={{ root: 'action-cell' }}>
            <IconButton onClick={this.downloadFile(franchiseId, id)}>
              <CloudDownloadIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      filter, limit, page,
    } = this.state;

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

PerformanceReportsList.defaultProps = {
  accountStatementsLoading: true,
};

PerformanceReportsList.propTypes = {
  accountStatements: PropTypes.arrayOf(PropTypes.object).isRequired,
  accountStatementsLoading: PropTypes.bool,
  accountStatementsCount: PropTypes.number.isRequired,
  fetchAccountStatements: PropTypes.func.isRequired,
  flushAccountStatements: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withFranchises(withRouter(withAccountStatements(PerformanceReportsList)));
