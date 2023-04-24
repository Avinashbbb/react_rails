import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel } from '@material-ui/core';
import AssignmentIcon from '@material-ui/icons/Assignment';
import BuildIcon from '@material-ui/icons/Build';
import DeleteIcon from '@material-ui/icons/Delete';
import RemoveIcon from '@material-ui/icons/Remove';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { debounce } from 'lodash';
import { withContracts, withCustomerItems } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import ModalPreparation from './ModalPreparation';
import ModalWarning from './ModalWarning';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';
import TablePaginationWrapper from './ui/TablePaginationWrapper';
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

const data = {
  name: { label: <FormattedMessage id="name_simple" /> },
  planned: { label: <FormattedMessage id="planified" /> },
  prepared: { label: <FormattedMessage id="prepared" /> },
  startDate: { label: <FormattedMessage id="start_date" /> },
};

const daysRange = [7, 14, 30, 60, 0];

const statuses = [
  { label: <FormattedMessage id="status.all" />, value: 'ALL' },
  { label: <FormattedMessage id="status.wo_items" />, value: 'WO_ITEMS' },
  { label: <FormattedMessage id="status.not_prepared" />, value: 'NOT_PREPARED' },
  { label: <FormattedMessage id="status.not_planned" />, value: 'NOT_PLANNED' },
];

class CustomerItemsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    customerItemToEdit: {},
    customerToDelete: null,
    daysRangeFilter: daysRange[1],
    deleteCustomerItemModalOpened: false,
    modalPreparationOpened: false,
    statusFilter: statuses[0].value,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchCustomerItems();
  }

  componentWillUnmount() {
    this.props.flushCustomerItems();
  }

  debouncedFetchCustomerItems = debounce(() => {
    this.fetchCustomerItems();
  }, 300);

  fetchAndResetPagination = () => {
    this.setState(
      {
        ...this.initialState,
      },
      this.fetchCustomerItems,
    );
  };

  fetchCustomerItems = () => {
    const { fetchCustomerItemsByContract, match } = this.props;
    const { params } = match;
    const { contractId, customerId } = params;

    fetchCustomerItemsByContract(contractId, customerId);
  };

  handleDeleteCustomerItem = async () => {
    const { deleteCustomerItem } = this.props;

    await deleteCustomerItem(this.state.customerItemToDelete);

    const { deleteCustomerItemModalOpened, customerItemToDelete } = this.initialState;

    this.setState({
      deleteCustomerItemModalOpened,
      customerItemToDelete,
    }, this.fetchCustomerItems);
  };

  handleNavigateToJobs = path => () => {
    this.props.history.push(path);
  };

  handleToggleModalPreparation = (opened, customerItem) => () => {
    const customerItemToEdit = opened ? customerItem : this.initialState.customerItemToEdit;

    this.setState({
      modalPreparationOpened: opened,
      customerItemToEdit,
    });
  };

  handleSelectFilterChange = name => ({ target }) => {
    this.setState({
      [name]: target.value,
    }, this.fetchCustomerItems);
  };

  handleFilter = handleFilter(this.debouncedFetchCustomerItems).bind(this);
  handlePageChange = handlePageChange(this.fetchCustomerItems).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchCustomerItems).bind(this);
  handleSort = handleSort.bind(this);

  handleToggleDeleteCustomerItemModal = (opened, customerItemId) => () => {
    const customerItemToDelete = opened ? customerItemId : this.initialState.customerItemToDelete;

    this.setState({ deleteCustomerItemModalOpened: opened, customerItemToDelete });
  };

  renderCheckbox = checked => (
    checked ?
      <CheckCircleIcon className="cpbr-prepared prepared-icon-color" fontSize="small" /> :
      <RemoveIconWrapper fontSize="small" />
  );

  renderDeleteIcon = (id, planned) => {
    const label = planned ? 'warning_customer_item_delete' : 'delete';

    return (
      <Tooltip title={<FormattedMessage id={label} />} >
        <span>
          <IconButton
            id="cpbr-delete-customer-item"
            disabled={planned}
            onClick={this.handleToggleDeleteCustomerItemModal(true, id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  renderPreparationIcon = (customerItem, prepared) => {
    const label = prepared ? 'warning_customer_item_prepare' : 'prepare';

    return (
      <Tooltip title={<FormattedMessage id={label} />} >
        <IconButton
          id="cpbr-prepare"
          disabled={prepared}
          onClick={this.handleToggleModalPreparation(true, customerItem)}
        >
          <BuildIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  };

  renderJobsIcon = (path, prepared) => {
    const label = prepared ? 'tasks' : 'warning_must_be_prepared';

    return (
      <Tooltip title={<FormattedMessage id={label} />}>
        <span>
          <IconButton
            disabled={!prepared}
            onClick={this.handleNavigateToJobs(path)}
          >
            <AssignmentIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    );
  };


  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['name', 'startDate', 'prepared', 'planned'].map(name => (
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

          <TableCell />
        </TableRow>
      </TableHead>
    );
  };

  renderTableRows = () => {
    const { customerItems, customerItemsLoading, match } = this.props;
    const { params } = match;
    const { contractId, customerId } = params;

    if (customerItemsLoading) {
      return <TableLoading />;
    }

    return sortedData(customerItems, this.state).map((customerItem) => {
      const {
        id, name, planned, prepared, startDate,
      } = customerItem;

      const path = `/customers/${customerId}/contracts/${contractId}/preparations/${id}`;

      return (
        <TableRow key={id}>
          <TableCell>{name}</TableCell>

          <TableCell classes={{ root: 'date-cell' }}>{startDate}</TableCell>

          <TableCell classes={{ root: 'icon-cell' }}>{this.renderCheckbox(prepared)}</TableCell>

          <TableCell classes={{ root: 'icon-cell' }}>{this.renderCheckbox(planned)}</TableCell>

          <TableCell classes={{ root: 'action-cell no-pointer' }}>
            {this.renderPreparationIcon(customerItem, prepared)}

            {this.renderJobsIcon(path, prepared)}

            {this.renderDeleteIcon(id, planned)}
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      customerItemToEdit,
      deleteCustomerItemModalOpened,
      modalPreparationOpened,
      limit,
      page,
    } = this.state;

    return (
      <PageContainer>
        <PaperWrapper>
          <TableOverflowWrapper>

            <Table>
              {this.renderTableHead()}

              <TableBody>
                {this.renderTableRows()}
              </TableBody>
            </Table>
          </TableOverflowWrapper>

          <TablePaginationWrapper
            component="div"
            count={this.props.customerItemsCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />

          <ModalPreparation
            key={customerItemToEdit.id}
            customerItem={customerItemToEdit}
            onClose={this.handleToggleModalPreparation(false)}
            open={modalPreparationOpened}
            refresh={this.fetchAndResetPagination}
          />

          <ModalWarning
            onCancel={this.handleToggleDeleteCustomerItemModal(false)}
            onSubmit={this.handleDeleteCustomerItem}
            open={deleteCustomerItemModalOpened}
            title={<FormattedMessage id="warning" />}
          >
            <FormattedMessage id="warning_delete_contract_item" />
          </ModalWarning>
        </PaperWrapper>
      </PageContainer>
    );
  }
}

CustomerItemsList.defaultProps = {
  customerItemsLoading: true,
};

CustomerItemsList.propTypes = {
  customerItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  customerItemsCount: PropTypes.number.isRequired,
  customerItemsLoading: PropTypes.bool,
  fetchCustomerItemsByContract: PropTypes.func.isRequired,
  fetchCustomerItems: PropTypes.func.isRequired,
  flushCustomerItems: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(withContracts(withCustomerItems(CustomerItemsList)));
