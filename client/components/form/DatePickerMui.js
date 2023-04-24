import { Icon } from '@material-ui/core';
import { DatePicker } from 'material-ui-pickers';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  
  &&{
    input{
      cursor: pointer;
    }
    div:first-child {
      width: 100%;
    }
  }
`;

const CalendarIcon = styled(Icon)`
  position: absolute;
  bottom: 8px;
  right: 10px;
  color: ${({ theme }) => theme.app.brandColor};
  pointer-events: none;
`;

const DatePickerMui = ({ onChange, value, ...remainingProps }) => (
  <Wrapper>
    <DatePicker
      {...remainingProps}
      cancelLabel="Annuler"
      format="LL"
      onChange={onChange}
      value={value}
    />

    <CalendarIcon>today</CalendarIcon>
  </Wrapper>
);

export default DatePickerMui;
