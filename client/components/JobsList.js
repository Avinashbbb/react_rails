import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Toolbar } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import { debounce } from 'lodash';
import { withJobs } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import FloatingActionButton from './ui/FloatingActionButton';
import ModalJob from './ModalJob';
import ModalWarning from './ModalWarning';
import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
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
import { jobStatuses } from '../utils/statuses';
import TableCellNoData from './ui/TableCellNoData';

const data = {
  duration: { isSortable: false, label: <FormattedMessage id="jobs.duration" /> },
  endDate: { isSortable: true, label: <FormattedMessage id="jobs.end_date" />, sortColumnName: 'endDate' },
  kind: { isSortable: false, label: <FormattedMessage id="jobs.kind" /> },
  status: { isSortable: false, label: <FormattedMessage id="jobs.status" /> },
  startDate: { isSortable: true, label: <FormattedMessage id="jobs.start_date" />, sortColumnName: 'startDate' },
  unit: { isSortable: false, label: <FormattedMessage id="jobs.unit" /> },
};

const StatusBadge = styled.span` 
  position: relative;
  display: inline;
  margin-bottom: -2px;
  padding: 4px 10px; 
  height: 14px;
  border-radius: 14px;
  
  ${({ status, theme }) => `
    background-color: ${theme.app.taskStatusColor[status]};
    color: ${status === 'TODO' ? 'default' : '#ffffff'};
  `} 
`;

class JobsList extends PureComponent {
  // eslint-disable-next-line react/sort-comp
  initialSort = {
    columnName: 'startDate',
    direction: 'asc',
  };

  // eslint-disable-next-line react/sort-comp
  initialState = {
    ...filteringState,
    deleteJobModalOpened: false,
    jobModalOpened: false,
    jobToDelete: null,
    sort: {
      ...this.initialSort,
    },
  };

  state = {
    ...this.initialState,
  };

  componentDidMount() {
    this.fetchJobs();
  }

  componentWillUnmount() {
    this.props.flushJobs({ limit: -1, sortColumnName: 'name' });
  }

  debouncedFetchJobs = debounce(() => {
    this.fetchJobs();
  }, 300);

  fetchAndResetPagination = () => {
    this.setState({
      ...this.initialState,
    }, this.fetchJobs);
  };

  fetchJobs = () => {
    const {
      filter, limit, page, sort,
    } = this.state;
    const { columnName, direction } = sort;

    this.props.fetchCustomerItemJobs(this.props.match.params.customerItemId, {
      filter: filter.trim(),
      page: page + 1,
      limit,
      sortColumnName: columnName,
      sortDirection: direction,
    });
  };

  handleDeleteJob = async () => {
    const { deleteJob } = this.props;

    await deleteJob(this.state.jobToDelete);

    const { deleteJobModalOpened, jobToDelete } = this.initialState;

    this.setState({
      deleteJobModalOpened,
      jobToDelete,
    }, this.fetchJobs);
  };

  handleToggleJobModal = jobModalOpened => () => {
    this.setState({
      jobModalOpened,
    });
  };

  handleFilter = handleFilter(this.debouncedFetchJobs).bind(this);
  handlePageChange = handlePageChange(this.fetchJobs).bind(this);
  handleRowsPerPageChange = handleRowsPerPageChange(this.fetchJobs).bind(this);
  handleSort = handleSort.bind(this);

  handleRowClick = path => () => {
    this.props.history.push(path);
  };

  handleSortClick = name => () => {
    this.handleSort(name, this.fetchJobs)();
  };

  handleToggleDeleteJobModal = (opened, jobId) => () => {
    const jobToDelete = opened ? jobId : this.initialState.jobToDelete;

    this.setState({ deleteJobModalOpened: opened, jobToDelete });
  };

  renderDeleteIcon = (id, unitId) => (
    unitId ? null : (
      <IconButton id="cpbr-delete-job" onClick={this.handleToggleDeleteJobModal(true, id)}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    )
  );

  renderTableHead = () => {
    const { columnName, direction } = this.state.sort;

    return (
      <TableHead>
        <TableRow>
          {['startDate', 'endDate', 'kind', 'status', 'unit', 'duration'].map(name => (
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

          <TableCell />
        </TableRow>
      </TableHead>
    );
  };

  renderTableRows = () => {
    const { jobs, jobsLoading } = this.props;

    if (jobsLoading) {
      return <TableLoading />;
    }

    if (!jobs.length) {
      return <TableCellNoData />;
    }

    return sortedData(jobs, this.state).map((job) => {
      const {
        id,
        duration,
        endDate,
        kind,
        startDate,
        status,
        unitId,
        unitName,
      } = job;

      return (
        <TableRow key={id} className="link-row" onClick={this.handleRowClick(`/jobs/${id}`)}>
          <TableCell>{startDate}</TableCell>
          <TableCell>{endDate}</TableCell>
          <TableCell>{kind}</TableCell>
          <TableCell>
            <StatusBadge status={status}>{jobStatuses[status]}</StatusBadge>
          </TableCell>
          <TableCell>{unitName}</TableCell>
          <TableCell>{duration}</TableCell>
          <TableCell classes={{ root: 'action-cell' }}>{this.renderDeleteIcon(id, unitId)}</TableCell>
        </TableRow>
      );
    });
  };

  render() {
    const {
      deleteJobModalOpened,
      filter,
      jobModalOpened,
      limit,
      page,
    } = this.state;

    const { customerItem, jobsCount } = this.props;

    return (
      <PageContainer>
        <PaperWrapper>
          <div>
            {customerItem.contractStatus === 'READY' &&
              <FloatingActionButton
                onClick={this.handleToggleJobModal(true)}
              >
                <AddIcon/>
              </FloatingActionButton>
            }
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
            count={jobsCount}
            id="cpbr-pagination"
            labelRowsPerPage=""
            onChangePage={this.handlePageChange}
            onChangeRowsPerPage={this.handleRowsPerPageChange}
            page={page}
            rowsPerPage={limit}
          />
        </PaperWrapper>

        <ModalJob
          customerItem={customerItem}
          onClose={this.handleToggleJobModal(false)}
          open={jobModalOpened}
          refreshList={this.fetchAndResetPagination}
        />

        <ModalWarning
          onCancel={this.handleToggleDeleteJobModal(false)}
          onSubmit={this.handleDeleteJob}
          open={deleteJobModalOpened}
          title={<FormattedMessage id="warning" />}
        >
          <FormattedMessage id="warning_delete_contract_item" />
        </ModalWarning>
      </PageContainer>
    );
  }
}

JobsList.defaultProps = {
  jobsLoading: true,
};

JobsList.propTypes = {
  customerItem: PropTypes.object.isRequired,
  deleteJob: PropTypes.func.isRequired,
  fetchCustomerItemJobs: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  flushJobs: PropTypes.func.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  jobsCount: PropTypes.number.isRequired,
  jobsLoading: PropTypes.bool,
  match: PropTypes.object.isRequired,
};

export default withJobs(JobsList);
