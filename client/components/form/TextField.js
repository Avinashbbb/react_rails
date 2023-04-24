import { TextField as TextFieldMui } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  & .labelMui {
    color: ${({ theme }) => theme.app.curentFontColor};
    text-transform: uppercase;
  }
  & .inputMui {
    background-color: white;
    border: 1px solid ${({ theme }) => theme.app.inputBorderColor};
    border-radius: ${({ theme }) => theme.app.inputBorderRadius};
    padding: ${({ theme }) => theme.app.inputPadding};
    padding-left: ${({ adornment, theme }) => (adornment === 'start' ? '40px' : theme.app.inputPadding)};
    padding-right: ${({ adornment, theme }) => (adornment === 'end' ? '40px' : theme.app.inputPadding)};
  }
  & .formControlMui{
    position: relative;
    margin: 0;
  }
`;

const TextField = ({
  adornment, fullwidth, InputProps, ...remainingProps
}) => (
  <Wrapper adornment={adornment}>
    <TextFieldMui
      {...remainingProps}
      fullWidth={fullwidth}
      classes={{
        root: 'formControlMui',
      }}
      InputProps={{
        defaultValue: '',
        disableUnderline: true,
        classes: {
          root: 'inputWrapperMui',
          input: 'inputMui',
        },
        ...InputProps,
      }}
      InputLabelProps={{
        classes: {
          root: 'labelMui',
        },
        shrink: true,
      }}
    />
  </Wrapper>
);

TextField.defaultProps = {
  adornment: null,
  fullwidth: true,
  InputProps: {},
};

TextField.propTypes = {
  adornment: PropTypes.oneOf([
    null,
    'start',
    'end',
  ]),
  fullwidth: PropTypes.bool,
  InputProps: PropTypes.object,
};

export default TextField;
