import { Grid, Typography } from '@material-ui/core';
import { parseInt } from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { nTimes } from '../../utils/arrays';

const initialState = {};

nTimes(31).forEach((day) => { initialState[day] = false; });

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

const SelectBoxWrapper = styled.div`
  margin-top: 15px;
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  
  span {
    width: 25px;
    height: 40px;
    margin-right: 14px;
  }
`;

class FrequencyMonthlyByDaysOfMonth extends PureComponent {
  state = {
    ...initialState,
  };

  handleChange = () => {
    const values = [];

    for (const day of Object.keys(this.state)) {
      if (this.state[day]) {
        values.push(parseInt(day));
      }
    }

    this.props.onChange(values);
  };

  handleSelectWeekDay = day => () => {
    const { [day]: dayValue } = this.state;

    this.setState({
      ...this.state,
      [day]: !dayValue,
    }, this.handleChange);
  };

  renderRows = () => (
    nTimes(5, true).map(row => (
      <Row key={`row-${row}`}>
        {this.renderSelectBox(row)}
      </Row>
    ))
  );

  renderSelectBox = (row) => {
    const daysPerRow = (row !== 4 ? 7 : 3);

    return (
      nTimes(daysPerRow).map((day) => {
        const currentDay = day + (row * 7);

        return (
          <MultiSelectBox
            key={`day-${currentDay}`}
            className={this.state[currentDay] ? 'active' : ''}
            onClick={this.handleSelectWeekDay(currentDay)}
          >
            <Typography>{currentDay}</Typography>
          </MultiSelectBox>
        );
      })
    );
  };

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

FrequencyMonthlyByDaysOfMonth.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default FrequencyMonthlyByDaysOfMonth;
