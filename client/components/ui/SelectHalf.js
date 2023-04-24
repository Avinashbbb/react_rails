import { FormHelperText, InputLabel, Select as MuiSelect, OutlinedInput } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

import HalfFormControl from './HalfFormControl';

const InputLabelWrapper = styled(InputLabel)`
  background: #FFF;
  left: -4px !important;
  padding: 0 5px !important;
  z-index: 2 !important;
`;

const SelectHalf = ({
  children,
  formControlError,
  formControlWidthClass,
  formHelperErrorMsg,
  inputLabelText,
  ...remainingProps
}) => (
  <HalfFormControl classes={{ root: formControlWidthClass }} error={formControlError} variant="outlined">
    <InputLabelWrapper disableAnimation shrink>{inputLabelText}</InputLabelWrapper>

    <MuiSelect
      input={
        <OutlinedInput labelWidth={0} />
      }
      {...remainingProps}
    >
      {children}
    </MuiSelect>

    <FormHelperText>{formHelperErrorMsg}</FormHelperText>
  </HalfFormControl>
);

SelectHalf.defaultProps = {
  children: '',
  formControlError: false,
  formControlWidthClass: '',
  formHelperErrorMsg: '',
};

SelectHalf.propTypes = {
  children: PropTypes.node,
  formControlError: PropTypes.bool,
  formControlWidthClass: PropTypes.string,
  formHelperErrorMsg: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string]),
  inputLabelText: PropTypes.object.isRequired,
};

export default SelectHalf;
