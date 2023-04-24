import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import FrequencyTextField from './ui/FrequencyTextField';

const RecurrenceAnnualy = ({ error, onIntervalChange, value }) => (
  <Fragment>
    <FrequencyTextField
      error={error}
      inputLabel={<FormattedMessage id="all_the" />}
      sideLabel={<FormattedMessage id="years" />}
      onChange={onIntervalChange}
      value={value || ''}
    />
  </Fragment>
);

RecurrenceAnnualy.defaultProps = {
  value: null,
};

RecurrenceAnnualy.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  onIntervalChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default RecurrenceAnnualy;
