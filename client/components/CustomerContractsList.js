import { IconButton, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';
import RemoveIcon from '@material-ui/icons/Remove';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { debounce } from 'lodash';
import { withContracts } from 'optigo-redux';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';
import TablePaginationWrapper from './ui/TablePaginationWrapper';
import SelectUi from './ui/Select';
import TextFieldUi from './ui/TextField';
import Tooltip from './ui/Tooltip';
import {
  filteringState,
  handleFilter,
  handlePageChange,
  handleRowsPerPageChange,
  handleSort,
  sortedData,
} from '../utils/filtering';

const RemoveIconWrapper = styled(RemoveIcon)`
  font-size: 12px !important;
  position: relative;
`;

const ToolbarFormControlWrapper = styled.div`
  margin-right: 25px;
`;

const data = {
  name: { label: <FormattedMessage id="name_simple" /> },
  startDate: { label: <FormattedMessage id="start_date" /> },
};

const daysRange = [7, 14, 30, 60, 0];

const statuses = [
  { label: <FormattedMessage id="status.all" />, value: 'ALL' },
  { label: <FormattedMessage id="status.init" />, value: 'INIT' },
  { label: <FormattedMessage id="status.quoted" />, value: 'QUOTED' },
];

class CustomerContractsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    customerToDelete: null,
    daysRangeFilter: daysRange[1],
    statusFilter: statuses[0].value,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchContracts();
  }

  componentWillUnmount() {
    this.props.flushContracts();
  }

  debouncedFetchContracts = debounce(() => {
    this.fetchContracts();
  }, 300);

  fetchAndResetPagination = () => {
    this.setState(
      {
        ...this.initialState,
      },
      this.fetchContracts,
    );
  };

  fetchContracts = () => {
    const {
      daysRangeFilter, filter, limit, page, statusFilter,
    } = this.state;

    this.props.fetchContracts(this.props.match.params.customerId, {
      daysRange: daysRangeFilter,
      filter: filter.trim(),
      page: page + 1,
      status: statusFilter,
      limit,
    });
  };

  handleNavigate = path => () => {
    this.props.history.push(path);
  };

  handleSelectFilterChange = name => ({ target }) => {
    this.setState({
      [name]: target.value,
    }, this.fetchContracts);
  };

  handleFilter = handleFilter(this.debouncedFetchContracts).bind(this);
  handlePageChange = handlePageChange(this.fetchContracts).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchContracts).bind(this);
  handleSort = handleSort.bind(this);

  renderCheckbox = checked => (
    checked ?
      <CheckCircleIcon className="cpbr-prepared prepared-icon-color" fontSize="small" /> :
      <RemoveIconWrapper fontSize="small" />
  );

  renderPreparationIcon = contract => (
    <Tooltip title={<FormattedMessage id="prepare" />} >
      <IconButton id="cpbr-prepare" onClick={this.handleToggleModalPreparation(true, contract)}>
        <BuildIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['name', 'startDate'].map(name => (
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
    const { contracts, contractsLoading, match } = this.props;
    const { params } = match;

    if (contractsLoading) {
      return <TableLoading />;
    }

    return sortedData(contracts, this.state).map((contract) => {
      const {
        id, contractNo, name, startDate,
      } = contract;

      const path = `/customers/${params.customerId}/contracts/${id}`;

      return (
        <TableRow key={id} onClick={this.handleNavigate(path)}>
          <TableCell>{name || contractNo}</TableCell>

          <TableCell classes={{ root: 'date-cell' }}>{moment(startDate).format("YYYY-MM-DD")}</TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      daysRangeFilter,
      filter,
      limit,
      page,
      statusFilter,
    } = this.state;

    return (
      <PageContainer>
        <PaperWrapper>
          <TableOverflowWrapper>
            <Toolbar>
              <ToolbarFormControlWrapper>
                <TextFieldUi
                  id="cpbr-filtre"
                  label={<FormattedMessage id="filter" />}
                  onChange={this.handleFilter}
                  type="search"
                  value={filter}
                />
              </ToolbarFormControlWrapper>

              <ToolbarFormControlWrapper>
                <SelectUi
                  formControlClassName="filter-width"
                  id="cpbr-filter-days-range"
                  inputLabelText={<FormattedMessage id="contract_start" />}
                  onChange={this.handleSelectFilterChange('daysRangeFilter')}
                  value={daysRangeFilter}
                >
                  {daysRange.map(range => (
                    <MenuItem key={range} value={range}>{range === 0 ? 'Tous' : `${range} jours`}</MenuItem>
                  ))}
                </SelectUi>
              </ToolbarFormControlWrapper>

              <ToolbarFormControlWrapper>
                <SelectUi
                  formControlClassName="filter-width"
                  inputLabelText={<FormattedMessage id="status.title" />}
                  onChange={this.handleSelectFilterChange('statusFilter')}
                  value={statusFilter}
                >
                  {statuses.map(({ label, value }) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </SelectUi>
              </ToolbarFormControlWrapper>
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
            count={this.props.contractsCount}
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

CustomerContractsList.defaultProps = {
  contractsLoading: true,
};

CustomerContractsList.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.object).isRequired,
  contractsCount: PropTypes.number.isRequired,
  contractsLoading: PropTypes.bool,
  fetchContracts: PropTypes.func.isRequired,
  flushContracts: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withContracts(CustomerContractsList));
