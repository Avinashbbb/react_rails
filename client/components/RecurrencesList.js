import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from "@material-ui/icons/Delete";
import {IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar} from '@material-ui/core';
import {debounce} from 'lodash';
import {PropTypes} from 'prop-types';
import React, {PureComponent} from 'react';
import {FormattedMessage} from 'react-intl';
import {withRecurrences} from 'optigo-redux';
import moment from 'moment';

import ModalRecurrence from './ModalRecurrence';
import ModalWarning from './ModalWarning';
import FloatingActionButton from './ui/FloatingActionButton';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableCellNoData from './ui/TableCellNoData';
import TableLoading from './ui/TableLoading';
import TablePaginationWrapper from './ui/TablePaginationWrapper';
import TableOverflowWrapper from './ui/TableOverflowWrapper';
import TextFieldUi from './ui/TextField';
import {
  filteringState,
  handleFilter,
  handlePageChange,
  handleRowsPerPageChange,
  handleSort,
  sortedData,
} from '../utils/filtering';

const headerLabels = {
  code: {label: <FormattedMessage id="kind"/>},
  endDate: {label: <FormattedMessage id="end_date"/>},
  schedule: {label: <FormattedMessage id="schedule"/>},
  startDate: {label: <FormattedMessage id="start_date"/>},
  unitName: {label: <FormattedMessage id="jobs.unit"/>},
};

class RecurrencesList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'identifier',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    deleteRecurrenceModalOpened: false,
    recurrenceModalOpened: false,
    recurrenceToEdit: {},
    recurrenceToDelete: null,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };


  componentDidMount() {
    this.fetchRecurrences();
  }

  componentWillUnmount() {
    this.props.flushRecurrences();
  }

  debouncedFetchRecurrences = debounce(() => {
    this.fetchRecurrences();
  }, 300);

  fetchAndResetPagination = () => {
    this.setState(
      {
        ...this.initialState,
      },
      this.fetchRecurrences,
    );
  };

  fetchRecurrences = () => {
    const {fetchCustomerItemRecurrences, match} = this.props;
    const {filter, limit, page} = this.state;

    fetchCustomerItemRecurrences(match.params.customerItemId, {
      filter: filter.trim(),
      page: page + 1,
      limit,
    });
  };

  handleFilter = handleFilter(this.debouncedFetchRecurrences).bind(this);
  handlePageChange = handlePageChange(this.fetchRecurrences).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchRecurrences).bind(this);
  handleSort = handleSort.bind(this);

  handleToggleRecurrenceModal = recurrenceModalOpened => () => {
    this.setState({
      recurrenceModalOpened,
    });
  };

  handleToggleDeleteRecurrenceModal = (opened, recurrenceId) => () => {
    const recurrenceToDelete = opened ? recurrenceId : this.initialState.recurrenceToDelete;

    this.setState({deleteRecurrenceModalOpened: opened, recurrenceToDelete});
  };

  handleDeleteRecurrence = async () => {
    const {deleteRecurrence, match} = this.props;

    await deleteRecurrence(match.params.customerItemId, this.state.recurrenceToDelete);

    const {deleteRecurrenceModalOpened, recurrenceToDelete} = this.initialState;

    this.setState({
      deleteRecurrenceModalOpened,
      recurrenceToDelete,
    }, this.fetchRecurrences);
  };

  renderTableHead = () => {
    const {columnName, direction} = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['startDate', 'endDate', 'code', 'schedule', 'unitName'].map(name => (
            <TableCell key={name}>
              <TableSortLabel
                active={columnName === name}
                direction={direction}
                onClick={this.handleSort(name)}
              >
                {headerLabels[name].label}
              </TableSortLabel>
            </TableCell>
          ))}

          <TableCell />
        </TableRow>
      </TableHead>
    );
  };

  renderDeleteIcon = (endDate, id) => {
    if (endDate) {
      return <TableCell/>;
    } else {
      return (
        <TableCell classes={{root: 'action-cell'}}>
          <IconButton id="cpbr-delete-recurrence" onClick={this.handleToggleDeleteRecurrenceModal(true, id)}>
            <DeleteIcon fontSize="small"/>
          </IconButton>
        </TableCell>
      );
    }
  };

  renderTableRows = () => {
    const {recurrences, recurrencesLoading} = this.props;

    if (recurrencesLoading) {
      return <TableLoading/>;
    }

    if (!recurrences.length) {
      return <TableCellNoData/>;
    }

    return sortedData(this.props.recurrences, this.state).map((recurrence) => {
      const {
        id, code, endDate, schedule, startDate, unitName,
      } = recurrence;

      if (endDate && moment(endDate) < moment().startOf('date')) {
        return null;
      } else {
        return (
          <TableRow key={id}>
            <TableCell>{startDate}</TableCell>
            <TableCell>{endDate}</TableCell>
            <TableCell>{code}</TableCell>
            <TableCell>{schedule}</TableCell>
            <TableCell>{unitName}</TableCell>
            {this.renderDeleteIcon(endDate, id)}
          </TableRow>
        );
      }
    });
  };

  render() {
    const {customerItem, recurrencesCount} = this.props;

    const {
      filter,
      limit,
      page,
      recurrenceModalOpened,
      deleteRecurrenceModalOpened,
    } = this.state;

    return (
      <PageContainer>
        <PaperWrapper>
          <div>
            {customerItem.contractStatus === 'READY' &&
              <FloatingActionButton onClick={this.handleToggleRecurrenceModal(true)}>
                <AddIcon/>
              </FloatingActionButton>
            }
          </div>

          <TableOverflowWrapper>
            <Toolbar>
              <TextFieldUi
                id="cpbr-filtre"
                label={<FormattedMessage id="filter"/>}
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
            count={recurrencesCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />

          <ModalRecurrence
            customerItem={customerItem}
            open={recurrenceModalOpened}
            onClose={this.handleToggleRecurrenceModal(false)}
            refreshList={this.fetchAndResetPagination}
          />

          <ModalWarning
            onCancel={this.handleToggleDeleteRecurrenceModal(false)}
            onSubmit={this.handleDeleteRecurrence}
            open={deleteRecurrenceModalOpened}
            title={<FormattedMessage id="warning"/>}
          >
            <FormattedMessage id="warning_delete_recurrence"/>
          </ModalWarning>
        </PaperWrapper>
      </PageContainer>
    );
  }
}

RecurrencesList.defaultProps = {
  recurrencesLoading: true,
};

RecurrencesList.propTypes = {
  customerItem: PropTypes.object.isRequired,
  fetchCustomerItemRecurrences: PropTypes.func.isRequired,
  flushRecurrences: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  recurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  recurrencesCount: PropTypes.number.isRequired,
  recurrencesLoading: PropTypes.bool,
};

export default withRecurrences(RecurrencesList);
