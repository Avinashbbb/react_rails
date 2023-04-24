import { FormControl, FormHelperText, InputLabel, Select as MuiSelect, OutlinedInput } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const InputLabelWrapper = styled(InputLabel)`
  background: #FFF;
  left: -4px !important;
  padding: 0 5px !important;
  z-index: 2 !important;
`;

const Select = ({
  children,
  formControlClassName,
  formControlError,
  formHelperErrorMsg,
  inputLabelText,
  ...remainingProps
}) => (
  <FormControl className={formControlClassName} error={formControlError} variant="outlined">
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
  </FormControl>
);

Select.defaultProps = {
  children: '',
  formControlClassName: '',
  formControlError: false,
  formHelperErrorMsg: '',
};

Select.propTypes = {
  children: PropTypes.node,
  formControlClassName: PropTypes.string,
  formControlError: PropTypes.bool,
  formHelperErrorMsg: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string]),
  inputLabelText: PropTypes.object.isRequired,
};

export default Select;
