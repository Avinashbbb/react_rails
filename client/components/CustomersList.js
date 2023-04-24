import { Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import { debounce } from 'lodash';
import { withCustomers } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import BlockIcon from '@material-ui/icons/Block';

import ModalWarning from './ModalWarning';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableCellNoData from './ui/TableCellNoData';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';
import TablePaginationWrapper from './ui/TablePaginationWrapper';
import SwitchField from './ui/SwitchField';
import TextFieldUi from './ui/TextField';
import {
  filteringState,
  handleChangeBoolFilter,
  handleFilter,
  handlePageChange,
  handleRowsPerPageChange,
  handleSort,
  sortedData,
} from '../utils/filtering';

const data = {
  address: { isSortable: false, label: <FormattedMessage id="address.adr" />, sortColumnName: 'address' },
  apt: { isSortable: false, label: <FormattedMessage id="address.apt" />, sortColumnName: 'apt' },
  city: { isSortable: false, label: <FormattedMessage id="address.city" />, sortColumnName: 'city' },
  country: { isSortable: false, label: <FormattedMessage id="address.country" />, sortColumnName: 'country' },
  name: { isSortable: true, label: <FormattedMessage id="name_simple" />, sortColumnName: 'name' },
  postalCode: { isSortable: false, label: <FormattedMessage id="address.postal_code" />, sortColumnName: 'postalCode' },
  province: { isSortable: false, label: <FormattedMessage id="address.province" />, sortColumnName: 'province' },
  franchiseName: { isSortable: false, label: <FormattedMessage id="franchise_name" />, sortColumnName: 'franchiseName' },
  inactive: { isSortable: false, label: <FormattedMessage id="inactive" /> },
};

class CustomersList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: null,
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    deleteCustomerModalOpened: false,
    customerModalOpened: false,
    customerToEdit: {},
    customerToDelete: null,
    activeOnly: false,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchCustomers();
  }

  componentWillUnmount() {
    this.props.flushCustomers({ limit: -1, sortColumnName: 'name', activeOnly: true });
  }

  debouncedFetchCustomers = debounce(() => {
    this.fetchCustomers();
  }, 300);

  fetchCustomers = () => {
    const {
      activeOnly, filter, limit, page, sort,
    } = this.state;
    const { columnName, direction } = sort;

    this.props.fetchCustomers({
      filter: filter.trim(),
      page: page + 1,
      limit,
      sortColumnName: columnName,
      sortDirection: direction,
      activeOnly,
    });
  };

  handleClickBoolFilter = name => () => {
    this.handleChangeBoolFilter(name, this.fetchCustomers)();
  };

  handleDeleteCustomer = async () => {
    const { deleteCustomer } = this.props;

    await deleteCustomer(this.state.customerToDelete);

    const { deleteCustomerModalOpened, customerToDelete } = this.initialState;

    this.setState({
      deleteCustomerModalOpened,
      customerToDelete,
    }, this.fetchCustomers);
  };

  handleChangeBoolFilter = handleChangeBoolFilter.bind(this);
  handleFilter = handleFilter(this.debouncedFetchCustomers).bind(this);
  handlePageChange = handlePageChange(this.fetchCustomers).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchCustomers).bind(this);
  handleSort = handleSort.bind(this);

  handleRowClick = path => () => {
    this.props.history.push(path);
  };

  handleSortClick = name => () => {
    this.handleSort(name, this.fetchCustomers)();
  };

  handleToggleDeleteCustomerModal = (opened, customerId) => () => {
    const customerToDelete = opened ? customerId : this.initialState.customerToDelete;

    this.setState({ deleteCustomerModalOpened: opened, customerToDelete });
  };

  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['name', 'address', 'apt', 'city', 'province', 'postalCode', 'franchiseName', 'inactive'].map(name => (
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
    const { customers, customersLoading } = this.props;

    if (customersLoading) {
      return <TableLoading />;
    }

    if (!customers.length) {
      return <TableCellNoData />;
    }

    return sortedData(customers, this.state).map((customer) => {
      const {
        id, apt, city, name, postalCode, province, street, franchiseName, inactive,
      } = customer;

      return (
        <TableRow key={id} className="link-row" onClick={this.handleRowClick(`/customers/${id}`)}>
          <TableCell>{name}</TableCell>

          <TableCell>{street}</TableCell>

          <TableCell>{apt}</TableCell>

          <TableCell>{city}</TableCell>

          <TableCell classes={{ root: 'province-cell' }}>{province}</TableCell>

          <TableCell>{postalCode}</TableCell>

          <TableCell>{franchiseName}</TableCell>

          <TableCell>{inactive && (
            <BlockIcon fontSize="small" />
          )}
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      activeOnly, deleteCustomerModalOpened, filter, limit, page,
    } = this.state;

    const { customersCount } = this.props;

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

              <SwitchField
                checked={activeOnly}
                onChange={this.handleClickBoolFilter('activeOnly')}
                value="activeOnly"
                label={<FormattedMessage id="active_only" />}
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
            count={customersCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />

          <ModalWarning
            onCancel={this.handleToggleDeleteCustomerModal(false)}
            onSubmit={this.handleDeleteCustomer}
            open={deleteCustomerModalOpened}
            title={<FormattedMessage id="warning" />}
          >
            <FormattedMessage id="warning_delete_customer" />
          </ModalWarning>
        </PaperWrapper>
      </PageContainer>
    );
  }
}

CustomersList.defaultProps = {
  customersLoading: true,
};

CustomersList.propTypes = {
  customers: PropTypes.arrayOf(PropTypes.object).isRequired,
  customersLoading: PropTypes.bool,
  customersCount: PropTypes.number.isRequired,
  deleteCustomer: PropTypes.func.isRequired,
  fetchCustomers: PropTypes.func.isRequired,
  flushCustomers: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withCustomers(CustomersList));
