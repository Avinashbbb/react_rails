import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import FrequencyTextField from './ui/FrequencyTextField';

const RecurrenceDaily = ({ error, onIntervalChange, value }) => (
  <Fragment>
    <FrequencyTextField
      error={error}
      inputLabel={<FormattedMessage id="all_the" />}
      sideLabel={<FormattedMessage id="days" />}
      onChange={onIntervalChange}
      value={value || ''}
    />
  </Fragment>
);

RecurrenceDaily.defaultProps = {
  value: null,
};

RecurrenceDaily.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  onIntervalChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default RecurrenceDaily;
