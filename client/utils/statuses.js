import { FormattedMessage } from 'react-intl';
import React from 'react';

export const jobStatuses = {
  BILLING_ERROR: <FormattedMessage id="jobs.statuses.billing_error" />,
  COMPLETED: <FormattedMessage id="jobs.statuses.completed" />,
  IN_PROGRESS: <FormattedMessage id="jobs.statuses.in_progress" />,
  INTERRUPTED: <FormattedMessage id="jobs.statuses.interrupted" />,
  TODO: <FormattedMessage id="jobs.statuses.todo" />,
};
