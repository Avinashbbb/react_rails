import { Typography } from '@material-ui/core';
import IconSearch from '@material-ui/icons/Search';
import { debounce, filter, orderBy } from 'lodash';
import { withJobs, withFranchises, withUnits } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';

import { FormattedMessage, injectIntl } from 'react-intl';
import styled from 'styled-components';

import CtaButton from './ui/CtaButton';
import ModalQuickJob from './ModalQuickJob';
import InputAdornment from './form/InputAdornment';
import TextField from './form/TextField';
import JobCard from './JobCard';
import { handleFilter } from '../utils/filtering';
import theme from '../styles/theme';
import Autocomplete from './ui/Autocomplete';

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

const FranchiseFilterWrapper = styled.div`
  margin-top: 10px;
  padding: 10px ${columnPadding} 10px ${columnPadding};
`;

const FilterWrapper = styled.div`
  margin-top: 14px;
  margin-bottom: -7px;
  padding: 10px ${columnPadding} 10px ${columnPadding};
  background: ${({ theme }) => theme.app.dashboardColumnBgColor};
`;

const ColumnContent = styled.div`
  flex: 1;
  padding: ${columnPadding} 15px ${columnPadding} ${columnPadding} ;
  overflow: auto;
  background: ${({ theme }) => theme.app.dashboardColumnBgColor};
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

const DragAndDropCalendar = withDragAndDrop(Calendar);
const localizer = momentLocalizer(moment);

const StyledDragAndDropCalendar = styled(DragAndDropCalendar)`
  margin: 10px;
`;

class CalendarDashboard extends Component {
  state = {
    addJobModalOpened: false,
    currentRange: 'month',
    draggedJobId: -1,
    endDateforRange: moment().endOf('month').format('YYYY-MM-DD'),
    startDateForRange: moment().startOf('month').format('YYYY-MM-DD'),
    filter: '',
    franchise: '',
    loading: true,
  };

  async componentDidMount() {
    await this.fetchFranchises();
    this.fetchFranchiseData();
  }

  componentWillUnmount() {
    this.props.flushJobs();
  }

  get unScheduledJobs() {
    return filter(this.props.jobs, ({ startDate }) => (
      !startDate
    ));
  }

  get calendarEvents() {
    return this.props.jobs.map((job) => {
      const {
        address, customerName, endDate, startDate, id,
      } = job;

      let calendarEndDate = endDate;
      const calendarStartDate = moment(startDate).toDate();

      if (!calendarEndDate) {
        calendarEndDate = moment(startDate).add(24, 'hours').startOf('day').toDate();
      }

      return {
        end: calendarEndDate,
        id,
        resource: job,
        start: calendarStartDate,
        title: `${customerName} - ${address}`,
        allDay: true,
      };
    });
  }

  debouncedFetchJobs = debounce(() => {
    this.fetchJobs();
  }, 300);

  dragFromOutsideItem = () => this.state.draggedJob;

  eventStyleGetter = event => ({
    style: {
      backgroundColor: theme.app.taskStatusColorCalendar[event.resource.status],
      borderRadius: '10px',
      opacity: 0.8,
      color: 'black',
      border: '1px',
      display: 'block',
    },
  });

  fetchFranchises = async () => {
    const { fetchFranchises } = this.props;

    this.setState({ loading: true });
    await fetchFranchises({ limit: 100 });
    this.setState({
      franchise: this.props.franchises[0].id,
      franchiseName: { value: this.props.franchises[0].id, label: this.props.franchises[0].name },
      loading: false,
    });
  };

  fetchFranchiseData = () => {
    this.fetchJobs();
    this.fetchUnits();
  };

  fetchJobs = () => {
    const {
      endDateforRange, filter: jobFilter, franchise, startDateForRange,
    } = this.state;
    const { fetchJobsByStartDate } = this.props;

    let params = {
      startDateMin: startDateForRange,
      filter: jobFilter,
    };

    if (startDateForRange !== endDateforRange) {
      params = { ...params, ...{ startDateMax: endDateforRange } };
    }

    if (franchise) {
      params = { ...params, ...{ franchise } };
    }

    fetchJobsByStartDate(params);
  };

  fetchUnits = () => {
    const { fetchUnits } = this.props;
    const { franchise } = this.state;

    if (franchise) {
      fetchUnits(franchise, {});
    }
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

  handleFilter = handleFilter(this.debouncedFetchJobs).bind(this);

  handleDragStart = jobId => () => {
    this.setState({ draggedJobId: jobId });
  };

  handleDropFromOutside = async ({ allDay, end, start }) => {
    const { draggedJobId } = this.state;

    await this.updateAndReloadJobs({
      allDay, end, id: draggedJobId, start,
    });
  };

  handleDragOver = (event) => {
    // check for undroppable is specific to this example
    // and not part of API. This just demonstrates that
    // onDragOver can optionally be passed to conditionally
    // allow draggable items to be dropped on cal, based on
    // whether event.preventDefault is called
    event.preventDefault();
  };

  handleRangeChange = (dateRange, view) => {
    const { currentRange } = this.state;

    let newState = {
      currentRange: view || currentRange,
    };

    switch (newState.currentRange) {
      case 'day':
        newState = {
          startDateForRange: moment(dateRange[0]).format('YYYY-MM-DD'),
          ...newState,
        };
        break;
      case 'week':
        newState = {
          endDateforRange: moment(dateRange[dateRange.length - 1]).format('YYYY-MM-DD'),
          startDateForRange: moment(dateRange[0]).format('YYYY-MM-DD'),
          ...newState,
        };
        break;
      default:
        newState = {
          endDateforRange: moment(dateRange.end).format('YYYY-MM-DD'),
          startDateForRange: moment(dateRange.start).format('YYYY-MM-DD'),
          ...newState,
        };
        break;
    }

    this.setState(newState, this.fetchJobs);
  };

  handleSelectFilterChange = name => ({ target }) => {
    this.setState({
      [name]: target.value,
    }, this.fetchFranchiseData);
  };

  handleToggleAddJobModal = addJobModalOpened => () => {
    this.setState({ addJobModalOpened });
  };

  moveEvent = async ({
    event, start, end, isAllDay: droppedOnAllDaySlot,
  }) => {
    if (!event.resource.endDate) {
      let { allDay } = event;

      if (!event.allDay && droppedOnAllDaySlot) {
        allDay = true;
      } else if (event.allDay && !droppedOnAllDaySlot) {
        allDay = false;
      }

      await this.updateAndReloadJobs({
        allDay, end, id: event.id, start,
      });
    }
  };

  resizeEvent = async ({ event, start, end }) => {
    if (!event.resource.endDate) {
      await this.updateAndReloadJobs({
        allDay: event.allDay, end, id: event.id, start,
      });
    }
  };

  updateAndReloadJobs = async ({ id, start }) => {
    const jobParams = {
      assignment_date: moment(start).toDate(),
      start_date: moment(start).toDate(),
    };

    await this.props.editJob(jobParams, id);

    this.fetchJobs();
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

  renderMessages = () => {
    const { intl } = this.props;
    const { formatMessage } = intl;
    const keys = ['today', 'previous', 'next', 'year', 'month', 'week', 'day'];

    const calendarMessage = {};
    // eslint-disable-next-line no-return-assign
    keys.forEach(key => calendarMessage[key] = formatMessage({ id: `calendar.${key}` }));
    return calendarMessage;
  };

  renderUnassignedJobs = () => (
    this.unScheduledJobs.map((job, index) => this.renderJobCard(job, index))
  );

  renderJobCard = ({ id, ...job }, index) => (
    // eslint-disable-next-line max-len
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div
      key={id}
      id={`cpbr-draggable-job-${id}`}
      className="cpbr-jobs"
      ref={`job-${index}`}
      draggable="true"
      onClick={this.handleCardClick(`/customers/${job.customerId}/contracts/${job.contractId}/preparations/${job.customerItemId}/jobs/${id}`)}
      onDragStart={this.handleDragStart(id)}
    >
      <JobCard job={job} />
    </div>
  );

  render() {
    const { addJobModalOpened, franchise, loading } = this.state;

    if (loading) {
      return null;
    }

    return (
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
              <FormattedMessage id="tasks" /> ({this.unScheduledJobs.length})
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

          <ColumnContent innerRef="ColumnContent">
            {this.renderUnassignedJobs()}
          </ColumnContent>
        </ColumnLeft>

        <ColumnRight>
          <StyledDragAndDropCalendar
            defaultDate={moment().toDate()}
            defaultView={Views.MONTH}
            dragFromOutsideItem={this.dragFromOutsideItem}
            events={this.calendarEvents}
            eventPropGetter={this.eventStyleGetter}
            localizer={localizer}
            messages={this.renderMessages()}
            onDragOver={this.handleDragOver}
            onDropFromOutside={this.handleDropFromOutside}
            onDoubleClickEvent={({ id, resource }) => {
              this.handleCardClick(`/customers/${resource.customerId}/contracts/${resource.contractId}/preparations/${resource.customerItemId}/jobs/${id}`)();
            }}
            onEventDrop={this.moveEvent}
            onEventResize={this.resizeEvent}
            onRangeChange={this.handleRangeChange}
            onSelectSlot={this.handleToggleAddJobModal(true)}
            resizable
            selectable
          />
        </ColumnRight>

        <CtaButton onClick={this.handleToggleAddJobModal(true)} />

        <ModalQuickJob
          customerItemsLoading={false}
          customersLoading={false}
          open={addJobModalOpened}
          onClose={this.handleToggleAddJobModal(false)}
          refreshList={this.fetchJobs}
          franchise={franchise}
        />
      </Wrapper>
    );
  }
}

CalendarDashboard.propTypes = {
  editJob: PropTypes.func.isRequired,
  fetchUnits: PropTypes.func.isRequired,
  franchises: PropTypes.arrayOf(PropTypes.object).isRequired,
  fetchFranchises: PropTypes.func.isRequired,
  fetchJobsByStartDate: PropTypes.func.isRequired,
  franchisesLoading: PropTypes.bool.isRequired,
  flushJobs: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withFranchises(withJobs(withUnits(injectIntl(CalendarDashboard))));
