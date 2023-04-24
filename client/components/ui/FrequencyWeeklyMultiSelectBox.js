import { FormGroup, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

const initialState = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  saturday: false,
  sunday: false,
};

const weekdays = [
  { label: <FormattedMessage id="weekdays.mon" />, value: 'monday' },
  { label: <FormattedMessage id="weekdays.tues" />, value: 'tuesday' },
  { label: <FormattedMessage id="weekdays.wed" />, value: 'wednesday' },
  { label: <FormattedMessage id="weekdays.thur" />, value: 'thursday' },
  { label: <FormattedMessage id="weekdays.fri" />, value: 'friday' },
  { label: <FormattedMessage id="weekdays.sat" />, value: 'saturday' },
  { label: <FormattedMessage id="weekdays.sun" />, value: 'sunday' },
];

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const MultiSelectBox = styled.div`
  border: 1px solid #ececec;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 8px;
  padding: 10px;
  width: 40px;
  height: 40px;
  text-align: center;
  transition: background-color .2s ease-in-out,
              border-color .2s ease-in-out;
  
  &:not(:last-child) {
    margin-right: 8px;
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

class FrequencyWeeklyMultiSelectBox extends PureComponent {
  state = {
    ...initialState,
  };

  handleChange = () => {
    const values = [];

    for (const key of Object.keys(this.state)) {
      if (this.state[key]) {
        values.push(key);
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

  renderSelectBox = data => (
    [...data.map(({ label, value }) => (
      <MultiSelectBox
        className={this.state[value] ? 'active' : ''}
        key={value}
        onClick={this.handleSelectWeekDay(value)}
        value={value}
      >
        <Typography>{label}</Typography>
      </MultiSelectBox>
    ))]
  );

  render() {
    return (
      <SelectBoxWrapper>
        <FormGroup>
          <FlexWrapper>
            {this.renderSelectBox(weekdays)}
          </FlexWrapper>
        </FormGroup>
      </SelectBoxWrapper>
    );
  }
}

FrequencyWeeklyMultiSelectBox.propTypes = {
  onChange: PropTypes.func.isRequired,
};

export default FrequencyWeeklyMultiSelectBox;
