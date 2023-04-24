import PropTypes from 'prop-types';
import { InputAdornment as InputAdornmentMui } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    position: absolute;
    left: 10px;
    right: initial;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    
    ${({ position }) => `
      left: ${position === 'start' ? '10px' : 'initial'};
      right: ${position === 'end' ? '10px' : 'initial'};
    `}   
`;

const InputAdornment = ({ position, ...remainingProps }) => (
  <Wrapper position={position}>
    <InputAdornmentMui {...remainingProps} />
  </Wrapper>
);

InputAdornment.defaultProps = {
  position: 'start',
};

InputAdornment.propTypes = {
  position: PropTypes.oneOf([
    'start',
    'end',
  ]),
};

export default InputAdornment;
