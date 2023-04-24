import { Grid, Typography } from '@material-ui/core';
import { parseInt } from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { nTimes } from '../../utils/arrays';

const selectionInitialValue = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  0: false,
};

const initialState = {
  1: selectionInitialValue,
  2: selectionInitialValue,
  3: selectionInitialValue,
  4: selectionInitialValue,
};

const days = [
  { label: <FormattedMessage id="weekdays.mon" />, value: 1 },
  { label: <FormattedMessage id="weekdays.tues" />, value: 2 },
  { label: <FormattedMessage id="weekdays.wed" />, value: 3 },
  { label: <FormattedMessage id="weekdays.thur" />, value: 4 },
  { label: <FormattedMessage id="weekdays.fri" />, value: 5 },
  { label: <FormattedMessage id="weekdays.sat" />, value: 6 },
  { label: <FormattedMessage id="weekdays.sun" />, value: 0 },
];

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

const MultiSelectBox = styled.div`
  border: 1px solid #ececec;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 5px;
  padding: 10px;
  width: 40px;
  height: 40px;
  text-align: center;
  transition: background-color .2s ease-in-out,
              border-color .2s ease-in-out;
  
  &:not(:last-child) {
    margin-right: 5px;
  }
  
  &:hover {
    background-color: #ececec;
    border-color: #4DA1FF;
  }
  
  &.active {
    background-color: #4DA1FF !important;
    border-color: #4DA1FF;
    color: #FFF;  
  }
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
`;

const SelectBoxWrapper = styled.div`
  margin-top: 15px;
`;

const TypographyWrapper = styled(Typography)`
  margin-right: 10px !important;
`;

class FrequencyMonthlyByDaysOfWeek extends PureComponent {
  state = {
    ...initialState,
  };

  handleChange = () => {
    const values = {};

    for (const week of Object.keys(this.state)) {
      const weekData = this.state[week];

      for (const day of Object.keys(this.state[week])) {
        if (!values[day]) {
          values[day] = [];
        }

        if (weekData[day]) {
          values[day].push(parseInt(week));
        }
      }
    }

    this.props.onChange(values);
  };

  handleSelectWeekDay = (day, week) => () => {
    const { [week]: weekValue } = this.state;
    const { [day]: dayValue } = weekValue;

    this.setState({
      [week]: {
        ...weekValue,
        [day]: !dayValue,
      },
    }, this.handleChange);
  };

  renderRows = () => (
    nTimes(4).map(index => (
      <Row key={`week-${index}`}>
        <TypographyWrapper>{index}</TypographyWrapper>

        {this.renderSelectBox(index)}
      </Row>
    ))
  );

  renderSelectBox = row => (
    days.map(({ label, value }) => (
      <MultiSelectBox
        key={`${row}-${value}`}
        className={this.state[row][value] ? 'active' : ''}
        onClick={this.handleSelectWeekDay(value, row)}
      >
        <Typography>{label}</Typography>
      </MultiSelectBox>
    ))
  );

  render() {
    return (
      <SelectBoxWrapper>
        <Grid container spacing={10}>
          <Grid item xs={12} sm={10}>
            <FlexWrapper>
              {this.renderRows()}
            </FlexWrapper>
          </Grid>
        </Grid>
      </SelectBoxWrapper>
    );
  }
}

FrequencyMonthlyByDaysOfWeek.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default FrequencyMonthlyByDaysOfWeek;
