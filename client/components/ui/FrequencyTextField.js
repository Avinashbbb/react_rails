import { FormControl, FormHelperText, Typography } from '@material-ui/core';
import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';

import TextFieldUi from './TextField';

const TextFieldFlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const SideLabel = styled.span`
  margin-left: 12px;
`;

const FrequencyTextField = ({
  error, inputLabel, sideLabel, value, ...remainingProps
}) => (
  <FormControl error={!!error}>
    <TextFieldFlexWrapper>
      <TextFieldUi
        id="cpbr-job-frequency"
        error={!!error}
        label={inputLabel}
        margin="none"
        type="number"
        value={value || ''}
        {...remainingProps}
      />

      <SideLabel>
        <Typography>
          {sideLabel}
        </Typography>
      </SideLabel>
    </TextFieldFlexWrapper>

    <FormHelperText>{error}</FormHelperText>
  </FormControl>
);

FrequencyTextField.defaultProps = {
  value: '',
};

FrequencyTextField.propTypes = {
  error: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
    PropTypes.string,
  ]).isRequired,
  inputLabel: PropTypes.object.isRequired,
  sideLabel: PropTypes.object.isRequired,
  value: PropTypes.string,
};

export default FrequencyTextField;
