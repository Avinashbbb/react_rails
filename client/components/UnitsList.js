import AddIcon from '@material-ui/icons/Add';
import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { debounce } from 'lodash';
import { withUnits } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import FloatingActionButton from './ui/FloatingActionButton';
import ModalUnit from './ModalUnit';
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
  name: { label: <FormattedMessage id="units.name" /> },
};

class UnitsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    unitModalOpened: false,
    unitToEdit: {},
    unitToDelete: null,
    deleteUnitModalOpened: false,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchUnits();
  }

  componentWillUnmount() {
    this.props.flushUnits();
  }

  debouncedFetchUnits = debounce(() => {
    this.fetchUnits();
  }, 300);

  fetchUnits = () => {
    const { filter, limit, page } = this.state;

    this.props.fetchUnits(this.props.match.params.franchiseId, {
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
      this.fetchUnits,
    );
  };

  handleDeleteUnit = async () => {
    const { deleteUnit, match } = this.props;

    await deleteUnit(match.params.franchiseId, this.state.unitToDelete);

    const { unitToDelete, deleteUnitModalOpened } = this.initialState;

    this.setState({
      unitToDelete,
      deleteUnitModalOpened,
    }, this.fetchUnits);
  };

  handleFilter = handleFilter(this.debouncedFetchUnits).bind(this);
  handlePageChange = handlePageChange(this.fetchUnits).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchUnits).bind(this);
  handleSort = handleSort.bind(this);

  handleToggleUnitModal = (opened, unit) => () => {
    const unitToEdit = opened ? unit : this.initialState.unitToEdit;

    this.setState({
      unitModalOpened: opened,
      unitToEdit,
    });
  };

  handleToggleDeleteUnitModal = (opened, unitId) => () => {
    const unitToDelete = opened ? unitId : this.initialState.unitToDelete;

    this.setState({ deleteUnitModalOpened: opened, unitToDelete });
  };

  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['name'].map(name => (
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
    const { units, unitsLoading } = this.props;
    if (unitsLoading) {
      return <TableLoading />;
    }

    if (!units.length) {
      return <TableCellNoData />;
    }

    return sortedData(units, this.state).map((unit) => {
      const {
        id,
        name,
      } = unit;

      return (
        <TableRow key={id}>
          <TableCell>{name}</TableCell>
          <TableCell classes={{ root: 'action-cell' }}>
            <IconButton id="cpbr-edit-unit" onClick={this.handleToggleUnitModal(true, unit)}>
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton id="cpbr-delete-unit" onClick={this.handleToggleDeleteUnitModal(true, id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      unitToEdit, deleteUnitModalOpened, filter, limit, page,
    } = this.state;

    const actionName = unitToEdit.id ? <FormattedMessage id="edit" /> : <FormattedMessage id="add" />;

    return (
      <PageContainer>
        <PaperWrapper>
          <div>
            <FloatingActionButton
              onClick={this.handleToggleUnitModal(true, this.initialState.unitToEdit)}
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
            count={this.props.unitsCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />
        </PaperWrapper>

        <ModalUnit
          key={unitToEdit.id}
          actionName={actionName}
          unit={unitToEdit}
          onClose={this.handleToggleUnitModal(false)}
          open={this.state.unitModalOpened}
          refreshList={this.fetchAndResetPagination}
        />

        <ModalWarning
          onCancel={this.handleToggleDeleteUnitModal(false)}
          onSubmit={this.handleDeleteUnit}
          open={deleteUnitModalOpened}
          title={<FormattedMessage id="warning" />}
        >
          <FormattedMessage id="warning_delete_unit" />
        </ModalWarning>
      </PageContainer>
    );
  }
}
UnitsList.defaultProps = {
  unitsLoading: true,
};

UnitsList.propTypes = {
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
  unitsCount: PropTypes.number.isRequired,
  unitsLoading: PropTypes.bool,
  deleteUnit: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
  flushUnits: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default withUnits(UnitsList);
