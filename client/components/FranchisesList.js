import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import { debounce } from 'lodash';
import { withFranchises } from 'optigo-redux';
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
  name: { isSortable: true, label: <FormattedMessage id="name_simple" />, sortColumnName: 'name' },
  type: { isSortable: false, label: <FormattedMessage id="kind" /> },
};

class FranchisesList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: null,
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    deleteFranchiseModalOpened: false,
    franchiseModalOpened: false,
    franchiseToEdit: {},
    franchiseToDelete: null,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchFranchises();
  }

  componentWillUnmount() {
    this.props.flushFranchises();
    this.fetchFranchises();
  }

  debouncedFetchFranchises = debounce(() => {
    this.fetchFranchises();
  }, 300);

  fetchFranchises = () => {
    const {
      filter, limit, page, sort,
    } = this.state;
    const { columnName, direction } = sort;

    this.props.fetchFranchises({
      filter: filter.trim(),
      page: page + 1,
      limit,
      sortColumnName: columnName,
      sortDirection: direction,
    });
  };

  handleFilter = handleFilter(this.debouncedFetchFranchises).bind(this);
  handlePageChange = handlePageChange(this.fetchFranchises).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchFranchises).bind(this);
  handleSort = handleSort.bind(this);

  handleRowClick = path => () => {
    this.props.history.push(path);
  };

  handleSortClick = name => () => {
    this.handleSort(name, this.fetchFranchises)();
  };

  handleToggleDeleteFranchiseModal = (opened, franchiseId) => () => {
    const franchiseToDelete = opened ? franchiseId : this.initialState.franchiseToDelete;

    this.setState({ deleteFranchiseModalOpened: opened, franchiseToDelete });
  };

  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['name', 'type'].map(name => (
            <TableCell key={name}>
              <TableSortLabel
                active={columnName === data[name].sortColumnName}
                direction={direction}
                disabled={!data[name].isSortable}
                onClick={this.handleSortClick(data[name].sortColumnName)}
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
    const { franchises, franchisesLoading } = this.props;

    if (franchisesLoading) {
      return <TableLoading />;
    }

    if (!franchises.length) {
      return <TableCellNoData />;
    }

    return sortedData(franchises, this.state).map((franchise) => {
      const {
        id, name, kind,
      } = franchise;

      return (
        <TableRow key={id} className="link-row" onClick={this.handleRowClick(`/franchises/${id}`)}>
          <TableCell>{name}</TableCell>
          <TableCell>{kind}</TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      filter, limit, page,
    } = this.state;

    const { franchisesCount } = this.props;

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
            count={franchisesCount}
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

FranchisesList.defaultProps = {
  franchisesLoading: true,
};

FranchisesList.propTypes = {
  franchises: PropTypes.arrayOf(PropTypes.object).isRequired,
  franchisesLoading: PropTypes.bool,
  franchisesCount: PropTypes.number.isRequired,
  fetchFranchises: PropTypes.func.isRequired,
  flushFranchises: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withFranchises(FranchisesList));
