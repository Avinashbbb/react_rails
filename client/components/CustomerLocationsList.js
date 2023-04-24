import AddIcon from '@material-ui/icons/Add';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { debounce } from 'lodash';
import { withCustomerLocations } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import FloatingActionButton from './ui/FloatingActionButton';
import ModalCustomerLocation from './ModalCustomerLocation';
import ModalWarning from './ModalWarning';
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
  adr1: { label: <FormattedMessage id="address.adr_normal" /> },
  apt: { label: <FormattedMessage id="address.apt" /> },
  city: { label: <FormattedMessage id="address.city" /> },
  name: { label: <FormattedMessage id="address.name" /> },
  postalCode: { label: <FormattedMessage id="address.postal_code" /> },
};

class CustomerLocationsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    customerLocationModalOpened: false,
    customerLocationToEdit: {},
    customerLocationToDelete: null,
    deleteCustomerLocationModalOpened: false,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchCustomerLocations();
  }

  componentWillUnmount() {
    this.props.flushCustomerLocations();
  }

  debouncedFetchCustomerLocations = debounce(() => {
    this.fetchCustomerLocations();
  }, 300);

  fetchCustomerLocations = () => {
    const { filter, limit, page } = this.state;

    this.props.fetchCustomerLocations(this.props.match.params.customerId, {
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
      this.fetchCustomerLocations,
    );
  };

  handleDeleteCustomerLocation = async () => {
    const { deleteLocation, match } = this.props;

    await deleteLocation(match.params.customerId, this.state.customerLocationToDelete);

    const { customerLocationToDelete, deleteCustomerLocationModalOpened } = this.initialState;

    this.setState({
      customerLocationToDelete,
      deleteCustomerLocationModalOpened,
    }, this.fetchCustomerLocations);
  };

  handleFilter = handleFilter(this.debouncedFetchCustomerLocations).bind(this);
  handlePageChange = handlePageChange(this.fetchCustomerLocations).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchCustomerLocations).bind(this);
  handleSort = handleSort.bind(this);

  handleToggleCustomerLocationModal = (opened, customerLocation) => () => {
    const customerLocationToEdit = opened ? customerLocation : this.initialState.customerLocationToEdit;

    this.setState({
      customerLocationModalOpened: opened,
      customerLocationToEdit,
    });
  };

  handleToggleDeleteCustomerLocationModal = (opened, customerLocationId) => () => {
    const customerLocationToDelete = opened
      ? customerLocationId
      : this.initialState.customerLocationToDelete;

    this.setState({ deleteCustomerLocationModalOpened: opened, customerLocationToDelete });
  };

  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['name', 'adr1', 'apt', 'postalCode', 'city'].map(name => (
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
    const { customerLocations, customerLocationsLoading } = this.props;

    if (customerLocationsLoading) {
      return <TableLoading />;
    }

    if (!customerLocations.length) {
      return <TableCellNoData />;
    }

    return sortedData(customerLocations, this.state).map((customerLocation) => {
      const {
        id,
        adr1,
        apt,
        city,
        doorNo,
        name,
        postalCode,
        province,
      } = customerLocation;

      return (
        <TableRow key={id}>
          <TableCell>{name}</TableCell>
          <TableCell>{doorNo}, {adr1}</TableCell>
          <TableCell>{apt}</TableCell>
          <TableCell classes={{ root: 'zipcode-cell' }}>{postalCode}</TableCell>
          <TableCell>{city}, {province}</TableCell>
          <TableCell classes={{ root: 'action-cell' }}>
            <IconButton
              id="cpbr-edit-location"
              onClick={this.handleToggleCustomerLocationModal(true, customerLocation)}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton id="cpbr-delete-location" onClick={this.handleToggleDeleteCustomerLocationModal(true, id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      customerLocationToEdit, deleteCustomerLocationModalOpened, filter, limit, page,
    } = this.state;

    const actionName = customerLocationToEdit.id ? <FormattedMessage id="edit" /> : <FormattedMessage id="add" />;

    return (
      <PageContainer>
        <PaperWrapper>
          <div>
            <FloatingActionButton
              onClick={
                this.handleToggleCustomerLocationModal(true, this.initialState.customerLocationToEdit)
              }
            >
              <AddIcon />
            </FloatingActionButton>
          </div>

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
            count={this.props.customerLocationsCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />
        </PaperWrapper>

        <ModalCustomerLocation
          key={customerLocationToEdit.id}
          actionName={actionName}
          customerLocation={customerLocationToEdit}
          onClose={this.handleToggleCustomerLocationModal(false)}
          open={this.state.customerLocationModalOpened}
          refreshList={this.fetchAndResetPagination}
        />

        <ModalWarning
          onCancel={this.handleToggleDeleteCustomerLocationModal(false)}
          onSubmit={this.handleDeleteCustomerLocation}
          open={deleteCustomerLocationModalOpened}
          title={<FormattedMessage id="warning" />}
        >
          <FormattedMessage id="warning_delete_location" />
        </ModalWarning>
      </PageContainer>
    );
  }
}

CustomerLocationsList.defaultProps = {
  customerLocationsLoading: true,
};

CustomerLocationsList.propTypes = {
  customerLocations: PropTypes.arrayOf(PropTypes.object).isRequired,
  customerLocationsLoading: PropTypes.bool,
  customerLocationsCount: PropTypes.number.isRequired,
  deleteLocation: PropTypes.func.isRequired,
  fetchCustomerLocations: PropTypes.func.isRequired,
  flushCustomerLocations: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default withCustomerLocations(CustomerLocationsList);
