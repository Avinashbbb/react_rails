import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { round, sortBy } from 'lodash';
import moment from 'moment';
import { withCustomerItem, withInterventions, withJob } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import styled from 'styled-components';

import PageContainer from './ui/PageContainer';
import PaperWrapper from './ui/PaperWrapper';
import TableLoading from './ui/TableLoading';
import TableOverflowWrapper from './ui/TableOverflowWrapper';

const tableHead = {
  date: <FormattedMessage id="day" />,
  duration: <FormattedMessage id="duration" />,
  kind: <FormattedMessage id="kind" />,
  locationName: <FormattedMessage id="location" />,
  start_time: <FormattedMessage id="time" />,
};

const DurationInProgress = styled.span`
  color: limegreen;
`;

const LabelInterrupted = styled.span`
  font-style: italic;
`;


class InterventionsList extends PureComponent {
  state = {
    jobModalOpened: false,
  };

  async componentDidMount() {
    await this.fetchInterventions();
    await this.fetchCustomerItem();
  }

  componentWillUnmount() {
    this.props.flushInterventions();
  }

  fetchCustomerItem = async () => {
    const { fetchCustomerItem, job } = this.props;

    await fetchCustomerItem(job.customerItemId);
  };

  fetchInterventions = () => {
    const { fetchJobInterventions, match } = this.props;

    fetchJobInterventions(match.params.jobId);
  };

  formatDate = (startTime) => {
    if (!startTime) {
      return <span className="cpbr-no-data">-</span>;
    }

    return <FormattedDate value={moment(startTime)} year="numeric" month="long" day="numeric" />;
  };

  formatDuration = (duration, status) => {
    if (status === 'NOT_STARTED') {
      return <span className="cpbr-no-data">-</span>;
    }

    const roundedDuration = round(duration);

    if (status === 'IN_PROGRESS') {
      return <DurationInProgress className="cpbr-in-progress">{roundedDuration}</DurationInProgress>;
    }

    return roundedDuration;
  };

  formatKind = (kind) => {
    if (!kind) {
      return '-';
    }

    return <FormattedMessage id={kind.toLowerCase()} />;
  };

  formatLocation = (locationName, kind) => {
    if (kind === 'WORK') {
      return <FormattedMessage id="not_applicable" />;
    }

    if (!locationName) {
      return <FormattedMessage id="not_selected" />;
    }

    return locationName;
  };

  formatStartTime = (startTime) => {
    if (!startTime) {
      return <span className="cpbr-no-data">-</span>;
    }

    return <FormattedTime value={moment(startTime)} hour="numeric" minute="numeric" />;
  };

  refreshHeader = () => {
    this.setState({
      jobModalOpened: false,
    }, this.props.refreshHeader);
  };

  renderInterventionDateOrLabel = (interventionStatus, startTime) => {
    if (this.props.job.status === 'INTERRUPTED' && interventionStatus === 'NOT_STARTED') {
      return <LabelInterrupted><FormattedMessage id="interruption" /></LabelInterrupted>;
    }

    return this.formatDate(startTime);
  };

  renderTableHead = () => (
    <TableHead>
      <TableRow>
        {['date', 'start_time', 'duration', 'kind', 'locationName'].map(name => (
          <TableCell key={name}>
            {tableHead[name]}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  renderTableRows = () => {
    const { interventions, interventionsLoading } = this.props;

    if (interventionsLoading) {
      return <TableLoading />;
    }

    return sortBy(interventions, ['displayOrder']).map((intervention) => {
      const {
        id,
        duration,
        kind,
        locationName,
        startTime,
        status,
      } = intervention;

      return (
        <TableRow key={id}>
          <TableCell>
            {this.renderInterventionDateOrLabel(status, startTime)}
          </TableCell>
          <TableCell>{this.formatStartTime(startTime)}</TableCell>
          <TableCell>{this.formatDuration(duration, status)}</TableCell>
          <TableCell>{this.formatKind(kind)}</TableCell>
          <TableCell>{this.formatLocation(locationName, kind)}</TableCell>
        </TableRow>
      );
    });
  };

  renderTable = () => (
    <PaperWrapper>
      <TableOverflowWrapper>
        <Table>
          {this.renderTableHead()}

          <TableBody>
            {this.renderTableRows()}
          </TableBody>
        </Table>
      </TableOverflowWrapper>
    </PaperWrapper>
  );

  render() {
    return (
      <PageContainer>
        {this.renderTable()}
      </PageContainer>
    );
  }
}

InterventionsList.defaultProps = {
  interventionsLoading: true,
};

InterventionsList.propTypes = {
  customerItem: PropTypes.object.isRequired,
  fetchJobInterventions: PropTypes.func.isRequired,
  flushInterventions: PropTypes.func.isRequired,
  interventions: PropTypes.arrayOf(PropTypes.object).isRequired,
  interventionsLoading: PropTypes.bool,
  job: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  refreshHeader: PropTypes.func.isRequired,
};

export default withInterventions(withJob(withCustomerItem(InterventionsList)));
