import MultiSelect from '@khanacademy/react-multi-select';
import { Badge, Icon, IconButton, Typography } from '@material-ui/core';
import IconSearch from '@material-ui/icons/Search';
import { debounce, filter, orderBy, parseInt, reject, size } from 'lodash';
import { withFranchises, withJobs, withUnits } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import ModalQuickJob from './ModalQuickJob';
import ModalWarning from './ModalWarning';
import InputAdornment from './form/InputAdornment';
import TextField from './form/TextField';
import ActionBar from './interventionsBoard/ActionBar';
import JobCard from './JobCard';
import Tooltip from './ui/Tooltip';
import { formattedDate } from '../utils/dates';
import { handleFilter } from '../utils/filtering';
import { reorderList } from '../utils/orderedList';
import Autocomplete from './ui/Autocomplete';
import withUser from '../containers/withUser';

const columnWidth = '380px';
const columnPadding = '10px';

const Wrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const ColumnLeft = styled.div`
  display: flex;
  flex-direction: column;
  width: 375px;
  margin-left: 5px;
  margin-right: 5px;
`;

const ColumnRight = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ColumnLeftHeader = styled.div`
`;

const FilterWrapper = styled.div`
  margin-top: 14px;
  margin-bottom: -7px;
  padding: 10px ${columnPadding} 10px ${columnPadding};
  background: ${({ theme }) => theme.app.dashboardColumnBgColor};
`;

const ColumnRightHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px ${columnPadding} 0 5px;
`;

const ColumnContent = styled.div`
  flex: 1;
  padding: ${columnPadding} 15px ${columnPadding} ${columnPadding} ;
  overflow: auto;
  background: ${({ theme }) => theme.app.dashboardColumnBgColor};
`;

const FranchiseFilterWrapper = styled.div`
  margin-top: 10px;
  padding: 10px ${columnPadding} 10px ${columnPadding};
`;

const SelectUnit = styled.div`
  .dropdown{
    display: inline-block !important;
  }
  .dropdown-heading{
    width: auto !important;
    border: none !important;
    background: none !important;
  }
  .dropdown-heading-value{
    position: relative !important;
    padding-left: 0 !important;
  }
  .dropdown-content{
    width: 250px !important; 
    font-size: 16px !important; 
  }
`;

const UnitColumnHeaderButton = styled(IconButton)`
  && {
    position: absolute;
    right: 0;
    top: 0; 
  }
`;

const UnitColumns = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
`;

const UnitColumn = styled.div` 
  display: flex;
  flex-direction: column;
  min-width: ${columnWidth};
  margin: 0 5px;
`;

const UnitColumnHeader = styled.div`
  position: relative;
  padding: 15px 10px 10px 15px;
  background: ${({ theme }) => theme.app.dashboardColumnBgColor};
  border-radius: 3px 3px 0 0;
`;

const UnitColumnContent = styled.div`
  flex:1;
  overflow-y: auto;
`;

const InterventionCards = styled.div`
  margin-bottom: 25px;
  padding: 10px 15px 10px 15px;
  background: ${({ theme }) => theme.app.dashboardColumnBgColor};
  border-radius: 0 0 3px 3px;
  min-height: 200px;
`;

const H1Style = {
  flex: 1,
  fontSize: '1rem',
  marginTop: '21px',
  padding: `0 ${columnPadding} 0 0`,
};

const H1LeftColumnStyle = {
  ...H1Style,
  padding: `10px ${columnPadding} 0 ${columnPadding}`,
};

class AssignmentDashboard extends Component {
  // eslint-disable-next-line react/sort-comp
  initialState = {
    addJobModalOpened: false,
    currentDate: formattedDate(),
    deleteJobModalOpened: false,
    filter: '',
    franchise: '',
    jobToDelete: null,
    selectedUnits: [],
  };

  state = {
    ...this.initialState,
  };

  async componentDidMount() {
    await this.fetchFranchises();
    this.fetchFranchiseData();
  }

  componentWillUnmount() {
    this.props.flushJobs();
    this.props.flushUnits();
  }

  get unassignedJobs() {
    return filter(this.props.jobs, ({ unitId }) => (
      !unitId || unitId === -1
    ));
  }

  get unitsList() {
    return this.props.units.map(({ id, name }) => ({
      label: name,
      value: id,
    }));
  }

  debouncedFetchJobs = debounce(() => {
    this.fetchJobs();
  }, 300);

  handleDeleteJob = async () => {
    const { deleteJob } = this.props;

    await deleteJob(this.state.jobToDelete);

    const { deleteJobModalOpened, jobToDelete } = this.initialState;

    this.setState({
      deleteJobModalOpened,
      jobToDelete,
    }, this.fetchJobs);
  };

  fetchFranchises = async () => {
    const { fetchCurrentUser, fetchFranchises } = this.props;

    await fetchFranchises({ limit: 1000 });

    const user = await fetchCurrentUser();
    const franchiseId = user.opportunist_id ? user.opportunist_id : this.props.franchises[0].id;

    const franchiseName = {
      value: franchiseId,
      label: this.props.franchises.find(franchise => franchise.id === franchiseId).name,
    };

    this.setState({
      franchise: franchiseId,
      franchiseName,
    });
  };

  fetchFranchiseData = () => {
    this.fetchJobs();
    this.fetchUnits();
  };

  fetchJobs = () => {
    // eslint-disable-next-line no-shadow
    const { currentDate, filter, franchise } = this.state;

    this.props.fetchJobsUnfinished({ startDateMin: currentDate, filter, franchise });
  };

  fetchUnits = async () => {
    const { franchise } = this.state;
    const { fetchUnits } = this.props;

    await fetchUnits(franchise, {});

    this.setState({ selectedUnits: this.unitsList.map(unit => unit.value) });
  };

  handleChangeDate = (currentDate) => {
    this.setState(
      { currentDate: formattedDate(currentDate) },
      this.fetchJobs,
    );
  };

  handleFilter = handleFilter(this.debouncedFetchJobs).bind(this);

  handleDragEnd = async ({
    destination, draggableId, reason, source,
  }) => {
    if (destination && reason === 'DROP') {
      const { droppableId: destinationId, index: destinationIndex } = destination;
      const { droppableId: sourceId, index: sourceIndex } = source;

      // the item was not moved === nothing to do
      if (destinationId === sourceId && destinationIndex === sourceIndex) {
        return;
      }

      // jobs in the source list
      const sourceJobs = filter(this.props.jobs, ({ id, unitId }) => (
        id !== draggableId &&
        unitId === parseInt(sourceId)
      ));

      // jobs in the destination list
      const destinationJobs = filter(this.props.jobs, ({ id, unitId }) => (
        id !== draggableId &&
        unitId === parseInt(destinationId)
      ));

      // jobs to be reassigned
      const reassignedJobs = reorderList(
        draggableId,
        this.state.currentDate,
        destinationId === '-1' ? null : destinationId,
        destinationIndex,
        destinationJobs,
        sourceId,
        sourceIndex,
        sourceJobs,
      );

      const { assignJobs, reassignJobs } = this.props;

      reassignJobs(reassignedJobs);
      await assignJobs(reassignedJobs);

      this.fetchJobs();
    }
  };

  handleToggleDeleteJobModal = (opened, jobId) => () => {
    const jobToDelete = opened ? jobId : this.initialState.jobToDelete;

    this.setState({ deleteJobModalOpened: opened, jobToDelete });
  };

  handlePublishJob = (unitId, unpublishedCount) => async () => {
    if (!unpublishedCount) {
      return;
    }

    await this.props.publishJobs(this.state.currentDate, unitId);
    this.fetchJobs();
  };

  handleToggleAddJobModal = addJobModalOpened => () => {
    this.setState({ addJobModalOpened });
  };

  handleUnitSelection = (selectedUnits) => {
    this.setState({ selectedUnits });
  };

  unpublishedCount = (predicate) => {
    const jobs = reject(this.props.jobs, ['unitId', null]);

    return size(filter(jobs, predicate));
  };

  handleCardClick = path => () => {
    this.props.history.push(path);
  };

  handleChangeFranchise = (target) => {
    this.setState({
      franchise: target.value,
      franchiseName: {
        id: target.value,
        label: target.label,
      },
    }, this.fetchFranchiseData);
  };

  handleSelectFilterChange = name => ({ target }) => {
    this.setState({
      [name]: target.value,
    }, this.fetchFranchiseData);
  };

  renderFranchise = () => {
    const { franchises, franchisesLoading } = this.props;
    const { franchiseName } = this.state;

    if (franchisesLoading || !franchises) {
      return null;
    }
    return (
      <Autocomplete
        id="cpbr-franchises"
        options={this.renderFranchisesList(franchises)}
        onChange={this.handleChangeFranchise}
        placeholder="Saisir le nom de la franchise"
        value={franchiseName}
      />
    );
  };

  renderFranchisesList = (data) => {
    const franchisesList = data.map(({ id, name }) => ({ value: id, label: name }));

    return orderBy(franchisesList, ['label'], ['asc']);
  };

  renderJobCard = ({ id, ...job }, index) => (
    <Draggable
      key={id}
      draggableId={id}
      index={index}
      isDragDisabled={job.status !== 'TODO'}
    >
      {provided => (
        <div
          key={id}
          id={`cpbr-draggable-job-${id}`}
          className="cpbr-jobs"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={provided.draggableProps.style}
        >
          <JobCard
            job={job}
            deleteIcon
            onClick={this.handleCardClick(`/customers/${job.customerId}/contracts/${job.contractId}/preparations/${job.customerItemId}/jobs/${id}`)}
            onDelete={this.handleToggleDeleteJobModal(true, id)}
          />
        </div>
      )}
    </Draggable>
  );

  renderUnassignedJobs = () => (
    this.unassignedJobs.map((job, index) => this.renderJobCard(job, index))
  );

  renderUnit = (unitId) => {
    const orderedList = orderBy(filter(this.props.jobs, {
      unitId: parseInt(unitId),
    }), ['assignmentDisplayOrder'], ['asc']);

    return (
      orderedList.map((job, index) => this.renderJobCard(job, index))
    );
  };

  renderUnits = () => (
    this.props.units.map(({ id, name }) => {
      const { selectedUnits } = this.state;

      if (!selectedUnits.includes(id)) {
        return null;
      }

      const unpublishedCount = this.unpublishedCount({
        assignmentPublished: false,
        unitId: parseInt(id),
      });

      return (
        <UnitColumn key={id}>
          <UnitColumnHeader id={`cpbr-unit${id}`}>
            {name}
            <Tooltip title={<FormattedMessage id="dispatch" />} placement="bottom">
              <UnitColumnHeaderButton onClick={this.handlePublishJob(id, unpublishedCount)}>
                {this.renderUnpublished(unpublishedCount, id)}
              </UnitColumnHeaderButton>
            </Tooltip>
          </UnitColumnHeader>

          <Droppable droppableId={id}>
            {provided => (
              <UnitColumnContent innerRef={provided.innerRef} id={`cpbr-droppable-unit-${id}`}>
                <InterventionCards>
                  {this.renderUnit(id)}
                  {provided.placeholder}
                </InterventionCards>
              </UnitColumnContent>
            )}
          </Droppable>
        </UnitColumn>
      );
    })
  );

  renderUnitsSelectValues = (selectedUnits) => {
    const nbOfUnits = this.unitsList.length;
    const selectedNumber = selectedUnits.length;
    const unitsCounter = `(${selectedNumber}/${nbOfUnits})`;

    if (!nbOfUnits) {
      return <FormattedMessage id="unit_select.none_available" />;
    }

    if (!selectedNumber) {
      return <span><FormattedMessage id="unit_select.none_selected" /> {unitsCounter}</span>;
    }

    if (selectedNumber === nbOfUnits) {
      return <span><FormattedMessage id="unit_select.all_selected" /> ({selectedNumber})</span>;
    }

    if (selectedNumber === 1) {
      return <span><FormattedMessage id="unit_select.one_selected" /> {unitsCounter}</span>;
    }

    return <span><FormattedMessage id="unit_select.many_selected" /> {unitsCounter}</span>;
  };

  renderUnpublished = (unpublishedCount, unitId) => {
    const icon = <Icon>tap_and_play</Icon>;

    if (!unpublishedCount) {
      return icon;
    }

    return (
      <Badge id={`cpbr-unpublished-unit-${unitId}`} badgeContent={unpublishedCount} color="secondary">
        {icon}
      </Badge>
    );
  };

  render() {
    const {
      addJobModalOpened, currentDate, deleteJobModalOpened, franchise, selectedUnits,
    } = this.state;

    const unpublishedCount = this.unpublishedCount({
      assignmentPublished: false,
    });

    return (
      <DragDropContext onDragEnd={this.handleDragEnd}>
        <Wrapper>
          <ColumnLeft>
            <ColumnLeftHeader>

              <Typography
                gutterBottom
                variant="h6"
                style={H1LeftColumnStyle}
              >
                <FormattedMessage id="common.title.franchise" />
              </Typography>

              <FranchiseFilterWrapper>
                {this.renderFranchise()}
              </FranchiseFilterWrapper>

              <Typography
                gutterBottom
                variant="h6"
                style={H1LeftColumnStyle}
              >
                <FormattedMessage id="tasks" /> ({this.unassignedJobs.length})
              </Typography>

              <FilterWrapper>
                <TextField
                  id="search"
                  adornment="start"
                  fullWidth
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><IconSearch /></InputAdornment>,
                  }}
                  margin="normal"
                  onChange={this.handleFilter}
                  placeholder="Filtre"
                  type="search"
                />
              </FilterWrapper>
            </ColumnLeftHeader>

            <Droppable droppableId="-1">
              {provided => (
                <ColumnContent innerRef={provided.innerRef}>
                  {this.renderUnassignedJobs()}
                </ColumnContent>
              )}
            </Droppable>
          </ColumnLeft>

          <ColumnRight>
            <ColumnRightHeader>
              <Typography variant="h6" style={H1Style}>
                <SelectUnit>
                  <MultiSelect
                    onSelectedChanged={this.handleUnitSelection}
                    options={this.unitsList}
                    selectAllLabel={<FormattedMessage id="select_all" />}
                    selected={selectedUnits}
                    valueRenderer={this.renderUnitsSelectValues}
                    disableSearch
                  />
                </SelectUnit>
              </Typography>

              <ActionBar
                changeCurrentDate={this.handleChangeDate}
                currentDate={currentDate}
                openAddJobModal={this.handleToggleAddJobModal(true)}
                publishJobs={this.handlePublishJob}
                refreshJobs={this.fetchJobs}
                unpublishedCount={unpublishedCount}
              />
            </ColumnRightHeader>

            <UnitColumns>{this.renderUnits()}</UnitColumns>
          </ColumnRight>

          <ModalQuickJob
            customerItemsLoading={false}
            customersLoading={false}
            open={addJobModalOpened}
            onClose={this.handleToggleAddJobModal(false)}
            refreshList={this.fetchJobs}
            franchise={franchise}
          />

          <ModalWarning
            onCancel={this.handleToggleDeleteJobModal(false)}
            onSubmit={this.handleDeleteJob}
            open={deleteJobModalOpened}
            title={<FormattedMessage id="warning" />}
          >
            <FormattedMessage id="warning_delete_job" />
          </ModalWarning>
        </Wrapper>
      </DragDropContext>
    );
  }
}

AssignmentDashboard.propTypes = {
  assignJobs: PropTypes.func.isRequired,
  deleteJob: PropTypes.func.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
  fetchFranchises: PropTypes.func.isRequired,
  fetchJobsUnfinished: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
  flushJobs: PropTypes.func.isRequired,
  flushUnits: PropTypes.func.isRequired,
  franchises: PropTypes.arrayOf(PropTypes.object).isRequired,
  franchisesLoading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  publishJobs: PropTypes.func.isRequired,
  reassignJobs: PropTypes.func.isRequired,
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withUser(withFranchises(withJobs(withUnits(AssignmentDashboard))));
