import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import FrequencyTextField from './ui/FrequencyTextField';
import FrequencyWeeklyMultiSelectBox from './ui/FrequencyWeeklyMultiSelectBox';

const RecurrenceWeekly = ({
  error, onDaysChange, onIntervalChange, value,
}) => (
  <Fragment>
    <FrequencyTextField
      error={error}
      inputLabel={<FormattedMessage id="all_the" />}
      sideLabel={<FormattedMessage id="weeks" />}
      onChange={onIntervalChange}
      value={value || ''}
    />

    <FrequencyWeeklyMultiSelectBox onChange={onDaysChange('days')} />
  </Fragment>
);

RecurrenceWeekly.defaultProps = {
  value: null,
};

RecurrenceWeekly.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  onDaysChange: PropTypes.func.isRequired,
  onIntervalChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default RecurrenceWeekly;
