import { FormControlLabel, Radio } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { Fragment, PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';

import FrequencyMonthlyByDaysOfWeek from './ui/FrequencyMonthlyByDaysOfWeek';
import FrequencyMonthlyByDaysOfMonth from './ui/FrequencyMonthlyByDaysOfMonth';
import FrequencyTextField from './ui/FrequencyTextField';
import RadioGroupRowWrapper from './ui/RadioGroupRowWrapper';

class RecurrenceMonthly extends PureComponent {
  state = {
    type: 'DOM',
  };

  get recurrenceType() {
    return this.state.type === 'DOW' ? 'monthly-DOW' : 'monthly-DOM';
  }

  handleChangeType = ({ target }) => {
    this.setState({
      type: target.value,
    }, () => this.props.onTypeChange(this.recurrenceType));
  };

  renderDays = () => {
    let Component;
    let key;

    if (this.state.type === 'DOW') {
      Component = FrequencyMonthlyByDaysOfWeek;
      key = 'days_of_week';
    } else {
      Component = FrequencyMonthlyByDaysOfMonth;
      key = 'days_of_month';
    }

    return <Component onChange={this.props.onDaysChange(key)} />;
  };

  render() {
    const { error, onIntervalChange, value } = this.props;

    return (
      <Fragment>
        <FrequencyTextField
          error={error}
          inputLabel={<FormattedMessage id="all_the" />}
          sideLabel={<FormattedMessage id="months_for_the" />}
          onChange={onIntervalChange(this.recurrenceType)}
          value={value || ''}
        />

        <RadioGroupRowWrapper onChange={this.handleChangeType} value={this.state.type}>
          <FormControlLabel value="DOM" control={<Radio />} label={<FormattedMessage id="days_of_month" />} />
          <FormControlLabel value="DOW" control={<Radio />} label={<FormattedMessage id="days_of_week" />} />
        </RadioGroupRowWrapper>

        {this.renderDays()}
      </Fragment>
    );
  }
}

RecurrenceMonthly.defaultProps = {
  value: null,
};

RecurrenceMonthly.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  onDaysChange: PropTypes.func.isRequired,
  onIntervalChange: PropTypes.func.isRequired,
  onTypeChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default RecurrenceMonthly;
