import { Badge as BadgeMui, Tab, Tooltip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PaymentIcon from '@material-ui/icons/Payment';
import moment from 'moment';
import { withCustomerItem, withJob } from 'optigo-redux';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { withRouter, Link } from 'react-router-dom';
import styled from 'styled-components';

import Breadcrumbs from './Breadcrumbs';
import CommentsList from './CommentsList';
import FlexHeaderRowWrapper from './ui/FlexHeaderRowWrapper';
import FloatingActionButton from './ui/FloatingActionButton';
import HeaderLabel from './ui/HeaderLabel';
import HeaderColumnWrapper from './ui/HeaderColumnWrapper';
import HeaderContextWrapper from './ui/HeaderContextWrapper';
import Interruption from './Interruption';
import InterventionsList from './InterventionsList';
import ModalEditJob from './ModalEditJob';
import PageHeader from './ui/PageHeader';
import TabsWrapper from './ui/TabsWrapper';
import { jobStatuses } from '../utils/statuses';

const Badge = styled(BadgeMui)`
  & .badge {
    right: -21px;
    transform: scale(0.8);
  }
`;

const BundleNote = styled.div`
  max-width: 400px;
  margin-top: 5px;
  font-style: italic;
`;

const StatusBadge = styled.span` 
  position: absolute;
  top: 8px;
  left: -25px;
  ${({ status, theme }) => `
    background-color: ${theme.app.taskStatusColor[status]};
  `} 
  height: 14px;
  width: 14px;
  padding: 0;
  border-radius: 14px;
`;

class Job extends PureComponent {
  state = {
    currentTab: 0,
    jobModalOpened: false,
  };

  componentDidMount() {
    this.fetchJob();
  }

  billJobAndFetchJob = async () => {
    const { billJob, job } = this.props;

    await billJob(job.id);
    this.fetchJob();
  }

  fetchJob = () => {
    const { fetchJob, match } = this.props;

    fetchJob(match.params.jobId);
  };

  handleChangeTab = (_, currentTab) => {
    this.setState({
      currentTab,
    });
  };

  handleToggleJobModal = jobModalOpened => () => {
    this.setState({
      jobModalOpened,
    });
  };

  refreshHeader = () => {
    this.setState({
      jobModalOpened: false,
    }, this.fetchJob);
  };

  renderBillButton = () => {
    const { job } = this.props;
    const tooltipLabel = <FormattedMessage id="warning_job_billing_error" />;

    if (job.status !== 'BILLING_ERROR') {
      return null;
    }

    return (
      <FloatingActionButton
        position="relative"
        tooltipLabel={tooltipLabel}
        onClick={this.billJobAndFetchJob}
      >
        <PaymentIcon />
      </FloatingActionButton>
    );
  }

  renderActionButton = () => {
    const { job } = this.props;
    const jobCompleted = job.status === 'COMPLETED' || job.status === 'BILLING_ERROR';
    const tooltipLabel = jobCompleted ? <FormattedMessage id="warning_job_not_editable" /> :
    <FormattedMessage id="edit" />;

    return (
      <FloatingActionButton
        position="relative"
        disabled={jobCompleted}
        tooltipLabel={tooltipLabel}
        onClick={this.handleToggleJobModal(true)}
      >
        <EditIcon />
      </FloatingActionButton>
    );
  };

  renderAssignment = () => {
    const { assignmentDate, unitName } = this.props.job;

    const assignment = (unitName ? <Fragment><FormattedMessage id="jobs.unit" /> {unitName}</Fragment> : <FormattedMessage id="jobs.unassigned" />);
    const date = (assignmentDate ? <Fragment>Le <FormattedDate value={moment(assignmentDate)} year="numeric" month="long" day="numeric" /></Fragment> : '-');

    return (
      <Fragment>
        <HeaderLabel>
          {assignment}
          <br />
        </HeaderLabel>

        {date}
        <br />
      </Fragment>
    );
  };

  renderCommentsTabLabel = () => {
    const { job } = this.props;
    const { commentsCount } = job;

    const label = <FormattedMessage id="comments" />;

    if (!job || !commentsCount) {
      return label;
    }

    return (
      <Badge id="cpbr-badge-comments-count" color="primary" badgeContent={this.props.job.commentsCount} classes={{ badge: 'badge' }}>
        {label}
      </Badge>
    );
  };

  renderHeader = () => {
    const { job, jobLoading } = this.props;

    if (jobLoading || !job) {
      return null;
    }

    const {
      addressSimple,
      bundleNote,
      contractNo,
      contractName,
      customerName,
      duration,
      kind,
      locationName,
      name,
      startDate,
      status,
    } = job;

    const note = bundleNote ? <BundleNote>{bundleNote}</BundleNote> : '';

    return (
      <PageHeader
        getBadge={this.renderStatusJob}
        titleText={<FormattedMessage id="jobs_scheduled_on" values={{ date: <FormattedDate value={moment(startDate)} year="numeric" month="long" day="numeric" />, kind }} />}
        subtitleText={name}
      >
        <FlexHeaderRowWrapper>
          <HeaderColumnWrapper>
            {this.renderAssignment()}
            <FormattedMessage id="jobs.duration_long" values={{ duration }} />
          </HeaderColumnWrapper>
          <HeaderColumnWrapper>
            <HeaderLabel>
              <FormattedMessage id="contract.name" /> : {contractName || contractNo}
            </HeaderLabel>
            {customerName}<br />
            <FormattedMessage id="works_start" /> {startDate}
            {note}
          </HeaderColumnWrapper>
          <HeaderColumnWrapper>
            <HeaderLabel>{locationName}</HeaderLabel>
            {addressSimple}<br />
          </HeaderColumnWrapper>
          <HeaderColumnWrapper>
            <HeaderLabel>
              <FormattedMessage id="jobs.status" />
            </HeaderLabel>
            {status}
          </HeaderColumnWrapper>
          <HeaderColumnWrapper>
            {this.renderBillButton()}
          </HeaderColumnWrapper>
          <HeaderColumnWrapper>
            {this.renderActionButton()}
          </HeaderColumnWrapper>
        </FlexHeaderRowWrapper>
      </PageHeader>
    );
  };

  renderInterruptionTab = () => {
    const { job } = this.props;

    if (!job || !job.hasInterruption) {
      return null;
    }

    return <Tab label={<FormattedMessage id="interruption" />} />;
  };

  renderModalJob = () => {
    const { customerItem, job } = this.props;

    if (!customerItem.id) {
      return null;
    }

    return (
      <ModalEditJob
        customerItem={customerItem}
        job={job}
        onClose={this.handleToggleJobModal(false)}
        open={this.state.jobModalOpened}
        refreshList={this.refreshHeader}
      />
    );
  };

  renderStatusJob = () => {
    const { job } = this.props;
    const { status } = job;
    const tooltipLabel = jobStatuses[status];

    return (
      <Tooltip title={tooltipLabel}>
        <StatusBadge status={status} />
      </Tooltip>
    );
  };

  renderTabContainer = () => {
    let Content = null;

    const job = this.props.job || {};

    if (!job.id) {
      return null;
    }

    switch (this.state.currentTab) {
      case 1: {
        Content = CommentsList;
        break;
      }
      case 2: {
        Content = Interruption;
        break;
      }
      default: {
        Content = InterventionsList;
        break;
      }
    }

    return <Content {...this.props} refreshHeader={this.fetchJob} />;
  };

  render() {
    const { job, jobLoading, match } = this.props;
    const { params } = match;
    const { contractId, customerId, customerItemId } = params;

    if (jobLoading || !job) {
      return null;
    }

    return (
      <div>
        <Breadcrumbs>
          <li><Link to="/customers"><FormattedMessage id="customers" /></Link></li>
          <li><Link to={`/customers/${customerId}`}><FormattedMessage id="contract_and_contact" /></Link></li>
          <li><Link to={`/customers/${customerId}/contracts/${contractId}`}><FormattedMessage id="contract.name" /></Link></li>
          <li><Link to={`/customers/${customerId}/contracts/${contractId}/preparations/${customerItemId}`}><FormattedMessage id="customer_item" /></Link></li>
          <li><FormattedMessage id="interventions" /></li>
        </Breadcrumbs>

        <HeaderContextWrapper>
          {this.renderHeader()}

          {this.renderModalJob()}
        </HeaderContextWrapper>

        <div>
          <TabsWrapper
            indicatorColor="primary"
            onChange={this.handleChangeTab}
            textColor="primary"
            value={this.state.currentTab}
          >
            <Tab label={<FormattedMessage id="interventions" />} />
            <Tab label={this.renderCommentsTabLabel()} />
            {this.renderInterruptionTab()}
          </TabsWrapper>

          {this.renderTabContainer()}
        </div>
      </div>
    );
  }
}

Job.defaultProps = {
  jobLoading: true,
};

Job.propTypes = {
  billJob: PropTypes.func.isRequired,
  customerItem: PropTypes.object.isRequired,
  fetchJob: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  job: PropTypes.object.isRequired,
  jobLoading: PropTypes.bool,
  match: PropTypes.object.isRequired,
};

export default withRouter(withCustomerItem(withJob(Job)));
