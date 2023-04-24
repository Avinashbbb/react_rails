import React from 'react';
import { FormattedMessage } from 'react-intl';
import ReactSelect from 'react-select';
import styled from 'styled-components';

import FormGroupWrapper from './FormGroupWrapper';

const FormGroupWrapperAutocomplete = styled(FormGroupWrapper)`
  position: relative;
  z-index: 10;
`;

const Select = styled(ReactSelect)`
  && .react-select__control{
      font-family: ${props => props.theme.app.mainFont};
  }
  
  && .react-select__value-container{
      padding-left: 22px;
  }
  
  && .react-select__menu{
     font-family: ${props => props.theme.app.mainFont};
     z-index: 99999;
  }  
  
  && .react-select__option{
      padding-left: 22px;
      font-family: 14px;
  }
  
  && .react-select__option--is-focused{
      background-color: #00000014;
  }  
  
  && .react-select__option--is-selected{
      background-color: ${props => props.theme.app.mainColor};
  }
`;

const Autocomplete = ({ ...props }) => (
  <FormGroupWrapperAutocomplete>
    <Select
      menuPosition="fixed"
      noOptionsMessage={() => <FormattedMessage id="no_result" />}
      classNamePrefix="react-select"
      {...props}
    />
  </FormGroupWrapperAutocomplete>
);

export default Autocomplete;
